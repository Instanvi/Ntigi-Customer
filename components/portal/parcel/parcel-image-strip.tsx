"use client";

import Image from "next/image";
import { X } from "@phosphor-icons/react";

export function ParcelImageStrip({ imageUrls }: { imageUrls: string[] }) {
  const urls = imageUrls.filter(Boolean);

  if (urls.length === 0) {
    return (
      <div className="flex gap-2 px-4 pt-4">
        <div className="flex h-16 w-16 flex-col items-center justify-center rounded-[var(--portal-radius-card)] bg-primary/5 text-slate-400">
          <X size={20} weight="regular" />
          <span className="mt-0.5 text-[10px] font-normal">No image</span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex gap-2 overflow-x-auto px-4 pt-4 scrollbar-none">
      {urls.map((url, i) => (
        <div
          key={`${url}-${i}`}
          className="relative h-16 w-16 shrink-0 overflow-hidden rounded-[var(--portal-radius-card)] bg-slate-100"
        >
          <Image src={url} alt="" fill className="object-cover" unoptimized />
        </div>
      ))}
    </div>
  );
}
