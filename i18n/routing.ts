import { defineRouting } from "next-intl/routing";
import { portalConfig } from "@/lib/portal-config";

export const routing = defineRouting({
  locales: ["en", "fr", "zh"],
  defaultLocale: portalConfig.defaultLocale,
  localePrefix: "always", // / → /{defaultLocale} redirect handled by middleware
});
