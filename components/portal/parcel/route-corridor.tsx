"use client";

import { getTransitModeIcon } from "@/lib/portal/transit-mode";

export function RouteCorridor({
  origin,
  destination,
  transitMode,
}: {
  origin: string;
  destination: string;
  transitMode?: string;
}) {
  const Icon = getTransitModeIcon(transitMode);

  const dashLine =
    "h-0 min-w-[20px] flex-1 border-t-[2.5px] border-dashed border-slate-500";

  return (
    <div className="flex items-center gap-2 px-4 pb-4">
      <div className="min-w-0 flex-1 text-center">
        <p className="truncate text-sm font-normal text-slate-900">{origin}</p>
      </div>
      <div className={dashLine} aria-hidden />
      <div className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary text-white shadow-sm">
        <Icon size={18} weight="fill" />
      </div>
      <div className={dashLine} aria-hidden />
      <div className="min-w-0 flex-1 text-center">
        <p className="truncate text-sm font-normal text-slate-900">
          {destination}
        </p>
      </div>
    </div>
  );
}
