"use client";

import * as React from "react";
import { format } from "date-fns";
import { useRouter } from "@/lib/navigation";
import { useClientShipment } from "@/hooks/api/use-client-shipment";
import { PortalShipmentDetailView } from "@/components/portal/parcel/portal-shipment-detail-view";
import { PortalSubHeader } from "@/components/portal/shell/portal-sub-header";
import { PortalPage } from "@/components/portal/shell/portal-page";
import { Skeleton } from "@/components/ui/skeleton";
import { NoDataFound } from "@/components/shared/no-data-found";

export default function ShipmentDetailPage({
  params,
}: {
  params: Promise<{ trackingNo: string }>;
}) {
  const router = useRouter();
  const { trackingNo } = React.use(params);
  const decoded = decodeURIComponent(trackingNo);
  const { data: shipment, isLoading, isError } = useClientShipment(decoded);
  if (isLoading) {
    return (
      <PortalPage>
        <PortalSubHeader title="Shipment" onBack={() => router.push("/shipments")} />
        <div className="space-y-4 p-4">
          <Skeleton className="h-24 w-full rounded-[var(--portal-radius-card)]" />
          <Skeleton className="h-48 w-full rounded-[var(--portal-radius-card)]" />
          <Skeleton className="h-64 w-full rounded-[var(--portal-radius-card)]" />
        </div>
      </PortalPage>
    );
  }

  if (isError || !shipment) {
    return (
      <PortalPage>
        <PortalSubHeader title="Shipment" onBack={() => router.push("/shipments")} />
        <NoDataFound
          title="Shipment not found"
          description="This parcel could not be loaded."
        />
      </PortalPage>
    );
  }

  return (
    <PortalShipmentDetailView
      shipment={shipment}
      onBack={() => router.push("/shipments")}
    />
  );
}
