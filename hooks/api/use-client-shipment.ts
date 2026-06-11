"use client";

import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { ApiResponse, ShipmentWithRelations } from "@/types";

export function useClientShipment(
  trackingNo: string,
  options?: { enabled?: boolean },
) {
  return useQuery({
    queryKey: ["client-app", "shipment", trackingNo],
    queryFn: async () => {
      const response = await api.get<ApiResponse<ShipmentWithRelations>>(
        `/client-app/shipments/${encodeURIComponent(trackingNo)}`,
      );
      if (!response.data?.success || !response.data.data) {
        throw new Error("Shipment not found");
      }
      return response.data.data;
    },
    enabled: !!trackingNo && options?.enabled !== false,
  });
}
