"use client";

import * as React from "react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import type { ShipmentPaymentSummary } from "@/types";
import { useClientCollectPayment } from "@/hooks/api/use-client-collect-payment";

type Method = "MOBILE_MONEY" | "BANK_TRANSFER";

function formatMoney(amount: string, currency = "XAF") {
  const n = Number.parseFloat(amount);
  if (!Number.isFinite(n)) return `${amount} ${currency}`;
  return `${n.toLocaleString(undefined, { maximumFractionDigits: 0 })} ${currency}`;
}

export function ShipmentInvoicePaySheet({
  open,
  onOpenChange,
  trackingNo,
  summary,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  trackingNo: string;
  summary: ShipmentPaymentSummary;
}) {
  const openInvoice = summary.invoices.find(
    (i) =>
      Number.parseFloat(i.outstandingAmount) > 0 &&
      ["APPROVED", "PENDING_APPROVAL", "ISSUED"].includes(i.status),
  );

  const [method, setMethod] = React.useState<Method>("MOBILE_MONEY");
  const [provider, setProvider] = React.useState<"MTN" | "ORANGE" | "">("");
  const [phone, setPhone] = React.useState("");
  const [reference, setReference] = React.useState("");
  const [amount, setAmount] = React.useState(
    openInvoice?.outstandingAmount ?? summary.balanceOutstanding,
  );

  const collectM = useClientCollectPayment();

  React.useEffect(() => {
    if (openInvoice) {
      setAmount(openInvoice.outstandingAmount);
    }
  }, [openInvoice?.id, openInvoice?.outstandingAmount]);

  if (!openInvoice) return null;

  const outstanding = Number.parseFloat(openInvoice.outstandingAmount);
  const payValue = Number.parseFloat(amount);
  const canPay =
    Number.isFinite(payValue) && payValue > 0 && payValue <= outstanding + 0.01;

  const submit = async () => {
    if (!canPay) return;
    if (method === "MOBILE_MONEY") {
      if (!provider || !phone.trim()) {
        toast.error("Select provider and enter your phone number");
        return;
      }
    }
    if (method === "BANK_TRANSFER" && !reference.trim()) {
      toast.error("Enter your bank transfer reference");
      return;
    }

    try {
      await collectM.mutateAsync({
        shipmentId: trackingNo,
        journalBatchId: openInvoice.id,
        method,
        amount: payValue.toFixed(2),
        provider:
          method === "MOBILE_MONEY" && provider ? provider : undefined,
        paymentPhone: method === "MOBILE_MONEY" ? phone.trim() : undefined,
        memo:
          method === "BANK_TRANSFER"
            ? `Ref: ${reference.trim()}`
            : undefined,
      });
      toast.success("Payment recorded — you can collect your parcel");
      onOpenChange(false);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Payment failed",
      );
    }
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="rounded-t-2xl px-4 pb-8 pt-2">
        <SheetHeader className="text-left">
          <SheetTitle>Pay shipment invoice</SheetTitle>
        </SheetHeader>
        <p className="mt-1 text-sm text-slate-500">
          Pay your freight invoice for {trackingNo} before pickup.
        </p>

        <div className="mt-4 rounded-[var(--portal-radius-card)] border border-slate-100 bg-white p-4">
          <p className="text-xs text-slate-500">Invoice</p>
          <p className="font-semibold text-slate-900">{openInvoice.invoiceNo}</p>
          <p className="mt-2 text-xs text-slate-500">Balance due</p>
          <p className="text-xl font-bold text-[var(--portal-primary,#263070)]">
            {formatMoney(openInvoice.outstandingAmount)}
          </p>
        </div>

        <div className="mt-4 space-y-2">
          <Label htmlFor="client-pay-amount">Amount</Label>
          <Input
            id="client-pay-amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            inputMode="decimal"
          />
        </div>

        <div className="mt-4 grid grid-cols-2 gap-2">
          {(
            [
              { value: "MOBILE_MONEY", label: "Mobile money" },
              { value: "BANK_TRANSFER", label: "Bank transfer" },
            ] as const
          ).map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => setMethod(opt.value)}
              className={cn(
                "h-11 rounded-[var(--portal-radius-card)] border text-xs font-medium",
                method === opt.value
                  ? "border-[var(--portal-primary,#263070)] bg-slate-50 text-[var(--portal-primary,#263070)]"
                  : "border-slate-200 bg-white",
              )}
            >
              {opt.label}
            </button>
          ))}
        </div>

        {method === "MOBILE_MONEY" ? (
          <div className="mt-4 space-y-3">
            <div className="grid grid-cols-2 gap-2">
              {(["MTN", "ORANGE"] as const).map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setProvider(p)}
                  className={cn(
                    "h-10 rounded-[var(--portal-radius-card)] border text-xs font-medium",
                    provider === p
                      ? "border-[var(--portal-primary,#263070)] bg-slate-50"
                      : "border-slate-200",
                  )}
                >
                  {p}
                </button>
              ))}
            </div>
            <Input
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Mobile money number"
            />
          </div>
        ) : (
          <div className="mt-4">
            <Input
              value={reference}
              onChange={(e) => setReference(e.target.value)}
              placeholder="Transfer reference"
            />
          </div>
        )}

        <Button
          type="button"
          className="portal-btn mt-6 h-11 w-full"
          disabled={!canPay || collectM.isPending}
          onClick={() => void submit()}
        >
          {collectM.isPending ? "Processing…" : "Pay now"}
        </Button>
      </SheetContent>
    </Sheet>
  );
}
