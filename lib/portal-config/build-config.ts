import { parseBottomNavVariant } from "./bottom-nav-variant";
import { DEFAULT_PORTAL_CONFIG } from "./defaults";
import type { PortalConfig, PortalConfigOverride, PortalLocale } from "./types";

const ROUTING_LOCALES = ["en", "fr", "zh"] as const;

function parseDefaultLocale(raw: string | undefined): PortalLocale {
  const v = raw?.trim().toLowerCase();
  if (v && ROUTING_LOCALES.includes(v as PortalLocale)) {
    return v as PortalLocale;
  }
  return DEFAULT_PORTAL_CONFIG.defaultLocale;
}

function envOrUndefined(value: string | undefined): string | undefined {
  const v = value?.trim();
  return v || undefined;
}

function envOrNull(value: string | undefined): string | null | undefined {
  if (value === undefined) return undefined;
  const v = value.trim();
  return v ? v : null;
}

function parseBool(value: string | undefined, fallback: boolean): boolean {
  if (value === undefined || value === "") return fallback;
  return value === "true" || value === "1";
}

function parseJsonOverride(raw: string | undefined): PortalConfigOverride | null {
  if (!raw?.trim()) return null;
  try {
    return JSON.parse(raw) as PortalConfigOverride;
  } catch {
    console.warn(
      "[portal-config] Invalid NEXT_PUBLIC_PORTAL_CONFIG_JSON — using defaults.",
    );
    return null;
  }
}

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function deepMerge<T extends Record<string, unknown>>(
  base: T,
  patch: Record<string, unknown>,
): T {
  const out = { ...base } as T;
  for (const key of Object.keys(patch)) {
    const patchVal = patch[key];
    const baseVal = base[key];
    if (isPlainObject(baseVal) && isPlainObject(patchVal)) {
      (out as Record<string, unknown>)[key] = deepMerge(
        baseVal as Record<string, unknown>,
        patchVal,
      );
    } else if (patchVal !== undefined) {
      (out as Record<string, unknown>)[key] = patchVal;
    }
  }
  return out;
}

function buildFeaturesFromEnv(): PortalConfigOverride["features"] {
  const hasFeatureEnv =
    process.env.NEXT_PUBLIC_PORTAL_SHOW_NOTIFICATIONS !== undefined ||
    process.env.NEXT_PUBLIC_PORTAL_SHOW_NOTIFICATION_BADGE !== undefined ||
    process.env.NEXT_PUBLIC_PORTAL_SHOW_DRAWER !== undefined ||
    process.env.NEXT_PUBLIC_PORTAL_SHOW_POWERED_BY !== undefined ||
    process.env.NEXT_PUBLIC_PORTAL_SHOW_QUICK_ACTIONS !== undefined ||
    process.env.NEXT_PUBLIC_PORTAL_SHOW_SHIPMENT_LIST !== undefined;

  if (!hasFeatureEnv) return undefined;

  const badgeCountRaw = process.env.NEXT_PUBLIC_PORTAL_NOTIFICATION_COUNT;
  const notificationBadgeCount =
    badgeCountRaw !== undefined && badgeCountRaw !== ""
      ? Number.parseInt(badgeCountRaw, 10)
      : DEFAULT_PORTAL_CONFIG.features.notificationBadgeCount;

  return {
    showNotifications: parseBool(
      process.env.NEXT_PUBLIC_PORTAL_SHOW_NOTIFICATIONS,
      DEFAULT_PORTAL_CONFIG.features.showNotifications,
    ),
    showNotificationBadge: parseBool(
      process.env.NEXT_PUBLIC_PORTAL_SHOW_NOTIFICATION_BADGE,
      DEFAULT_PORTAL_CONFIG.features.showNotificationBadge,
    ),
    notificationBadgeCount: Number.isFinite(notificationBadgeCount)
      ? notificationBadgeCount
      : 0,
    showDrawerMenu: parseBool(
      process.env.NEXT_PUBLIC_PORTAL_SHOW_DRAWER,
      DEFAULT_PORTAL_CONFIG.features.showDrawerMenu,
    ),
    showPoweredBy: parseBool(
      process.env.NEXT_PUBLIC_PORTAL_SHOW_POWERED_BY,
      DEFAULT_PORTAL_CONFIG.features.showPoweredBy,
    ),
    showHomeQuickActions: parseBool(
      process.env.NEXT_PUBLIC_PORTAL_SHOW_QUICK_ACTIONS,
      DEFAULT_PORTAL_CONFIG.features.showHomeQuickActions,
    ),
    showHomeShipmentList: parseBool(
      process.env.NEXT_PUBLIC_PORTAL_SHOW_SHIPMENT_LIST,
      DEFAULT_PORTAL_CONFIG.features.showHomeShipmentList,
    ),
  };
}

