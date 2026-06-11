"use client";

import * as React from "react";
import { useLocale as useNextIntlLocale } from "next-intl";
import { routing, usePathname, useRouter } from "@/lib/navigation";
import { cn } from "@/lib/utils";

type AppLocale = (typeof routing.locales)[number];

const LABELS: Record<AppLocale, string> = {
  en: "English",
  fr: "Français",
  zh: "中文",
};

export function AuthLanguageToggle({ className }: { className?: string }) {
  const locale = useNextIntlLocale() as AppLocale;
  const router = useRouter();
  const pathname = usePathname();

  const switchTo = React.useCallback(
    (next: AppLocale) => {
      if (next === locale) return;
      document.cookie = `ntigi_locale=${next}; path=/; max-age=31536000; SameSite=Lax`;
      const qs =
        typeof window !== "undefined" ? window.location.search : "";
      const href = qs ? `${pathname}${qs}` : pathname;
      router.replace(href, { locale: next });
    },
    [locale, pathname, router],
  );

  return (
    <p
      className={cn(
        "text-center text-[12px] text-black/50",
        className,
      )}
      role="group"
      aria-label="Language"
    >
      {routing.locales.map((loc, index) => {
        const active = locale === loc;
        return (
          <React.Fragment key={loc}>
            {index > 0 && <span className="mx-1.5 text-black/25">·</span>}
            <button
              type="button"
              onClick={() => switchTo(loc)}
              className={cn(
                "font-medium transition-colors",
                active
                  ? "text-primary underline underline-offset-2"
                  : "text-black/50 hover:text-black/80",
              )}
              aria-current={active ? "true" : undefined}
            >
              {LABELS[loc]}
            </button>
          </React.Fragment>
        );
      })}
    </p>
  );
}
