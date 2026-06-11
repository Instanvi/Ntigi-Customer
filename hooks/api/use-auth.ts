"use client";

import { useMutation } from "@tanstack/react-query";
import { isAxiosError } from "axios";
import { api } from "@/lib/api";
import { signIn } from "next-auth/react";
import { ApiResponse, CheckUserResponse } from "@/types";
import { clientAppAuthHeaders } from "@/lib/http/client-app-auth-headers";

export interface ClientAppLoginStartResponse extends CheckUserResponse {
  otpSent?: boolean;
}

const LOGIN_SERVICE_UNAVAILABLE =
  "Login service is unavailable. Please try again in a moment or contact support.";

/**
 * Customer portal login: one request checks the client and sends LOGIN OTP.
 */
export function useClientAppLoginStart() {
  return useMutation({
    mutationFn: async (identifier: string) => {
      const id = identifier.trim();
      console.debug("[ui][client-app-auth] login-start", { identifier: id });
      try {
        const response = await api.post<
          ApiResponse<ClientAppLoginStartResponse>
        >(
          "/client-app/auth/login/start",
          { identifier: id },
          { headers: clientAppAuthHeaders() },
        );
        console.debug("[ui][client-app-auth] login-start success", {
          identifier: id,
          exists: response.data?.data?.exists,
          otpSent: response.data?.data?.otpSent,
        });
        return response.data.data;
      } catch (e) {
        console.debug("[ui][client-app-auth] login-start error", {
          identifier: id,
          error: e,
        });
        if (isAxiosError(e) && e.response?.status === 404) {
          throw new Error(LOGIN_SERVICE_UNAVAILABLE);
        }
        throw e;
      }
    },
  });
}

export function useClientAppResendOtp() {
  return useMutation({
    mutationFn: async (identifier: string) => {
      console.debug("[ui][client-app-auth] resend-otp", { identifier });
      const response = await api.post(
        "/client-app/auth/otp/resend",
        { identifier: identifier.trim() },
        { headers: clientAppAuthHeaders() },
      );
      console.debug("[ui][client-app-auth] resend-otp success", { identifier });
      return response.data;
    },
  });
}

/** OTP sign-in via NextAuth → POST /client-app/auth/otp/verify */
export function useLogin() {
  return useMutation({
    mutationFn: async (values: { identifier: string; password?: string }) => {
      const otpPrefix = "otp:";
      const raw = String(values.password ?? "");
      if (!raw.startsWith(otpPrefix)) {
        throw new Error("Customer portal sign-in uses a verification code only.");
      }

      const result = await signIn("credentials", {
        identifier: values.identifier,
        password: raw,
        redirect: false,
      });

      if (result?.error) throw new Error("Invalid verification code");
      return result;
    },
  });
}
