"use client";

import { format } from "date-fns";
import * as React from "react";
import type { ShipmentWithRelations } from "@/types";
import { PortalDetailHeader } from "@/components/portal/shell/portal-detail-header";
import { CarrierBadge } from "@/components/portal/parcel/carrier-badge";
import {
  resolveCarrierName,
  resolveEstimatedArrivalDate,
} from "@/lib/portal/shipment-display";
import { RouteCorridor } from "@/components/portal/parcel/route-corridor";
import { resolvePackageLineStatus } from "@/lib/portal/package-display";
import { resolveShipmentTransitMode } from "@/lib/portal/transit-mode";
import { ParcelImageStrip } from "@/components/portal/parcel/parcel-image-strip";
import { ParcelInfoRows } from "@/components/portal/parcel/parcel-info-rows";
import {
  TrackingTimeline,
  type TimelineEvent,
} from "@/components/portal/parcel/tracking-timeline";
import { useClientShipmentPaymentSummary } from "@/hooks/api/use-client-payment-summary";
import { ShipmentInvoicePaySheet } from "@/components/portal/payments/shipment-invoice-pay-sheet";
import { Button } from "@/components/ui/button";
import { HandCoins } from "@phosphor-icons/react";

function formatDate(value?: string | Date | null) {
  if (!value) return "—";
  try {
    return format(new Date(value), "MMMM d, yyyy");
  } catch {
    return String(value);
  }
}

function formatDateTime(value?: string | Date | null) {
  if (!value) return "—";
  try {
    return format(new Date(value), "d MMMM HH:mm");
  } catch {
    return String(value);
  }
}

function statusLabel(status: string) {
  return status.replace(/_/g, " ");
}

function packageImages(shipment: ShipmentWithRelations): string[] {
  return (shipment.packages ?? [])
    .map((pkg) => pkg.imageUrl ?? pkg.packageImageUrl)
    .filter((url): url is string => typeof url === "string" && !!url.trim());
}

function buildTimeline(
  shipment: ShipmentWithRelations,
  packageStatus: string,
): TimelineEvent[] {
  const events: TimelineEvent[] = [
    {
      id: "current",
      timestamp: formatDateTime(new Date()),
      subtitle: "Package update",
      title:
        packageStatus === "IN_TRANSIT"
          ? `In transit to ${shipment.destination?.name ?? "destination"}`
          : statusLabel(packageStatus),
      description:
        shipment.description ??
        shipment.packages?.[0]?.description ??
        undefined,
      active: true,
    },
    {
      id: "dispatched",
      timestamp: formatDateTime(shipment.createdAt),
      title: `Registered at ${shipment.origin?.name ?? "origin"}`,
      description: shipment.origin?.city ?? undefined,
    },
    {
      id: "destination",
      timestamp: formatDate(resolveEstimatedArrivalDate(shipment)),
      title: `Destination: ${shipment.destination?.name ?? "—"}`,
      description: shipment.destination?.city ?? undefined,
    },
  ];

  return events;
}

export function PortalShipmentDetailView({
  shipment,
  onBack,
}: {
  shipment: ShipmentWithRelations;
  onBack: () => void;
}) {
  const [payOpen, setPayOpen] = React.useState(false);
  const { data: paymentSummary } = useClientShipmentPaymentSummary(
    shipment.trackingNo,
  );
  const balanceDue = Number.parseFloat(
    paymentSummary?.balanceOutstanding ?? "0",
  );
  const showPay = Number.isFinite(balanceDue) && balanceDue > 0;

  const carrierName = resolveCarrierName(shipment);
  const packageStatus = resolvePackageLineStatus(shipment);

  const infoRows = [
    {
      label: "Status",
      value: statusLabel(packageStatus),
      highlight: packageStatus === "IN_TRANSIT",
    },
    { label: "Added", value: formatDate(shipment.createdAt) },
    {
      label: "Dispatched",
      value: formatDate(shipment.pickupDate ?? shipment.createdAt),
    },
    {
      label: "Estimated Arrival Date",
      value: formatDate(resolveEstimatedArrivalDate(shipment)),
    },
  ];

  const transitMode = resolveShipmentTransitMode(shipment);

  return (
    <div className="min-h-full bg-[var(--portal-detail-bg)] pb-8">
      <PortalDetailHeader
        title={`PKG - ${shipment.trackingNo}`}
        onBack={onBack}
      />

      <div className="bg-[var(--portal-detail-bg)]">
        <CarrierBadge carrierName={carrierName} />
        <RouteCorridor
          origin={shipment.origin?.name ?? "Origin"}
          destination={shipment.destination?.name ?? "Destination"}
          transitMode={transitMode}
        />
      </div>

      <div className="space-y-4 px-[var(--portal-header-pad)]">
        <div className="portal-card overflow-hidden">
          <ParcelImageStrip imageUrls={packageImages(shipment)} />
          <ParcelInfoRows rows={infoRows} />
        </div>

        {showPay && paymentSummary ? (
          <div className="portal-card space-y-3 p-4">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-sm font-medium text-slate-900">
                  Freight invoice due
                </p>
                <p className="text-lg font-semibold text-[var(--portal-primary,#263070)]">
                  {balanceDue.toLocaleString(undefined, {
                    maximumFractionDigits: 0,
                  })}{" "}
                  XAF
                </p>
              </div>
              <Button
                type="button"
                size="sm"
                className="gap-2 bg-primary"
                onClick={() => setPayOpen(true)}
              >
                <HandCoins size={16} /> Pay
              </Button>
            </div>
            <p className="text-xs text-slate-500">
              Pay your shipment invoice to collect your parcel at the branch.
            </p>
          </div>
        ) : null}

        <TrackingTimeline events={buildTimeline(shipment, packageStatus)} />
      </div>

      {paymentSummary ? (
        <ShipmentInvoicePaySheet
          open={payOpen}
          onOpenChange={setPayOpen}
          trackingNo={shipment.trackingNo}
          summary={paymentSummary}
        />
      ) : null}
    </div>
  );
}
