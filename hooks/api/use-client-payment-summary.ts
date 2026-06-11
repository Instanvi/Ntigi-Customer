"use client";

import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import type { ApiResponse, ShipmentPaymentSummary } from "@/types";

export function useClientShipmentPaymentSummary(
  trackingNo: string,
  options?: { enabled?: boolean },
) {
  const ref = trackingNo.trim();
  return useQuery({
    queryKey: ["client-app", "shipments", ref, "payment-summary"],
    queryFn: async () => {
      const { data: body } = await api.get<ApiResponse<ShipmentPaymentSummary>>(
        `/client-app/shipments/${encodeURIComponent(ref)}/payment-summary`,
      );
      if (!body?.success || !body.data) {
        throw new Error("Could not load payment summary");
      }
      return body.data;
    },
    enabled: options?.enabled !== false && ref.length >= 3,
  });
}
