"use client";

import { useRouter } from "@/lib/navigation";
import { CaretLeft } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";

export function PortalSubHeader({
  title,
  onBack,
  className,
}: {
  title: string;
  onBack?: () => void;
  className?: string;
}) {
  const router = useRouter();

  return (
    <header
      className={cn(
        "sticky top-0 z-40 flex items-center gap-3 bg-primary px-[var(--portal-header-pad)] py-3 pt-[max(2rem,env(safe-area-inset-top))] text-white",
        className,
      )}
    >
      <button
        type="button"
        aria-label="Go back"
        onClick={onBack ?? (() => router.back())}
        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white text-slate-500 shadow-sm"
      >
        <CaretLeft size={20} weight="bold" />
      </button>
      <h1 className="min-w-0 flex-1 text-center text-base font-normal pr-10">
        {title}
      </h1>
    </header>
  );
}
