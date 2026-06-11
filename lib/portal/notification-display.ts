import type { Icon } from "@phosphor-icons/react";
import { Bell, MapPin, Money, Package } from "@phosphor-icons/react";
import { formatDistanceToNow } from "date-fns";
import type { ClientNotificationCategory } from "@/hooks/api/use-client-notifications";

export function notificationCategoryIcon(
  category: ClientNotificationCategory,
): Icon {
  switch (category) {
    case "SHIPMENT":
      return Package;
    case "PAYMENT":
      return Money;
    case "BRANCH":
      return MapPin;
    default:
      return Bell;
  }
}

export function formatNotificationTime(createdAt: string): string {
  try {
    return formatDistanceToNow(new Date(createdAt), { addSuffix: true });
  } catch {
    return "";
  }
}

export function notificationHref(
  metadata: Record<string, unknown> | null,
): string | null {
  const kind = metadata?.redirectKind;
  const trackingNo =
    typeof metadata?.trackingNo === "string"
      ? metadata.trackingNo
      : null;

  if (kind === "shipment" && trackingNo) {
    return `/shipments/${encodeURIComponent(trackingNo)}`;
  }
  if (kind === "payments") return "/payments";
  if (kind === "shipments") return "/shipments";
  return null;
}
