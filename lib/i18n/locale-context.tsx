"use client";

import { useLocale as useNextIntlLocale } from "next-intl";
import { routing, usePathname, useRouter } from "@/lib/navigation";
import { useCallback } from "react";

export type AppLocale = (typeof routing.locales)[number];

export function useLocale() {
  const locale = useNextIntlLocale();
  const router = useRouter();
  const pathname = usePathname();

  const setLocale = useCallback(
    (newLocale: AppLocale) => {
      // Standard next-intl cookie for persistence in case of middleware detection
      document.cookie = `ntigi_locale=${newLocale}; path=/; max-age=31536000; SameSite=Lax`;
      const qs =
        typeof window !== "undefined" ? window.location.search : "";
      const href = qs ? `${pathname}${qs}` : pathname;
      router.replace(href, { locale: newLocale });
    },
    [pathname, router],
  );

  return {
    locale,
    setLocale,
  };
}
