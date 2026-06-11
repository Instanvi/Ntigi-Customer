"use client";

import { portalConfig } from "@/lib/portal-config";
import { PortalChromeHeader } from "@/components/portal/shell/portal-chrome-header";
import { TrackingVerifyForm } from "@/components/portal/tracking/tracking-verify-form";
import type { TrackingFormValues } from "@/components/portal/tracking/tracking-verify-form";
import { cn } from "@/lib/utils";

export function PortalTrackingHero({
  defaultValues,
  onSubmit,
  isLoading,
  className,
}: {
  defaultValues?: Partial<TrackingFormValues>;
  onSubmit: (values: TrackingFormValues) => void;
  isLoading?: boolean;
  className?: string;
}) {
  const { copy } = portalConfig;

  return (
    <section className={cn("bg-primary text-white", className)}>
      <PortalChromeHeader />
      <div className="px-[var(--portal-header-pad)] pb-7 pt-1">
        <h2 className="mb-1 text-center text-base font-normal tracking-tight">
          {copy.trackHeroTitle}
        </h2>
        <p className="mb-4 text-center text-sm text-white/80">
          {copy.trackVerifySubtitle}
        </p>
        <div className="rounded-xl bg-white p-4 shadow-sm">
          <TrackingVerifyForm
            variant="hero"
            defaultValues={defaultValues}
            onSubmit={onSubmit}
            isLoading={isLoading}
          />
        </div>
      </div>
    </section>
  );
}
