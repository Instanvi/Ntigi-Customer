"use client";

import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import type { ApiResponse, LostParcel } from "@/types";

export function useLostParcels(
  params?: { page?: number; limit?: number; branchId?: string },
  options?: { enabled?: boolean },
) {
  return useQuery({
    queryKey: ["client-app", "lost-parcels", params],
    queryFn: async () => {
      const response = await api.get<ApiResponse<LostParcel[]>>(
        "/client-app/lost-parcels",
        { params },
      );
      const resData = response.data;
      if (resData?.success) {
        return {
          data: resData.data ?? [],
          pagination: resData.pagination ?? {
            page: 1,
            limit: 20,
            total: (resData.data ?? []).length,
            totalPages: 1,
          },
        };
      }
      return {
        data: [],
        pagination: { page: 1, limit: 20, total: 0, totalPages: 0 },
      };
    },
    enabled: options?.enabled !== false,
  });
}

export function useLostParcel(id: string, options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: ["client-app", "lost-parcels", id],
    queryFn: async () => {
      const response = await api.get<ApiResponse<LostParcel>>(
        `/client-app/lost-parcels/${id}`,
      );
      return response.data.data;
    },
    enabled: options?.enabled !== false && !!id,
  });
}
