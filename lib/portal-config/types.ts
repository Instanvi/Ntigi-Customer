/** Icon names map to @phosphor-icons/react exports in `icons.tsx`. */
export type PortalIconName =
  | "House"
  | "MagnifyingGlass"
  | "User"
  | "Package"
  | "MapPin"
  | "Headset"
  | "FileText"
  | "Shield"
  | "Phone"
  | "EnvelopeSimple"
  | "Buildings"
  | "ArrowUpRight"
  | "ArrowDownLeft"
  | "Bell"
  | "List"
  | "CurrencyDollar"
  | "Money"
  | "Question"
  | "Barcode"
  | "ShareNetwork"
  | "CaretLeft"
  | "Airplane";

export type PortalNavTab = {
  id: string;
  href: string;
  label: string;
  icon: PortalIconName;
  matchPaths?: string[];
};

/** Mobile bottom tab bar visual style (`classic` is the default mockup look). */
export type PortalBottomNavVariant =
  | "classic"
  | "floating"
  | "pill"
  | "underline"
  | "solid";

export type PortalDrawerItem = {
  id: string;
  label: string;
  icon: PortalIconName;
  href: string;
  external?: boolean;
};

export type PortalLegalLink = {
  id: string;
  label: string;
  href: string;
};

export type PortalNotice = {
  id: string;
  title?: string;
  body: string;
};

export type PortalQuickAction =
  | {
      id: string;
      label: string;
      description?: string;
      icon: PortalIconName;
      action: { type: "href"; href: string };
    }
  | {
      id: string;
      label: string;
      description?: string;
      icon: PortalIconName;
      action: { type: "scroll"; target: string };
    }
  | {
      id: string;
      label: string;
      description?: string;
      icon: PortalIconName;
      action: { type: "tel" };
    }
  | {
      id: string;
      label: string;
      description?: string;
      icon: PortalIconName;
      action: { type: "external"; url: string };
    };

export type PortalBranchLocation = {
  id: string;
  name: string;
  address: string;
  phone?: string;
  lat: number;
  lng: number;
};

export type PortalCopy = {
  portalSubtitle: string;
  trackHeroTitle: string;
  trackHeroPlaceholder: string;
  trackHeroButton: string;
  trackVerifyTitle: string;
  trackVerifySubtitle: string;
  trackVerifySubmit: string;
  welcomePrefix: string;
  noticeSectionTitle: string;
  shipmentsTitle: string;
  shipmentsSentHint: string;
  shipmentsReceivedHint: string;
  sentTabLabel: string;
  receivedTabLabel: string;
  viewDetailsLabel: string;
  poweredByLabel: string;
  accountVersionLabel: string;
  staffAppLabel: string;
  staffAppDescription: string;
};

export type PortalFeatures = {
  showNotifications: boolean;
  showNotificationBadge: boolean;
  notificationBadgeCount: number;
  showDrawerMenu: boolean;
  showPoweredBy: boolean;
  showHomeQuickActions: boolean;
  showHomeShipmentList: boolean;
};

export type PortalSupport = {
  phone: string | null;
  email: string | null;
  locationsUrl: string | null;
};

export type PortalBrand = {
  primary: string;
  logoUrl: string | null;
};

export type PortalLocale = "en" | "fr" | "zh";

export type PortalConfig = {
  agencySlug: string;
  appName: string;
  /** Default URL locale when none is present (`NEXT_PUBLIC_DEFAULT_LOCALE`). */
  defaultLocale: PortalLocale;
  brand: PortalBrand;
  support: PortalSupport;
  notice: string | null;
  staffAppUrl: string;
  version: string;
  features: PortalFeatures;
  navigation: {
    bottomNavVariant?: PortalBottomNavVariant;
    bottomTabs: PortalNavTab[];
    drawerMenu: PortalDrawerItem[];
    legalLinks: PortalLegalLink[];
  };
  locations: PortalBranchLocation[];
  home: {
    quickActions: PortalQuickAction[];
    notices: PortalNotice[];
    noticeSectionTitle: string;
  };
  copy: PortalCopy;
};

export type PortalConfigOverride = DeepPartial<PortalConfig>;

type DeepPartial<T> = {
  [K in keyof T]?: T[K] extends Array<infer U>
    ? U[]
    : T[K] extends object
      ? DeepPartial<T[K]>
      : T[K];
};
