"use client";

import { Button } from "@/components/ui/button";
import { Link } from "@/lib/navigation";
import { AlertCircle as Warning } from "lucide-react";
import { useTranslations } from "next-intl";
import { AuthLanguageToggle } from "@/components/auth/auth-language-toggle";
import { signOut } from "next-auth/react";
import { clearPermissionsStorage } from "@/store/use-permissions-store";
import { useParams } from "next/navigation";

export default function UnauthorizedPage() {
  const t = useTranslations("unauthorized");
  const params = useParams();
  const locale = params.locale as string;

  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen p-8 text-center bg-white">
      <div className="bg-red-50 p-6 rounded-full mb-8 animate-in zoom-in duration-300">
        <Warning size={64} className="text-red-600" />
      </div>
      <h1 className="text-4xl font-bold mb-4 text-[#1E293B]">{t("title")}</h1>
      <p className="text-[#64748B] max-w-lg mb-12 text-lg leading-relaxed">
        {t("description")}
      </p>
      <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md">
        <Button
          asChild
          variant="outline"
          className="flex-1 h-12 border-[#EEEEEE] font-medium"
        >
          <Link href="/">{t("goDashboard")}</Link>
        </Button>
        <Button
          onClick={() => {
            clearPermissionsStorage();
            void signOut({ callbackUrl: `/${locale}/login` });
          }}
          className="flex-1 h-12 bg-[#1a5b03] hover:bg-[#154a02] font-medium text-white shadow-sm transition-all active:scale-95 rounded-none"
        >
          {t("switchAccount")}
        </Button>
      </div>

      <AuthLanguageToggle className="mt-8" />
    </div>
  );
}
