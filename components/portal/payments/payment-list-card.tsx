"use client";

import { format } from "date-fns";
import { Money, Receipt } from "@phosphor-icons/react";
import type { Transaction } from "@/types";
import { portalConfig } from "@/lib/portal-config";
import { cn } from "@/lib/utils";

function formatAmount(amount: string) {
  const value = Number.parseFloat(amount);
  if (Number.isNaN(value)) return amount;
  return `${value.toLocaleString("en-US")} FCFA`;
}

function paymentTitle(tx: Transaction) {
  const kind = tx.entryKind ?? "PAYMENT";
  if (kind === "REFUND") return "Refund";
  if (kind === "ADJUSTMENT") return "Adjustment";
  return "Payment";
}

function statusLabel(status: Transaction["status"]) {
  if (status === "COMPLETED") return "Paid";
  if (status === "PENDING") return "Pending";
  return "Failed";
}

function statusBadgeClass(status: Transaction["status"]) {
  if (status === "COMPLETED") return "bg-emerald-100 text-emerald-700";
  if (status === "PENDING")
    return "bg-orange-100 text-[var(--portal-status-transit)]";
  return "bg-red-100 text-red-600";
}

export function PaymentListCard({
  tx,
  onPress,
  className,
}: {
  tx: Transaction;
  onPress?: (trackingNo: string) => void;
  className?: string;
}) {
  const { viewDetailsLabel } = portalConfig.copy;
  const title = paymentTitle(tx);
  const Comp = onPress ? "button" : "div";

  return (
    <Comp
      type={onPress ? "button" : undefined}
      onClick={onPress ? () => onPress(tx.shipmentId) : undefined}
      className={cn(
        "portal-card w-full p-4 text-left active:scale-[0.99] transition-transform",
        className,
      )}
    >
      <div className="flex gap-3">
        <div className="flex h-[80px] w-[80px] shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
          <Receipt size={32} weight="duotone" />
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <p className="truncate text-sm font-normal capitalize text-slate-900">
                {title}
              </p>
              {onPress ? (
                <span className="text-sm font-normal text-primary capitalize">
                  {viewDetailsLabel} &gt;
                </span>
              ) : null}
            </div>
            <div className="shrink-0 text-right">
              <span
                className={cn(
                  "inline-block rounded-full px-2.5 py-0.5 text-xs font-normal uppercase",
                  statusBadgeClass(tx.status),
                )}
              >
                {statusLabel(tx.status)}
              </span>
              <p className="mt-1 text-xs font-normal text-slate-400">
                #{tx.shipmentId}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="relative mt-4 flex items-center px-1">
        <div className="min-w-0 flex-1">
          <p className="text-xs text-slate-400">Date</p>
          <p className="truncate text-sm font-normal text-slate-700">
            {format(new Date(tx.createdAt), "MMM d, yyyy")}
          </p>
        </div>
        <div className="relative mx-3 flex shrink-0 items-center justify-center">
          <div className="absolute inset-x-0 top-1/2 h-px border-t border-dashed border-slate-300" />
          <div className="relative flex h-9 w-9 items-center justify-center rounded-full bg-primary text-white">
            <Money size={16} weight="fill" />
          </div>
        </div>
        <div className="min-w-0 flex-1 text-right">
          <p className="text-xs text-slate-400">Amount</p>
          <p className="truncate text-sm font-normal text-slate-700">
            {formatAmount(tx.amount)}
          </p>
        </div>
      </div>
    </Comp>
  );
}
