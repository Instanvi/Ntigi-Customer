"use client";

import Image from "next/image";
import type { LostParcel } from "@/types";
import { cn } from "@/lib/utils";

function formatDims(parcel: LostParcel): string | null {
  const l = parcel.length?.trim();
  const w = parcel.width?.trim();
  const h = parcel.height?.trim();
  if (l && w && h) return `${l}×${w}×${h} cm`;
  return null;
}

export function LostParcelCard({
  parcel,
  onPress,
}: {
  parcel: LostParcel;
  onPress?: () => void;
}) {
  const imageUrl = parcel.imageUrls?.[0];
  const dims = formatDims(parcel);

  return (
    <button
      type="button"
      onClick={onPress}
      className={cn(
        "w-full rounded-[var(--portal-radius-card)] bg-white p-3 text-left shadow-sm transition active:scale-[0.99]",
        onPress && "cursor-pointer",
      )}
    >
      <div className="flex gap-3">
        <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-[#E8EEF4]">
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt=""
              fill
              className="object-cover"
              unoptimized
            />
          ) : (
            <div className="flex h-full items-center justify-center text-xs text-slate-400">
              No photo
            </div>
          )}
        </div>
        <div className="min-w-0 flex-1">
          <p className="font-mono text-xs font-semibold text-[#263070]">
            {parcel.referenceNo}
          </p>
          <p className="mt-1 line-clamp-2 text-sm font-medium text-slate-900">
            {parcel.description}
          </p>
          <p className="mt-1 text-xs text-slate-500">
            {parcel.branchName ?? parcel.branchCity ?? "Branch"}
          </p>
          <div className="mt-2 flex flex-wrap gap-2 text-xs text-slate-600">
            {dims ? <span>{dims}</span> : null}
            {parcel.weight ? <span>{parcel.weight} kg</span> : null}
            {parcel.color ? <span>{parcel.color}</span> : null}
          </div>
        </div>
      </div>
    </button>
  );
}
