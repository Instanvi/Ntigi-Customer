/** Voyage / carrier fields returned on shipment detail APIs. */
export type ShipmentVoyageCarrier = {
  carrierName?: string | null;
  carrierType?: string | null;
  vehiclePlateNo?: string | null;
};

export type ShipmentVoyageLike = {
  arrivalTime?: string | Date | null;
  departureTime?: string | Date | null;
  carrier?: ShipmentVoyageCarrier | null;
} | null;

export type ShipmentCarrierSource = {
  carrier?: string | null;
  courier?: string | null;
  voyage?: ShipmentVoyageLike;
  /** Staff/portal detail APIs attach consolidation and other fields on manifest. */
  manifest?: { voyage?: ShipmentVoyageLike } | Record<string, unknown> | null;
  expectedDeliveryDate?: string | Date | null;
};

function manifestVoyage(
  manifest: ShipmentCarrierSource["manifest"],
): ShipmentVoyageLike | undefined {
  if (!manifest || typeof manifest !== "object") return undefined;
  const voyage = (manifest as { voyage?: ShipmentVoyageLike }).voyage;
  return voyage ?? undefined;
}

export function resolveCarrierName(
  shipment: ShipmentCarrierSource,
): string | null {
  const fromTop = shipment.carrier?.trim();
  if (fromTop) return fromTop;

  const fromVoyage =
    shipment.voyage?.carrier?.carrierName?.trim() ??
    manifestVoyage(shipment.manifest)?.carrier?.carrierName?.trim();
  if (fromVoyage) return fromVoyage;

  const fromCourier = shipment.courier?.trim();
  return fromCourier || null;
}

export function resolveEstimatedArrivalDate(
  shipment: ShipmentCarrierSource,
): string | Date | null | undefined {
  const voyageArrival =
    shipment.voyage?.arrivalTime ?? manifestVoyage(shipment.manifest)?.arrivalTime;
  if (voyageArrival) return voyageArrival;
  return shipment.expectedDeliveryDate ?? null;
}