function parseNoticesJson(raw: string | undefined) {
  if (!raw?.trim()) return undefined;
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : undefined;
  } catch {
    return undefined;
  }
}

/**
 * Build-time white-label config: defaults → env vars → JSON override.
 * Set once per deployment (Docker / Vercel / `.env.local`).
 */
export function buildPortalConfig(): PortalConfig {
  const jsonOverride = parseJsonOverride(
    process.env.NEXT_PUBLIC_PORTAL_CONFIG_JSON,
  );

  const brandPrimary = envOrUndefined(process.env.NEXT_PUBLIC_BRAND_PRIMARY);
  const brandLogo = envOrNull(process.env.NEXT_PUBLIC_BRAND_LOGO_URL);
  const supportPhone = envOrNull(process.env.NEXT_PUBLIC_SUPPORT_PHONE);
  const supportEmail = envOrNull(process.env.NEXT_PUBLIC_SUPPORT_EMAIL);
  const locationsUrl = envOrNull(process.env.NEXT_PUBLIC_LOCATIONS_URL);
  const notice = envOrNull(process.env.NEXT_PUBLIC_PORTAL_NOTICE);

  const bottomNavVariantRaw = envOrUndefined(
    process.env.NEXT_PUBLIC_PORTAL_BOTTOM_NAV_VARIANT,
  );

  const fromEnv: PortalConfigOverride = {
    agencySlug: envOrUndefined(process.env.NEXT_PUBLIC_AGENCY_SLUG),
    appName: envOrUndefined(process.env.NEXT_PUBLIC_APP_NAME),
    defaultLocale: parseDefaultLocale(process.env.NEXT_PUBLIC_DEFAULT_LOCALE),
    navigation: bottomNavVariantRaw
      ? { bottomNavVariant: parseBottomNavVariant(bottomNavVariantRaw) }
      : undefined,
    brand:
      brandPrimary || brandLogo !== undefined
        ? {
            ...(brandPrimary ? { primary: brandPrimary } : {}),
            ...(brandLogo !== undefined ? { logoUrl: brandLogo } : {}),
          }
        : undefined,
    support:
      supportPhone !== undefined ||
      supportEmail !== undefined ||
      locationsUrl !== undefined
        ? {
            ...(supportPhone !== undefined ? { phone: supportPhone } : {}),
            ...(supportEmail !== undefined ? { email: supportEmail } : {}),
            ...(locationsUrl !== undefined
              ? { locationsUrl: locationsUrl }
              : {}),
          }
        : undefined,
    notice: notice !== undefined ? notice : undefined,
    staffAppUrl: envOrUndefined(process.env.NEXT_PUBLIC_STAFF_APP_URL),
    version: envOrUndefined(process.env.NEXT_PUBLIC_PORTAL_VERSION),
    features: buildFeaturesFromEnv(),
  };

  let config = deepMerge(
    DEFAULT_PORTAL_CONFIG as unknown as Record<string, unknown>,
    fromEnv as unknown as Record<string, unknown>,
  ) as PortalConfig;

  if (jsonOverride) {
    config = deepMerge(
      config as unknown as Record<string, unknown>,
      jsonOverride as unknown as Record<string, unknown>,
    ) as PortalConfig;
  }

  if (config.support.phone) {
    config = {
      ...config,
      home: {
        ...config.home,
        quickActions: config.home.quickActions.map((action) =>
          action.id === "support" && action.action.type === "tel"
            ? {
                ...action,
                description: config.support.phone ?? action.description,
              }
            : action,
        ),
      },
    };
  }

  const noticesFromEnv = parseNoticesJson(
    process.env.NEXT_PUBLIC_PORTAL_NOTICES_JSON,
  );
  if (noticesFromEnv?.length) {
    config = {
      ...config,
      home: { ...config.home, notices: noticesFromEnv },
    };
  } else if (config.notice && config.home.notices.length === 0) {
    config = {
      ...config,
      home: {
        ...config.home,
        notices: [{ id: "default", body: config.notice }],
      },
    };
  }

  if (!config.navigation.bottomNavVariant) {
    config = {
      ...config,
      navigation: {
        ...config.navigation,
        bottomNavVariant: "classic",
      },
    };
  }

  return config;
}
