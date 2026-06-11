"use client";

import * as React from "react";
import { useRouter } from "@/lib/navigation";
import { portalConfig } from "@/lib/portal-config";
import { PortalChromeHeader } from "@/components/portal/shell/portal-chrome-header";
import { cn } from "@/lib/utils";
import { Barcode } from "@phosphor-icons/react";

type PortalHomeHeroProps = {
  className?: string;
  defaultTrackingNo?: string;
};

export function PortalHomeHero({
  className,
  defaultTrackingNo = "",
}: PortalHomeHeroProps) {
  const router = useRouter();
  const { copy } = portalConfig;
  const [trackingNo, setTrackingNo] = React.useState(defaultTrackingNo);

  React.useEffect(() => {
    if (defaultTrackingNo) setTrackingNo(defaultTrackingNo);
  }, [defaultTrackingNo]);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const value = trackingNo.trim().toUpperCase();
    if (!value) return;
    router.push(`/dashboard/track?trackingNo=${encodeURIComponent(value)}`);
  };

  return (
    <section
      className={cn(
        "bg-[#4E6BFA] text-white min-h-[260px] pb-5",
        className,
      )}
    >
      <PortalChromeHeader
        className="pt-[max(1.75rem,env(safe-area-inset-top))] pb-2"
      />
      <div className="px-[var(--portal-header-pad)] pb-1 pt-3">
        <h2 className="mb-3 text-center text-sm font-normal tracking-tight text-white/95">
          {copy.trackHeroTitle}
        </h2>
        <form onSubmit={submit}>
          <div className="flex overflow-hidden rounded-xl bg-white shadow-sm">
            <div className="relative min-w-0 flex-1">
              <Barcode
                size={18}
                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                type="text"
                value={trackingNo}
                onChange={(e) => setTrackingNo(e.target.value.toUpperCase())}
                placeholder={copy.trackHeroPlaceholder}
                className="h-10 w-full border-0 bg-transparent pl-10 pr-2 text-sm font-normal text-slate-900 placeholder:font-normal placeholder:text-slate-400 focus:outline-none focus:ring-0"
                autoCapitalize="characters"
                autoComplete="off"
              />
            </div>
            <button
              type="submit"
              className="inline-flex h-10 shrink-0 items-center justify-center bg-[#4E6BFA] px-6 text-sm font-normal leading-none text-white transition-colors hover:bg-[#4E6BFA]/90 active:bg-[#4E6BFA]/95"
            >
              {copy.trackHeroButton}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}
