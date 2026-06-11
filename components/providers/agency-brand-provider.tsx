"use client";

import * as React from "react";
import {
  agencySlug,
  appName,
  brandLogoUrl,
  brandPrimary,
} from "@/lib/agency-config";
import { portalConfig } from "@/lib/portal-config";
import { usePublicAgency, type PublicAgency } from "@/hooks/api/use-public-agency";

type AgencyBrandContextValue = {
  slug: string;
  appName: string;
  agency: PublicAgency | null;
  isLoading: boolean;
  displayName: string;
  logoUrl: string | null;
  primaryColor: string;
};

const AgencyBrandContext = React.createContext<AgencyBrandContextValue | null>(
  null,
);

function applyBrandCss(primary: string) {
  if (typeof document === "undefined") return;
  const root = document.documentElement;
  root.style.setProperty("--primary", primary);
  root.style.setProperty("--theme-color", primary);
  root.style.setProperty("--sidebar-primary", primary);
}

export function AgencyBrandProvider({ children }: { children: React.ReactNode }) {
  const { data: agency, isLoading } = usePublicAgency();
  const primaryColor = brandPrimary;
  const displayName = agency?.name ?? appName ?? portalConfig.appName;
  const logoUrl =
    agency?.logoUrl ?? brandLogoUrl ?? portalConfig.brand.logoUrl ?? null;

  React.useEffect(() => {
    applyBrandCss(primaryColor);
  }, [primaryColor]);

  React.useEffect(() => {
    if (typeof document !== "undefined" && displayName) {
      document.title = displayName;
    }
  }, [displayName]);

  const value = React.useMemo(
    () => ({
      slug: agencySlug,
      appName,
      agency: agency ?? null,
      isLoading,
      displayName,
      logoUrl,
      primaryColor,
    }),
    [agency, isLoading, displayName, logoUrl, primaryColor],
  );

  return (
    <AgencyBrandContext.Provider value={value}>
      {children}
    </AgencyBrandContext.Provider>
  );
}

export function useAgencyBrand() {
  const ctx = React.useContext(AgencyBrandContext);
  if (!ctx) {
    throw new Error("useAgencyBrand must be used within AgencyBrandProvider");
  }
  return ctx;
}
