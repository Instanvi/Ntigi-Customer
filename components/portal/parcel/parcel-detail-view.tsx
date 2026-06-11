"use client";

import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { FilePdf, HandCoins, XCircle, CaretLeft } from "@phosphor-icons/react";
import type { PublicTrackingResult } from "@/hooks/api/use-tracking";
import { PortalDetailHeader } from "@/components/portal/shell/portal-detail-header";
import { CarrierBadge } from "@/components/portal/parcel/carrier-badge";
import {
  resolveCarrierName,
  resolveEstimatedArrivalDate,
} from "@/lib/portal/shipment-display";
import { RouteCorridor } from "@/components/portal/parcel/route-corridor";
import { ParcelImageStrip } from "@/components/portal/parcel/parcel-image-strip";
import { ParcelInfoRows } from "@/components/portal/parcel/parcel-info-rows";
import {
  TrackingTimeline,
  type TimelineEvent,
} from "@/components/portal/parcel/tracking-timeline";
import { DeclineShipmentDialog } from "@/app/[locale]/tracking/_components/decline-shipment-dialog";
import * as React from "react";

function formatDate(value?: string | Date | null) {
  if (!value) return "—";
  try {
    return format(new Date(value), "MMMM d, yyyy");
  } catch {
    return String(value);
  }
}

function formatDateTime(value?: string | null) {
  if (!value) return "—";
  try {
    return format(new Date(value), "d MMMM HH:mm");
  } catch {
    return value;
  }
}

function statusLabel(status: string) {
  return status.replace(/_/g, " ");
}

export function ParcelDetailView({
  shipment,
  onReset,
}: {
  shipment: PublicTrackingResult;
  onReset: () => void;
}) {
  const [isDeclineOpen, setIsDeclineOpen] = React.useState(false);

  const carrierName = resolveCarrierName(shipment);
  const estimatedArrival = resolveEstimatedArrivalDate(shipment);

  const infoRows = [
    {
      label: "Status",
      value: statusLabel(shipment.status),
      highlight: shipment.status === "IN_TRANSIT",
    },
    { label: "Added", value: formatDate(shipment.createdAt) },
    {
      label: "Dispatched",
      value: formatDate(shipment.createdAt),
    },
    {
      label: "Estimated Arrival Date",
      value: formatDate(estimatedArrival ?? null),
    },
  ];

  const timelineEvents: TimelineEvent[] = [
    {
      id: "current",
      timestamp: formatDateTime(new Date().toISOString()),
      subtitle: "Package update",
      title: shipment.currentHolder?.data?.name
        ? `Package arrived at ${shipment.currentHolder.data.name}`
        : shipment.destination?.name
          ? `Heading to ${shipment.destination.name}`
          : "In transit",
      description: shipment.description ?? undefined,
      active: true,
    },
    {
      id: "origin",
      timestamp: formatDateTime(shipment.createdAt),
      title: `Registered at ${shipment.origin?.name ?? "origin"}`,
      description: shipment.origin?.address ?? shipment.origin?.city ?? undefined,
    },
    {
      id: "destination",
      timestamp: formatDate(estimatedArrival ?? null),
      title: `Destination: ${shipment.destination?.name ?? "—"}`,
      description:
        shipment.destination?.address ?? shipment.destination?.city ?? undefined,
    },
  ];

  const handleDownloadInvoice = () => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "/backend/api/v1";
    window.open(
      `${apiUrl}/client-app/tracking/${shipment.trackingNo}/invoice/pdf`,
      "_blank",
    );
  };

  return (
    <div className="min-h-full bg-[var(--portal-detail-bg)] pb-8">
      <PortalDetailHeader title={`PKG - ${shipment.trackingNo}`} onBack={onReset} />

      <div className="bg-[var(--portal-detail-bg)]">
        <CarrierBadge carrierName={carrierName} />
        <RouteCorridor
          origin={shipment.origin?.name ?? "Origin"}
          destination={shipment.destination?.name ?? "Destination"}
          transitMode={shipment.transitMode}
        />
      </div>

      <div className="space-y-4 px-[var(--portal-header-pad)]">
        <div className="portal-card overflow-hidden">
          <ParcelImageStrip imageUrls={[]} />
          <ParcelInfoRows rows={infoRows} />
        </div>

        <TrackingTimeline events={timelineEvents} />
      </div>

      {shipment.invoice ? (
        <div className="portal-card mx-[var(--portal-header-pad)] mt-4 space-y-4 p-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-normal text-slate-900">Invoice</h3>
            <span className="rounded-full bg-orange-100 px-2.5 py-0.5 text-xs font-normal uppercase text-orange-700">
              {shipment.invoice.status}
            </span>
          </div>
          <p className="text-lg font-normal text-slate-900">
            {Number(shipment.invoice.totalAmount).toLocaleString()}{" "}
            {shipment.invoice.currency}
          </p>
          <div className="flex flex-wrap gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="gap-2"
              onClick={handleDownloadInvoice}
            >
              <FilePdf size={16} /> Download
            </Button>
            {shipment.invoice.status !== "PAID" ? (
              <Button type="button" size="sm" className="gap-2 bg-primary">
                <HandCoins size={16} /> Pay
              </Button>
            ) : null}
            {shipment.status !== "CANCELLED" &&
            shipment.status !== "DELIVERED" ? (
              <Button
                type="button"
                variant="destructive"
                size="sm"
                className="gap-2"
                onClick={() => setIsDeclineOpen(true)}
              >
                <XCircle size={16} /> Decline
              </Button>
            ) : null}
          </div>
        </div>
      ) : null}

      <div className="px-[var(--portal-header-pad)] pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={onReset}
          className="portal-btn h-9 w-full gap-2 rounded-[var(--portal-radius-card)]"
        >
          <CaretLeft weight="bold" />
          New search
        </Button>
      </div>

      <DeclineShipmentDialog
        open={isDeclineOpen}
        onOpenChange={setIsDeclineOpen}
        trackingNo={shipment.trackingNo}
        onSuccess={() => window.location.reload()}
      />
    </div>
  );
}
