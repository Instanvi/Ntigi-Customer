"use client";

import type { Icon } from "@phosphor-icons/react";
import { CaretRight } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";

export function QuickActionRow({
  label,
  icon: IconComponent,
  onClick,
  className,
  iconAccent = "primary",
}: {
  label: string;
  icon: Icon;
  onClick?: () => void;
  className?: string;
  /** Locations pin uses orange per mockup; other icons use brand primary on white circle. */
  iconAccent?: "primary" | "orange";
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex min-h-[3.5rem] w-full items-center gap-3 rounded-none bg-[#4E6BFA] px-3.5 py-3.5 text-left text-white active:scale-[0.99] transition-transform",
        className,
      )}
    >
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white">
        <IconComponent
          size={20}
          weight="regular"
          className={cn(
            iconAccent === "orange" ? "text-[#F39C12]" : "text-[#4E6BFA]",
          )}
        />
      </div>
      <span className="min-w-0 flex-1 text-sm font-normal leading-snug">
        {label}
      </span>
      <CaretRight
        size={16}
        className="shrink-0 text-white"
        weight="regular"
      />
    </button>
  );
}
