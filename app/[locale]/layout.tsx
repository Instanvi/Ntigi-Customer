import { Inter, Noto_Sans_SC } from "next/font/google";
import { Providers } from "../providers";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import { DocumentLang } from "./document-lang";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
  preload: true,
  adjustFontFallback: true,
});

const notoSansSc = Noto_Sans_SC({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
  adjustFontFallback: true,
  variable: "--font-noto-sc",
});

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!routing.locales.includes(locale as (typeof routing.locales)[number])) {
    notFound();
  }

  const messages = await getMessages();

  return (
    <div
      className={`min-h-dvh bg-background ${locale === "zh" ? notoSansSc.className : inter.className}`}
    >
      <NextIntlClientProvider messages={messages} locale={locale}>
        <DocumentLang />
        <Providers>{children}</Providers>
      </NextIntlClientProvider>
    </div>
  );
}
