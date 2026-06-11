"use client";

import * as React from "react";
import {
  Headset,
  Phone,
  EnvelopeSimple,
  MapPin,
  Clock,
  ArrowSquareOut,
} from "@phosphor-icons/react";
import { useRouter } from "@/lib/navigation";
import { PortalPage } from "@/components/portal/shell/portal-page";
import { PortalSubHeader } from "@/components/portal/shell/portal-sub-header";
import { portalConfig } from "@/lib/portal-config";

function SupportRow({
  icon: Icon,
  label,
  value,
  onClick,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
  onClick?: () => void;
}) {
  const Comp = onClick ? "button" : "div";
  return (
    <Comp
      type={onClick ? "button" : undefined}
      onClick={onClick}
      className="flex w-full items-center gap-3 border-b border-slate-100 px-4 py-4 text-left last:border-b-0 hover:bg-slate-50"
    >
      <div className="flex h-11 w-11 shrink-0 items-center justify-center bg-primary/10 text-primary">
        <Icon size={22} weight="duotone" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-normal text-slate-900">{label}</p>
        <p className="text-sm text-slate-500">{value}</p>
      </div>
      {onClick ? (
        <ArrowSquareOut size={18} className="shrink-0 text-slate-300" weight="bold" />
      ) : null}
    </Comp>
  );
}

export default function SupportPage() {
  const router = useRouter();
  const { support } = portalConfig;

  return (
    <PortalPage>
      <PortalSubHeader title="Customer Support" />

      <div className="space-y-4 px-[var(--portal-header-pad)] py-4 pb-6">
        <div className="portal-card overflow-hidden">
          {support.phone ? (
            <SupportRow
              icon={Phone}
              label="Call support"
              value={support.phone}
              onClick={() => {
                window.location.href = `tel:${support.phone!.replace(/\s/g, "")}`;
              }}
            />
          ) : null}
          {support.email ? (
            <SupportRow
              icon={EnvelopeSimple}
              label="Email us"
              value={support.email}
              onClick={() => {
                window.location.href = `mailto:${support.email}`;
              }}
            />
          ) : null}
          <SupportRow
            icon={MapPin}
            label="Our locations"
            value="Find a branch on the map"
            onClick={() => router.push("/locations")}
          />
          <SupportRow
            icon={Clock}
            label="Office hours"
            value="Monday–Saturday 8:00 AM – 6:00 PM"
          />
        </div>

        <div className="portal-card p-4">
          <div className="mb-3 flex items-center gap-2">
            <Headset size={22} className="text-primary" weight="duotone" />
            <h2 className="text-sm font-normal text-slate-900">How can we help?</h2>
          </div>
          <p className="text-sm leading-relaxed text-slate-600">
            For tracking issues, payments, or pickup questions, contact our support
            team or visit your nearest branch. Have your tracking number ready.
          </p>
        </div>
      </div>
    </PortalPage>
  );
}
