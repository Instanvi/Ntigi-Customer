"use client";

import { cn } from "@/lib/utils";

export type ShipmentStatusFilter =
  | "all"
  | "PENDING"
  | "IN_TRANSIT"
  | "DELIVERED";

const FILTERS: { id: ShipmentStatusFilter; label: string }[] = [
  { id: "all", label: "All" },
  { id: "PENDING", label: "pending" },
  { id: "IN_TRANSIT", label: "In Transit" },
  { id: "DELIVERED", label: "Delivered" },
];

export function ShipmentFilterBar({
  value,
  onChange,
  className,
}: {
  value: ShipmentStatusFilter;
  onChange: (value: ShipmentStatusFilter) => void;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "portal-filter-strip flex gap-2 overflow-x-auto px-[var(--portal-header-pad)] py-2 scrollbar-none",
        className,
      )}
    >
      {FILTERS.map((filter) => {
        const active = value === filter.id;
        return (
          <button
            key={filter.id}
            type="button"
            onClick={() => onChange(filter.id)}
            className={cn(
              "shrink-0 rounded-full px-4 py-2 text-xs font-normal capitalize transition-colors",
              active
                ? "bg-primary text-white shadow-sm"
                : "border border-slate-200 bg-white text-slate-500",
            )}
          >
            {filter.label}
          </button>
        );
      })}
    </div>
  );
}
