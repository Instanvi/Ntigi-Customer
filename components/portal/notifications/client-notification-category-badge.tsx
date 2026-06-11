"use client";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { ClientNotificationCategory } from "@/hooks/api/use-client-notifications";

const CATEGORY_LABEL: Record<ClientNotificationCategory, string> = {
  SHIPMENT: "Shipment",
  PAYMENT: "Payment",
  BRANCH: "Branch",
  SYSTEM: "Notice",
};

const CATEGORY_CLASS: Record<ClientNotificationCategory, string> = {
  SHIPMENT: "bg-blue-50 text-blue-700 border-blue-200",
  PAYMENT: "bg-emerald-50 text-emerald-700 border-emerald-200",
  BRANCH: "bg-amber-50 text-amber-800 border-amber-200",
  SYSTEM: "bg-primary/10 text-primary border-primary/20",
};

export function ClientNotificationCategoryBadge({
  category,
  className,
}: {
  category: ClientNotificationCategory;
  className?: string;
}) {
  return (
    <Badge
      variant="outline"
      className={cn(
        "rounded-sm text-[10px] font-normal border",
        CATEGORY_CLASS[category],
        className,
      )}
    >
      {CATEGORY_LABEL[category]}
    </Badge>
  );
}
