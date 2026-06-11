"use client";

import { cn } from "@/lib/utils";

const STATUS_STYLES: Record<string, string> = {
  PENDING: "bg-amber-100 text-amber-800",
  PICKED_UP: "bg-sky-100 text-sky-800",
  IN_TRANSIT: "bg-orange-100 text-orange-800",
  ARRIVED: "bg-violet-100 text-violet-800",
  DELIVERED: "bg-emerald-100 text-emerald-800",
  CANCELLED: "bg-slate-200 text-slate-600",
  RETURNED: "bg-rose-100 text-rose-800",
};

export function ShipmentStatusBadge({ status }: { status: string }) {
  const key = status.toUpperCase();
  const label = status.replace(/_/g, " ");

  return (
    <span
      className={cn(
        "inline-flex shrink-0 rounded-full px-2.5 py-0.5 text-[10px] font-normal uppercase tracking-wide",
        STATUS_STYLES[key] ?? "bg-slate-200 text-slate-700",
      )}
    >
      {label}
    </span>
  );
}
