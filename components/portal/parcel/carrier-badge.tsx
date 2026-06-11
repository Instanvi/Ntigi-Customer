"use client";

import Image from "next/image";
import { useAgencyBrand } from "@/components/providers/agency-brand-provider";
import { cn } from "@/lib/utils";

export function CarrierBadge({
  carrierName,
  carrierLogoUrl,
}: {
  /** Linehaul carrier from voyage; when absent, agency logo/name is shown. */
  carrierName?: string | null;
  /** Carrier logo from configuration; shown when carrier is set. */
  carrierLogoUrl?: string | null;
}) {
  const { displayName, logoUrl } = useAgencyBrand();
  const hasCarrier = !!carrierName?.trim();
  const name = hasCarrier ? carrierName!.trim() : displayName;
  const logo = hasCarrier
    ? String(carrierLogoUrl ?? "").trim() || null
    : logoUrl;
  const initial = name.trim().charAt(0).toUpperCase() || "?";

  return (
    <div className="flex flex-col items-center py-4">
      <div
        className={cn(
          "flex h-12 w-12 items-center justify-center overflow-hidden rounded-xl",
          logo ? "bg-white" : hasCarrier ? "bg-primary/10" : "bg-white",
        )}
      >
        {logo ? (
          <Image
            src={logo}
            alt={name}
            width={40}
            height={40}
            className="h-9 w-9 object-contain"
            unoptimized
          />
        ) : (
          <span className="text-base font-normal text-primary">{initial}</span>
        )}
      </div>
      <p className="mt-1.5 text-xs font-normal text-slate-700">{name}</p>
    </div>
  );
}
