"use client";

import * as React from "react";
import { useClientPayments } from "@/hooks/api/use-client-payments";
import { NoDataFound } from "@/components/shared/no-data-found";
import { TableSkeleton } from "@/components/shared/table-skeleton";
import { PaymentListCard } from "@/components/portal/payments/payment-list-card";
import {
  PaymentFilterBar,
  type PaymentStatusFilter,
} from "@/components/portal/payments/payment-filter-bar";

export function PaymentList({
  onOpenShipment,
  enabled = true,
}: {
  onOpenShipment?: (trackingNo: string) => void;
  enabled?: boolean;
}) {
  const [statusFilter, setStatusFilter] =
    React.useState<PaymentStatusFilter>("all");

  const { data, isLoading, isError } = useClientPayments(undefined, { enabled });

  const transactions = React.useMemo(() => {
    const rows = data?.data ?? [];
    if (statusFilter === "all") return rows;
    return rows.filter((tx) => tx.status === statusFilter);
  }, [data?.data, statusFilter]);

  return (
    <div>
      <PaymentFilterBar value={statusFilter} onChange={setStatusFilter} />

      <div className="space-y-3 px-[var(--portal-header-pad)] pb-4 pt-2">
        {isLoading ? (
          <TableSkeleton columns={1} rows={4} includeSelectColumn={false} />
        ) : isError ? (
          <div className="portal-card px-4 py-8 text-center text-base text-slate-500">
            Could not load your payments. Please try again.
          </div>
        ) : transactions.length === 0 ? (
          <NoDataFound
            title="No payments yet"
            description="Payments linked to your shipments will appear here."
            icon="inbox"
          />
        ) : (
          transactions.map((tx) => (
            <PaymentListCard
              key={tx.id}
              tx={tx}
              onPress={onOpenShipment}
            />
          ))
        )}
      </div>
    </div>
  );
}
