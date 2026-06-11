"use client";

import { cn } from "@/lib/utils";

export type PaymentStatusFilter = "all" | "PENDING" | "COMPLETED" | "FAILED";

const FILTERS: { id: PaymentStatusFilter; label: string }[] = [
  { id: "all", label: "All" },
  { id: "PENDING", label: "pending" },
  { id: "COMPLETED", label: "Paid" },
  { id: "FAILED", label: "Failed" },
];

export function PaymentFilterBar({
  value,
  onChange,
  className,
}: {
  value: PaymentStatusFilter;
  onChange: (value: PaymentStatusFilter) => void;
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
