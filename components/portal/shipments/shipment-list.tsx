"use client";

import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  useClientShipments,
} from "@/hooks/api/use-client-shipments";
import { TableSkeleton } from "@/components/shared/table-skeleton";
import { NoDataFound } from "@/components/shared/no-data-found";
import { ShipmentListCard } from "@/components/portal/shipments/shipment-list-card";
import {
  ShipmentFilterBar,
  type ShipmentStatusFilter,
} from "@/components/portal/shipments/shipment-filter-bar";
import { expandShipmentsToPackageEntries } from "@/lib/portal/package-display";
import type { ShipmentWithRelations } from "@/types";

export function ShipmentList({
  onOpenShipment,
  enabled = true,
}: {
  onOpenShipment: (trackingNo: string) => void;
  enabled?: boolean;
}) {
  const [statusFilter, setStatusFilter] =
    React.useState<ShipmentStatusFilter>("all");
  const [page, setPage] = React.useState(1);

  const onStatusFilterChange = (filter: ShipmentStatusFilter) => {
    setStatusFilter(filter);
    setPage(1);
  };

  const listParams = {
    status: statusFilter === "all" ? undefined : statusFilter,
    page: page.toString(),
    limit: "20",
  };

  const { data: outgoingData, isLoading: isOutgoingLoading } =
    useClientShipments("outgoing", listParams, { enabled });

  const { data: incomingData, isLoading: isIncomingLoading } =
    useClientShipments("incoming", listParams, { enabled });

  const isLoading = isOutgoingLoading || isIncomingLoading;

  const packageEntries = React.useMemo(() => {
    const merged = [
      ...(outgoingData?.data ?? []),
      ...(incomingData?.data ?? []),
    ] as ShipmentWithRelations[];
    const unique = new Map<string, ShipmentWithRelations>();
    for (const item of merged) {
      unique.set(item.id, item);
    }
    return expandShipmentsToPackageEntries(Array.from(unique.values()));
  }, [outgoingData?.data, incomingData?.data]);

  const totalOutgoing = outgoingData?.pagination?.total ?? 0;
  const totalIncoming = incomingData?.pagination?.total ?? 0;
  const totalPages = Math.max(
    outgoingData?.pagination?.totalPages ?? 1,
    incomingData?.pagination?.totalPages ?? 1,
  );

  return (
    <div>
      <ShipmentFilterBar value={statusFilter} onChange={onStatusFilterChange} />

      <div className="space-y-3 px-[var(--portal-header-pad)] pb-4 pt-2">
        {isLoading ? (
          <TableSkeleton columns={1} rows={4} includeSelectColumn={false} />
        ) : packageEntries.length === 0 ? (
          <NoDataFound
            title="No shipments"
            description="Try another filter or check back later."
            icon="shipment"
          />
        ) : (
          packageEntries.map((entry) => (
            <ShipmentListCard
              key={`${entry.shipment.id}:${entry.packageLine?.id ?? "shipment"}`}
              shipment={entry.shipment}
              packageLine={entry.packageLine}
              onPress={onOpenShipment}
            />
          ))
        )}

        {totalPages > 1 ? (
          <div className="flex items-center justify-between rounded-[var(--portal-radius-card)] bg-white px-4 py-3 shadow-sm">
            <span className="text-sm font-normal text-slate-400">
              Page {page} · {totalOutgoing + totalIncoming} total
            </span>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                className="h-9 w-9 rounded-lg p-0"
                disabled={page === 1}
                onClick={() => setPage((p) => p - 1)}
              >
                <ChevronLeft size={16} />
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="h-9 w-9 rounded-lg p-0"
                disabled={page >= totalPages}
                onClick={() => setPage((p) => p + 1)}
              >
                <ChevronRight size={16} />
              </Button>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
