"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";

export type ClientCollectPaymentInput = {
  shipmentId: string;
  journalBatchId: string;
  method: "MOBILE_MONEY" | "BANK_TRANSFER";
  amount: string;
  provider?: "MTN" | "ORANGE";
  paymentPhone?: string;
  memo?: string;
};

export function useClientCollectPayment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: ClientCollectPaymentInput) => {
      const res = await api.post("/client-app/payments/collect", data);
      return res.data;
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["client-app", "payments"] });
      queryClient.invalidateQueries({
        queryKey: [
          "client-app",
          "shipments",
          variables.shipmentId,
          "payment-summary",
        ],
      });
    },
  });
}
