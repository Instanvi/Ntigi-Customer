"use client";

import { cn } from "@/lib/utils";

export type ParcelInfoRow = {
  label: string;
  value: string;
  highlight?: boolean;
};

export function ParcelInfoRows({ rows }: { rows: ParcelInfoRow[] }) {
  return (
    <div className="divide-y divide-slate-200/80 px-4 pb-1">
      {rows.map((row) => (
        <div
          key={row.label}
          className="flex items-center justify-between gap-4 py-3"
        >
          <span className="text-sm text-slate-500">{row.label}</span>
          <span
            className={cn(
              "text-right text-sm font-normal",
              row.highlight
                ? "text-[var(--portal-status-transit)]"
                : "text-slate-800",
            )}
          >
            {row.value}
          </span>
        </div>
      ))}
    </div>
  );
}
