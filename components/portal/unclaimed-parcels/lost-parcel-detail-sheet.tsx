"use client";

import Image from "next/image";
import { format } from "date-fns";
import { useTranslations } from "next-intl";
import type { LostParcel } from "@/types";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

function formatDims(parcel: LostParcel): string {
  const l = parcel.length?.trim();
  const w = parcel.width?.trim();
  const h = parcel.height?.trim();
  if (l && w && h) return `${l} × ${w} × ${h} cm`;
  return "—";
}

export function LostParcelDetailSheet({
  parcel,
  open,
  onOpenChange,
}: {
  parcel: LostParcel | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const t = useTranslations("portal.unclaimedParcels");

  if (!parcel) return null;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="max-h-[90dvh] overflow-y-auto rounded-t-2xl">
        <SheetHeader>
          <SheetTitle className="font-mono text-base">
            {parcel.referenceNo}
          </SheetTitle>
        </SheetHeader>

        {parcel.imageUrls?.length ? (
          <div className="mt-4 flex gap-2 overflow-x-auto pb-2">
            {parcel.imageUrls.map((url) => (
              <div
                key={url}
                className="relative h-40 w-40 shrink-0 overflow-hidden rounded-xl bg-[#E8EEF4]"
              >
                <Image
                  src={url}
                  alt=""
                  fill
                  className="object-cover"
                  unoptimized
                />
              </div>
            ))}
          </div>
        ) : null}

        <div className="mt-4 space-y-3 text-sm">
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
              {t("detailDescription")}
            </p>
            <p className="mt-1 text-slate-900">{parcel.description}</p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                {t("detailBranch")}
              </p>
              <p className="mt-1 text-slate-900">
                {parcel.branchName ?? "—"}
              </p>
            </div>
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                {t("detailFoundAt")}
              </p>
              <p className="mt-1 text-slate-900">
                {parcel.foundAt
                  ? format(new Date(parcel.foundAt), "dd MMM yyyy")
                  : "—"}
              </p>
            </div>
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                {t("detailDimensions")}
              </p>
              <p className="mt-1 text-slate-900">{formatDims(parcel)}</p>
            </div>
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                {t("detailWeight")}
              </p>
              <p className="mt-1 text-slate-900">
                {parcel.weight ? `${parcel.weight} kg` : "—"}
              </p>
            </div>
            {parcel.color ? (
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                  {t("detailColor")}
                </p>
                <p className="mt-1 text-slate-900">{parcel.color}</p>
              </div>
            ) : null}
          </div>

          {parcel.markings ? (
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                {t("detailMarkings")}
              </p>
              <p className="mt-1 text-slate-900">{parcel.markings}</p>
            </div>
          ) : null}

          <p className="rounded-lg bg-[#F4F7FB] p-3 text-xs text-slate-600">
            {t("detailHint")}
          </p>
        </div>
      </SheetContent>
    </Sheet>
  );
}
