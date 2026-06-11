import type { Icon } from "@phosphor-icons/react";
import { Airplane, Boat, Truck } from "@phosphor-icons/react";

export type PortalTransitMode = "AIR" | "SEA" | "LAND";

/** Normalize API mode / route mode to a corridor icon bucket. */
export function normalizeTransitMode(mode?: string | null): PortalTransitMode {
  const value = (mode ?? "LAND").toUpperCase();
  if (value === "SEA" || value === "MARITIME") return "SEA";
  if (value === "AIR") return "AIR";
  if (value === "LAND" || value === "ROAD" || value === "BIKE") return "LAND";
  if (value === "MULTIMODAL") return "LAND";
  return "LAND";
}

export function getTransitModeIcon(mode?: string | null): Icon {
  const normalized = normalizeTransitMode(mode);
  if (normalized === "SEA") return Boat;
  if (normalized === "AIR") return Airplane;
  return Truck;
}

/** Prefer shipment.mode (route transport mode from booking). */
export function resolveShipmentTransitMode(shipment: {
  mode?: string | null;
  carrierType?: string | null;
}): PortalTransitMode {
  if (shipment.mode) return normalizeTransitMode(shipment.mode);
  if (shipment.carrierType) return normalizeTransitMode(shipment.carrierType);
  return "LAND";
}
