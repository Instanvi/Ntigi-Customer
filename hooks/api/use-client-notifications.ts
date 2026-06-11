"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { ApiResponse, Paginated } from "@/types";

export type ClientNotificationCategory =
  | "SHIPMENT"
  | "PAYMENT"
  | "BRANCH"
  | "SYSTEM";

export type ClientNotification = {
  id: string;
  category: ClientNotificationCategory;
  title: string;
  content: string;
  isRead: boolean;
  createdAt: string;
  metadata: Record<string, unknown> | null;
};

export function useClientNotifications(options?: { enabled?: boolean }) {
  return useQuery<Paginated<ClientNotification>>({
    queryKey: ["client-app", "notifications"],
    queryFn: async () => {
      const response = await api.get<ApiResponse<ClientNotification[]>>(
        "/client-app/notifications",
        { params: { limit: 50 } },
      );
      const resData = response.data;
      return {
        data: resData.data ?? [],
        pagination: resData.pagination ?? {
          page: 1,
          limit: 50,
          total: resData.data?.length ?? 0,
          totalPages: 1,
        },
      };
    },
    enabled: options?.enabled !== false,
  });
}

export function useClientNotificationUnreadCount(options?: {
  enabled?: boolean;
}) {
  return useQuery({
    queryKey: ["client-app", "notifications", "unread-count"],
    queryFn: async () => {
      const response = await api.get<
        ApiResponse<{ unreadCount: number }>
      >("/client-app/notifications/unread-count");
      return response.data.data?.unreadCount ?? 0;
    },
    enabled: options?.enabled !== false,
    refetchInterval: 60_000,
    retry: false,
  });
}

function invalidateClientNotificationQueries(
  queryClient: ReturnType<typeof useQueryClient>,
) {
  void queryClient.invalidateQueries({
    queryKey: ["client-app", "notifications"],
  });
}

export function useMarkClientNotificationRead() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await api.put(`/client-app/notifications/${id}/read`);
    },
    onSuccess: () => {
      invalidateClientNotificationQueries(queryClient);
    },
  });
}

export function useMarkAllClientNotificationsRead() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      await api.put("/client-app/notifications/read-all");
    },
    onSuccess: () => {
      invalidateClientNotificationQueries(queryClient);
    },
  });
}
