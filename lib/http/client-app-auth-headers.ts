import {
  agencySlug,
  CUSTOMER_AGENCY_SLUG_HEADER,
} from "@/lib/agency-config";

export const AGENCY_SLUG_CONFIG_ERROR =
  "NEXT_PUBLIC_AGENCY_SLUG is not configured for this customer portal.";

export function requireAgencySlug(): string {
  const slug = agencySlug?.trim();
  if (!slug) {
    throw new Error(AGENCY_SLUG_CONFIG_ERROR);
  }
  return slug;
}

export function clientAppAuthHeaders(): Record<string, string> {
  return {
    [CUSTOMER_AGENCY_SLUG_HEADER]: requireAgencySlug(),
  };
}
