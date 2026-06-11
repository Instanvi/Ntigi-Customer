import axios from "axios";
import { SessionUser } from "@/types/auth";
import { ApiErrorResponse } from "@/types";
import {
  getCachedAccessToken,
  setCachedAccessToken,
} from "@/lib/http/session-token";
import {
  agencySlug,
  CUSTOMER_AGENCY_SLUG_HEADER,
} from "@/lib/agency-config";
import { resolveApiBaseUrl } from "@/lib/http/resolve-api-base-url";

/** Base URL for REST API calls (`NEXT_PUBLIC_API_URL` + backend host in dev). */
export const API_BASE_URL = resolveApiBaseUrl();

export class ApiError extends Error {
  statusCode: number;
  errorCode: string;
  details?: unknown;

  constructor(response: ApiErrorResponse) {
    super(response.error);
    this.name = "ApiError";
    // The statusCode might be in response.details.statusCode based on the provided JSON
    this.statusCode = response.details?.statusCode || 500;
    this.errorCode = response.errorCode;
    this.details = response.details?.details;
  }
}

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
    [CUSTOMER_AGENCY_SLUG_HEADER]: agencySlug,
  },
});

// Add FormData handling: default JSON Content-Type breaks multipart boundaries in browsers
api.interceptors.request.use((config) => {
  if (config.data instanceof FormData) {
    config.headers.delete("Content-Type");
  }
  return config;
});

// Attach backend JWT from cache; refresh cache only when missing.
api.interceptors.request.use(async (config) => {
  if (typeof window === "undefined") return config;

  let token = getCachedAccessToken();
  if (!token) {
    const { getSession } = await import("next-auth/react");
    const session = await getSession();
    const user = session?.user as SessionUser | undefined;
    token = user?.accessToken ?? null;
    setCachedAccessToken(token);
  }
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (axios.isAxiosError(error)) {
      const status = error.response?.status;

      // Auth handling:
      // - 401: session/token invalid -> sign out and go to login.
      // - 403: authenticated but forbidden -> keep session and show unauthorized page.
      // (except network quote search — stay on page, show fallback UI)
      const reqUrl = String(error.config?.url ?? "");
      const method = String(error.config?.method ?? "get").toLowerCase();
      const isNetworkQuoteSearch =
        reqUrl.includes("/pricing/models/quote/search") ||
        reqUrl.includes("/route-pricing-models/quote/search");
      const isMutation = method !== "get" && method !== "head";
      if (status === 401 && typeof window !== "undefined" && !isNetworkQuoteSearch) {
        setCachedAccessToken(null);
        const { clearPermissionsStorage } = await import(
          "@/store/use-permissions-store"
        );
        clearPermissionsStorage();
        const { signOut } = await import("next-auth/react");
        await signOut({ callbackUrl: "/login", redirect: true });
      }
      if (
        status === 403 &&
        typeof window !== "undefined" &&
        !isNetworkQuoteSearch &&
        !isMutation
      ) {
        window.location.assign("/unauthorized");
      }

      if (status === 431) {
        return Promise.reject(
          new Error(
            "Request headers are too large. Try signing out and back in, or clear site cookies for this domain.",
          ),
        );
      }

      if (error.response?.data) {
        const data = error.response.data as ApiErrorResponse;
        return Promise.reject(new ApiError(data));
      }
    }
    return Promise.reject(error);
  },
);

// Utility to handle Axios errors
export function handleApiError(error: unknown): never {
  if (error instanceof ApiError) {
    throw error;
  }

  if (axios.isAxiosError(error) && error.response?.data) {
    const data = error.response.data as ApiErrorResponse;
    throw new ApiError(data);
  }

  if (error instanceof Error) {
    throw error;
  }

  throw new Error("An unknown error occurred");
}
