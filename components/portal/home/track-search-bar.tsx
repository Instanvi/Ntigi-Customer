"use client";

import { Barcode } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";

export function TrackSearchBar({
  value,
  onChange,
  placeholder,
  buttonLabel,
  className,
}: {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  buttonLabel: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex overflow-hidden rounded-xl bg-white shadow-sm",
        className,
      )}
    >
      <div className="relative min-w-0 flex-1">
        <Barcode
          size={18}
          className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
        />
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value.toUpperCase())}
          placeholder={placeholder}
          className="h-10 w-full border-0 bg-transparent pl-10 pr-2 text-sm font-normal text-slate-800 placeholder:text-slate-400 focus:outline-none"
          autoCapitalize="characters"
          autoComplete="off"
        />
      </div>
      <button
        type="submit"
        className="inline-flex h-10 shrink-0 items-center justify-center bg-[#4E6BFA] px-6 text-sm font-normal leading-none text-white"
      >
        {buttonLabel}
      </button>
    </div>
  );
}
