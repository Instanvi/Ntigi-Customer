"use client";

import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import {
  SearchParams,
  ApiResponse,
  ShipmentWithRelations,
  Paginated,
} from "@/types";

export type ClientShipmentDirection = "incoming" | "outgoing";

export function useClientShipments(
  direction: ClientShipmentDirection,
  params?: SearchParams,
  options?: { enabled?: boolean },
) {
  return useQuery<Paginated<ShipmentWithRelations>>({
    queryKey: ["client-app", "shipments", direction, params],
    queryFn: async () => {
      const response = await api.get<ApiResponse<ShipmentWithRelations[]>>(
        `/client-app/shipments/${direction}`,
        { params },
      );

      const resData = response.data;
      if (resData?.success) {
        return {
          data: resData.data || [],
          pagination: resData.pagination || {
            page: 1,
            limit: 20,
            total: (resData.data || []).length,
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
