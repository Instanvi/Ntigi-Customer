"use client";

import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { ApiResponse, Paginated, SearchParams, Transaction } from "@/types";

export function useClientPayments(
  params?: SearchParams,
  options?: { enabled?: boolean },
) {
  return useQuery<Paginated<Transaction>>({
    queryKey: ["client-app", "payments", params],
    queryFn: async () => {
      const response = await api.get<ApiResponse<Transaction[]>>(
        "/client-app/payments",
        { params: { limit: 100, ...params } },
      );

      const resData = response.data;
      if (resData?.success) {
        return {
          data: resData.data || [],
          pagination: resData.pagination || {
            page: 1,
            limit: 100,
            total: (resData.data || []).length,
            totalPages: 1,
          },
        };
      }

      return {
        data: [],
        pagination: { page: 1, limit: 100, total: 0, totalPages: 0 },
      };
    },
    enabled: options?.enabled !== false,
  });
}
