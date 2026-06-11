"use client";

import Image from "next/image";
import { X } from "@phosphor-icons/react";
import type { Package, ShipmentWithRelations } from "@/types";
import {
  resolvePackageLineImage,
  resolvePackageLineLabel,
  resolvePackageLineStatus,
} from "@/lib/portal/package-display";
import {
  getTransitModeIcon,
  resolveShipmentTransitMode,
} from "@/lib/portal/transit-mode";
import { cn } from "@/lib/utils";

function statusLabel(status: string) {
  return status.replace(/_/g, " ");
}

function formatRouteStop(
  stop?: {
    city?: string | null;
    countryCode?: string | null;
    country?: string | null;
    name?: string | null;
  } | null,
) {
  if (!stop) return "—";
  const city = stop.city?.trim();
  const code = stop.countryCode?.trim();
  if (city && code) {
    const short =
      code.length === 3 ? code.slice(0, 2).toUpperCase() : code.toUpperCase();
    return `${city}, ${short}`;
  }
  if (city) return city;
  return stop.name?.trim() || "—";
}

function statusBadgeClass(status: string) {
  const upper = status.toUpperCase();
  if (upper === "IN_TRANSIT") {
    return "bg-[var(--portal-status-transit)] text-white";
  }
  if (upper === "DELIVERED") {
    return "bg-emerald-500 text-white";
  }
  if (upper === "PENDING") {
    return "bg-slate-500 text-white";
  }
  return "bg-slate-400 text-white";
}

export function ShipmentListCard({
  shipment,
  packageLine = null,
  onPress,
  className,
}: {
  shipment: ShipmentWithRelations;
  packageLine?: Package | null;
  onPress: (trackingNo: string) => void;
  className?: string;
}) {
  const imageUrl = resolvePackageLineImage(shipment, packageLine);
  const categoryLabel = resolvePackageLineLabel(shipment, packageLine);
  const packageStatus = resolvePackageLineStatus(shipment);
  const packageCount = shipment.packages?.length ?? 0;
  const transitMode = resolveShipmentTransitMode(shipment);
  const TransitIcon = getTransitModeIcon(transitMode);

  return (
    <button
      type="button"
      onClick={() => onPress(shipment.trackingNo)}
      className={cn(
        "portal-card flex w-full min-h-[168px] cursor-pointer overflow-hidden rounded-none text-left transition-transform active:scale-[0.99]",
        className,
      )}
      aria-label={`View shipment ${shipment.trackingNo}`}
    >
      <div className="relative w-[128px] shrink-0 self-stretch bg-slate-100">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt=""
            fill
            className="object-cover"
            unoptimized
          />
        ) : (
          <div className="flex h-full min-h-[168px] w-full flex-col items-center justify-center text-slate-400">
            <X size={26} weight="regular" />
            <span className="mt-1 text-[10px] font-normal">No image</span>
          </div>
        )}
      </div>

      <div className="flex min-w-0 flex-1 flex-col justify-center gap-3 p-4">
        <div className="flex items-start justify-between gap-3">
          <p className="min-w-0 truncate text-base font-medium capitalize text-slate-900">
            {categoryLabel}
          </p>
          <p className="shrink-0 text-right text-xs font-normal text-slate-800">
            #{shipment.trackingNo}
            {packageLine?.packageNo?.trim() && packageCount > 1 ? (
              <span className="block text-[10px] text-slate-500">
                {packageLine.packageNo}
              </span>
            ) : null}
          </p>
        </div>

        <span
          className={cn(
            "inline-block w-fit rounded-full px-3 py-1 text-[11px] font-normal uppercase tracking-wide",
            statusBadgeClass(packageStatus),
          )}
        >
          {statusLabel(packageStatus)}
        </span>

        <div className="relative flex items-center gap-2 pt-1">
          <div className="min-w-0 flex-1">
            <p className="text-[11px] font-normal text-slate-400">From</p>
            <p className="truncate text-sm font-normal text-slate-900">
              {formatRouteStop(shipment.origin)}
            </p>
          </div>

          <div className="relative flex w-[84px] shrink-0 items-center justify-center px-0.5">
            <div
              className="pointer-events-none absolute top-1/2 right-0 left-0 -translate-y-1/2 border-t border-slate-200"
              aria-hidden
            />
            <div
              className="relative z-10 flex h-10 w-10 items-center justify-center rounded-full bg-[#4E6BFA] text-white shadow-sm"
              title={transitMode}
            >
              <TransitIcon size={18} weight="fill" />
            </div>
          </div>

          <div className="min-w-0 flex-1 text-right">
            <p className="text-[11px] font-normal text-slate-400">To</p>
            <p className="truncate text-sm font-normal text-slate-900">
              {formatRouteStop(shipment.destination)}
            </p>
          </div>
        </div>
      </div>
    </button>
  );
}
