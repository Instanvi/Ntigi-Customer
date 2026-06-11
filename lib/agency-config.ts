/**
 * @deprecated Import from `@/lib/portal-config` instead.
 * Thin re-exports kept for existing imports.
 */
export {
  portalConfig,
  type PortalConfig,
} from "@/lib/portal-config";

import { portalConfig } from "@/lib/portal-config";

export const agencySlug = portalConfig.agencySlug;
export const appName = portalConfig.appName;
export const brandPrimary = portalConfig.brand.primary;
export const brandLogoUrl = portalConfig.brand.logoUrl;
export const portalNotice = portalConfig.notice;
export const supportPhone = portalConfig.support.phone;
export const staffAppUrl = portalConfig.staffAppUrl;

export const CUSTOMER_AGENCY_SLUG_HEADER = "x-customer-agency-slug";

import { resolveApiBaseUrl } from "@/lib/http/resolve-api-base-url";

export const API_BASE_URL = resolveApiBaseUrl();
