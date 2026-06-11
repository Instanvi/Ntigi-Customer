"use client";

import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { ApiResponse } from "@/types";
import type { ClientNotification } from "@/hooks/api/use-client-notifications";

export function useClientHomeNotices(options?: { enabled?: boolean; limit?: number }) {
  const limit = options?.limit ?? 5;

  return useQuery<ClientNotification[]>({
    queryKey: ["client-app", "notifications", "home-notices", limit],
    queryFn: async () => {
      const response = await api.get<ApiResponse<ClientNotification[]>>(
        "/client-app/notifications/home-notices",
        { params: { limit } },
      );
      return response.data.data ?? [];
    },
    enabled: options?.enabled !== false,
    retry: false,
  });
}
