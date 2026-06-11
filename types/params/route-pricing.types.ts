/** Shared types for route pricing models API params and responses. */

import type { NetworkActiveConsolidation } from "@/types";

/** A single location endpoint (origin or destination) for route quote search. */
export type LocationFilter = {
  countryCode?: string;
  region?: string;
  city?: string;
  addressLine?: string;
  airportCode?: string;
  seaportLocode?: string;
};

/**
 * Normalise a LocationFilter into flat query-string params.
 * Keys are prefixed with `prefix` (e.g. "origin" → "originCity").
 * Empty values are omitted. Airport/seaport codes are uppercased.
 */
export function buildLocationQueryParams(
  prefix: "origin" | "destination",
  loc: LocationFilter,
): Record<string, string> {
  const p = (key: string) => `${prefix}${key[0]!.toUpperCase()}${key.slice(1)}`;
  const out: Record<string, string> = {};
  const t = (s?: string) => s?.trim() ?? "";

  if (t(loc.countryCode)) out[p("countryCode")] = t(loc.countryCode).toUpperCase().slice(0, 3);
  if (t(loc.region))      out[p("region")]      = t(loc.region);
  if (t(loc.city))        out[p("city")]         = t(loc.city);
  if (t(loc.addressLine)) out[p("address")]      = t(loc.addressLine);
  if (t(loc.airportCode)) out[p("airportCode")]  = t(loc.airportCode).toUpperCase();
  const locode = loc.seaportLocode?.replace(/\s+/g, "").trim() ?? "";
  if (locode) out[p("seaportLocode")] = locode.toUpperCase();

  return out;
}

/** Returns true if at least one location field is non-empty. */
export function hasLocationFields(loc?: LocationFilter): boolean {
  if (!loc) return false;
  return !!(
    loc.countryCode?.trim() ||
    loc.region?.trim() ||
    loc.city?.trim() ||
    loc.addressLine?.trim() ||
    loc.airportCode?.trim() ||
    loc.seaportLocode?.replace(/\s+/g, "").trim()
  );
}

export type RoutePricingType = "standard" | "flat_rate" | "contract";
export type TransportMode = "air" | "ocean" | "truck" | "last_mile";
export type SurchargeType = "percentage" | "flat_rate";
export type ApplyTo = "subtotal" | "waybill" | "shipment" | "declared_value";

export type PricingRow = {
  id: string;
  legId: string;
  pricingType: RoutePricingType;
  volumetricDivisor: number | null;
  minFloorPrice: string | null;
  flatRate: string | null;
  currency: string | null;
  validFrom: string | null;
  validUntil: string | null;
};

export type RatePricingRow = {
  id: string;
  legId: string;
  rateClassId: string | null;
  price: string;
};

export type SurchargeRow = {
  id: string;
  legId: string;
  chargeId?: string | null;
  name: string;
  type: SurchargeType;
  value: string;
  applyTo: ApplyTo;
  isSelected: boolean | null;
};

export type RouteLegGraph = {
  id: string;
  routeId: string | null;
  originId: string | null;
  destinationId: string | null;
  sequence: number;
  mode: TransportMode;
  terms: string | null;
  estDurationValue: number | null;
  estDurationUnit: string | null;
  pricing: PricingRow[];
  ratePricing: RatePricingRow[];
  surcharges: SurchargeRow[];
};

export type RoutePricingGraph = {
  id: string;
  name: string;
  status: string | null;
  createdAt: string | null;
  legs: RouteLegGraph[];
};

export type PathQuoteSurchargeLine = {
  name: string;
  type: string;
  value: string;
  amount: number;
};

export type PathQuoteRatePricing = {
  rateClassId: string | null;
  price: string;
};

export type PathQuoteLegRow = {
  legId: string;
  sequence: number;
  originName: string | null;
  destinationName: string | null;
  mode: string | null;
  base: number;
  fees: number;
  subtotal: number;
  surchargeLines?: PathQuoteSurchargeLine[];
  ratePricing?: PathQuoteRatePricing | null;
  estDurationValue?: number | null;
  estDurationUnit?: string | null;
};

export type PathQuoteRoute = {
  routeId: string;
  routeName: string;
  currency: string;
  startSeq: number;
  endSeq: number;
  quotedWeightKg: number;
  grandTotal: number;
  legBreakdown: Array<{
    leg: string;
    base: number;
    fees: number;
    subtotal: number;
  }>;
  pathLegs: PathQuoteLegRow[];
  activeVoyages?: NetworkActiveConsolidation[];
  activeConsolidations?: NetworkActiveConsolidation[];
  trackingVerification?: "verified" | "unverified" | "none";
  validUntil?: string | null;
};

export type PathQuoteResult = {
  agencyId: string;
  agencyName: string;
  routes: PathQuoteRoute[];
};

export type CreateRouteGraphInput = {
  name: string;
  status?: string;
  isPartnerRoute?: boolean;
  partnerAgencyId?: string | null;
  legs: Array<{
    originId: string;
    destinationId: string;
    sequence: number;
    mode: TransportMode;
    terms?: string;
    estDurationValue?: number;
    estDurationUnit?: string;
    pricing?: {
      pricingType?: RoutePricingType;
      volumetricDivisor?: number;
      minFloorPrice?: string;
      flatRate?: string;
      currency?: string;
      validFrom?: string;
      validUntil?: string;
    };
    ratePricing?: Array<{
      rateClassId?: string | null;
      minWeight?: number | string | null;
      maxWeight?: number | string | null;
      price: string;
    }>;
    surcharges?: Array<{
      name: string;
      type: SurchargeType;
      value: string;
      applyTo: ApplyTo;
      isSelected?: boolean;
      chargeId?: string | null;
    }>;
  }>;
};
