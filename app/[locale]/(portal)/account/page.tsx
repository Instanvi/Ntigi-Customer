"use client";

import * as React from "react";
import Image from "next/image";
import { signOut } from "next-auth/react";
import { useLocale } from "next-intl";
import { useSession } from "@/hooks/use-session";
import { useAgencyBrand } from "@/components/providers/agency-brand-provider";
import { useClientAppProfile } from "@/hooks/api/use-client-app-profile";
import { clearPermissionsStorage } from "@/store/use-permissions-store";
import {
  SignOut,
  User,
  Phone,
  EnvelopeSimple,
  Headset,
  Buildings,
  CaretRight,
} from "@phosphor-icons/react";
import { portalConfig } from "@/lib/portal-config";
import { PortalPage } from "@/components/portal/shell/portal-page";
import { PortalChromeHeader } from "@/components/portal/shell/portal-chrome-header";

function SettingsRow({
  icon: Icon,
  label,
  value,
  onClick,
}: {
  icon: React.ElementType;
  label: string;
  value?: string;
  onClick?: () => void;
}) {
  const Comp = onClick ? "button" : "div";
  return (
    <Comp
      type={onClick ? "button" : undefined}
      onClick={onClick}
      className="flex w-full items-center gap-3 px-4 py-4 text-left hover:bg-slate-50"
    >
      <div className="flex h-10 w-10 shrink-0 items-center justify-center bg-primary/10 text-primary">
        <Icon size={22} weight="duotone" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-normal text-slate-900">{label}</p>
        {value ? (
          <p className="truncate text-sm text-slate-500">{value}</p>
        ) : null}
      </div>
      {onClick ? <CaretRight size={16} className="text-slate-300" /> : null}
    </Comp>
  );
}

export default function AccountPage() {
  const locale = useLocale();
  const { user } = useSession();
  const { displayName, logoUrl } = useAgencyBrand();
  const { data: client } = useClientAppProfile({ enabled: !!user?.id });
  const { copy, support, staffAppUrl, version } = portalConfig;

  const handleLogout = async () => {
    clearPermissionsStorage();
    await signOut({ callbackUrl: `/${locale}/login` });
  };

  return (
    <PortalPage>
      <div className="bg-primary pb-6">
        <PortalChromeHeader showNotifications={false} />
        <div className="px-6 pt-2 text-center text-white">
          <div className="mx-auto mb-3 flex h-20 w-20 items-center justify-center overflow-hidden bg-white/15">
            {logoUrl ? (
              <Image
                src={logoUrl}
                alt={displayName}
                width={64}
                height={64}
                className="h-14 w-14 object-contain"
                unoptimized
              />
            ) : (
              <User size={36} weight="duotone" />
            )}
          </div>
          <h1 className="text-base font-normal">
            {client?.fullName ?? user?.fullName ?? "Account"}
          </h1>
          <p className="mt-1 text-sm font-normal text-white/75">{displayName}</p>
        </div>
      </div>

      <div className="space-y-4 px-[var(--portal-header-pad)] py-4 pb-6">
        <div className="portal-card overflow-hidden">
          <div className="divide-y divide-slate-100">
            {user?.phoneNumber ? (
              <SettingsRow icon={Phone} label="Phone" value={user.phoneNumber} />
            ) : null}
            {user?.email ? (
              <SettingsRow
                icon={EnvelopeSimple}
                label="Email"
                value={user.email}
              />
            ) : null}
            <SettingsRow
              icon={Buildings}
              label="Agency"
              value={`Customer of ${displayName}`}
            />
            {support.phone ? (
              <SettingsRow
                icon={Headset}
                label="Support"
                value={support.phone}
                onClick={() => {
                  window.location.href = `tel:${support.phone!.replace(/\s/g, "")}`;
                }}
              />
            ) : null}
          </div>
        </div>

        <div className="portal-card overflow-hidden">
          <SettingsRow
            icon={Buildings}
            label={copy.staffAppLabel}
            value={copy.staffAppDescription}
            onClick={() => window.open(staffAppUrl, "_blank")}
          />
        </div>

        <button
          type="button"
          onClick={handleLogout}
          className="portal-btn flex h-9 w-full items-center justify-center gap-2 bg-primary text-sm font-normal text-white shadow-sm"
        >
          <SignOut size={18} weight="bold" />
          Sign out
        </button>

        <p className="text-center text-[11px] text-slate-400">
          {copy.accountVersionLabel} v{version}
        </p>
      </div>
    </PortalPage>
  );
}
