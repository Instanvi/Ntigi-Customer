"use client";

import { useRouter } from "@/lib/navigation";
import { CaretLeft, Export } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";

export function PortalDetailHeader({
  title,
  onBack,
  onShare,
  className,
}: {
  title: string;
  onBack?: () => void;
  onShare?: () => void;
  className?: string;
}) {
  const router = useRouter();

  const handleShare = () => {
    if (onShare) {
      onShare();
      return;
    }
    if (typeof navigator !== "undefined" && navigator.share) {
      void navigator.share({ title, url: window.location.href });
    }
  };

  return (
    <header
      className={cn(
        "sticky top-0 z-40 flex items-center gap-3 bg-[var(--portal-detail-bg)] px-[var(--portal-header-pad)] py-3 pt-[max(2rem,env(safe-area-inset-top))]",
        className,
      )}
    >
      <button
        type="button"
        aria-label="Go back"
        onClick={onBack ?? (() => router.back())}
        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white text-slate-600 shadow-[0_1px_4px_rgba(15,23,42,0.08)]"
      >
        <CaretLeft size={18} weight="regular" />
      </button>
      <h1 className="min-w-0 flex-1 truncate text-center text-sm font-normal text-slate-800">
        {title}
      </h1>
      <button
        type="button"
        aria-label="Share"
        onClick={handleShare}
        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary text-white shadow-[0_1px_4px_rgba(78,107,250,0.35)]"
      >
        <Export size={18} weight="regular" />
      </button>
    </header>
  );
}
