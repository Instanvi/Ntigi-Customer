/** Client-side route pricing / corridor form payloads (no backend coupling). */

export interface RouteLegPayload {
  originId: string;
  destinationId: string;
  transportMode:
    | "MARITIME"
    | "AIR"
    | "LAND"
    | "SEA"
    | "BIKE"
    | "MULTIMODAL";
  order: number;
  estDurationMins?: number | null;
}

export interface CreateRouteInput {
  agencyId: string;
  name: string;
  originId?: string;
  destinationId?: string;
  defaultPrice: string;
  isReversible?: boolean;
  transportMode?: string;
  durationMinutes?: number | null;
  originCountry?: string | null;
  originCountryCode?: string | null;
  originCounty?: string | null;
  destinationCountry?: string | null;
  destinationCountryCode?: string | null;
  destinationCounty?: string | null;
  volumetricDivisor?: number | null;
  fuelSurchargeRate?: string | null;
  handlingFeeFlat?: string | null;
  localitySurchargeFlat?: string | null;
  pricingPathGroupId?: string | null;
  isActive?: boolean;
  /** Pricing validity start (ISO date string). */
  validFrom?: string | null;
  /** Pricing validity end / expiry (ISO date string). */
  validUntil?: string | null;
  legs?: RouteLegPayload[];
}
