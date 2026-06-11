import type { Package, ShipmentWithRelations } from "@/types";

/**
 * Package lines do not have their own lifecycle status in NTIGI — always use the
 * parent shipment's status when showing a package in the customer portal.
 */
export function resolvePackageLineStatus(shipment: ShipmentWithRelations): string {
  return shipment.status;
}

export type CustomerPackageListEntry = {
  shipment: ShipmentWithRelations;
  /** `null` when the shipment has no package rows yet (legacy / in-progress). */
  packageLine: Package | null;
};

/** One portal list row per physical package line; status always comes from the shipment. */
export function expandShipmentsToPackageEntries(
  shipments: ShipmentWithRelations[],
): CustomerPackageListEntry[] {
  const entries: CustomerPackageListEntry[] = [];

  for (const shipment of shipments) {
    const lines = shipment.packages ?? [];
    if (lines.length === 0) {
      entries.push({ shipment, packageLine: null });
      continue;
    }
    for (const packageLine of lines) {
      entries.push({ shipment, packageLine });
    }
  }

  return entries.sort((a, b) => {
    const aTime = new Date(
      a.packageLine?.createdAt ?? a.shipment.createdAt,
    ).getTime();
    const bTime = new Date(
      b.packageLine?.createdAt ?? b.shipment.createdAt,
    ).getTime();
    return bTime - aTime;
  });
}

export function resolvePackageLineImage(
  shipment: ShipmentWithRelations,
  packageLine: Package | null,
): string | null {
  if (packageLine) {
    const fromLine = packageLine.imageUrl ?? packageLine.packageImageUrl;
    if (typeof fromLine === "string" && fromLine.trim()) return fromLine;
  }
  for (const pkg of shipment.packages ?? []) {
    const url = pkg.imageUrl ?? pkg.packageImageUrl;
    if (typeof url === "string" && url.trim()) return url;
  }
  return null;
}

export function resolvePackageLineLabel(
  shipment: ShipmentWithRelations,
  packageLine: Package | null,
): string {
  if (packageLine?.description?.trim()) {
    return packageLine.description.trim();
  }
  return (
    shipment.packageType?.label ??
    shipment.packages?.[0]?.description ??
    shipment.category?.replace(/_/g, " ").toLowerCase() ??
    "general goods"
  );
}
