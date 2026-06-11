import { api } from "@/lib/api";
import type { SessionUser } from "@/types/auth";

type MeResponse = {
  success: boolean;
  data?: {
    user?: SessionUser;
  };
};

/** Load permission codes from the API (authoritative; not stored in JWT). */
export async function fetchPermissionCodesFromApi(): Promise<string[]> {
  const { data } = await api.get<MeResponse>("/client-app/me", {
    params: { refresh: "true" },
  });
  return data?.data?.user?.permissions ?? [];
}
