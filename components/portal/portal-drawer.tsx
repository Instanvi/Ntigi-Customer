"use client";

import Image from "next/image";
import { Link } from "@/lib/navigation";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useAgencyBrand } from "@/components/providers/agency-brand-provider";
import { CaretRight, MapPin, X } from "@phosphor-icons/react";
import {
  portalConfig,
  resolvePortalIcon,
} from "@/lib/portal-config";

export function PortalDrawer({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const { displayName, logoUrl } = useAgencyBrand();
  const { navigation, copy, features } = portalConfig;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="left"
        showCloseButton={false}
        className="w-[min(100vw-3rem,320px)] border-r border-slate-100 p-0"
      >
        <SheetHeader className="relative border-b border-slate-100 bg-primary px-5 py-6 text-left text-white">
          <button
            type="button"
            aria-label="Close menu"
            onClick={() => onOpenChange(false)}
            className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-lg hover:bg-white/10"
          >
            <X size={20} weight="bold" />
          </button>
          <div className="flex items-center gap-3 pr-10">
            {logoUrl ? (
              <Image
                src={logoUrl}
                alt={displayName}
                width={40}
                height={40}
                className="h-10 w-10 rounded-lg bg-white/10 object-contain p-1"
                unoptimized
              />
            ) : (
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/15 text-sm font-normal">
                {displayName.charAt(0)}
              </div>
            )}
            <div className="min-w-0">
              <SheetTitle className="truncate text-sm font-normal text-white">
                {displayName}
              </SheetTitle>
              <p className="text-xs text-white/70">{copy.portalSubtitle}</p>
            </div>
          </div>
        </SheetHeader>

        <nav className="flex flex-col py-2">
          {navigation.drawerMenu.map((item) => {
            const Icon = resolvePortalIcon(item.icon);
            const className =
              "flex items-center gap-3 px-5 py-3.5 text-sm font-normal text-slate-700 hover:bg-slate-50";

            if (item.external) {
              return (
                <a
                  key={item.id}
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={className}
                >
                  <Icon size={20} className="shrink-0 text-primary" />
                  <span className="flex-1">{item.label}</span>
                  <CaretRight size={16} className="text-slate-300" />
                </a>
              );
            }

            return (
              <Link
                key={item.id}
                href={item.href}
                onClick={() => onOpenChange(false)}
                className={className}
              >
                <Icon size={20} className="shrink-0 text-primary" />
                <span className="flex-1">{item.label}</span>
                <CaretRight size={16} className="text-slate-300" />
              </Link>
            );
          })}
        </nav>

        <div className="mt-auto border-t border-slate-100 py-2">
          {navigation.legalLinks.map((item) => (
            <a
              key={item.id}
              href={item.href}
              className="flex items-center gap-3 px-5 py-3 text-sm text-slate-500 hover:bg-slate-50"
            >
              <span className="flex-1">{item.label}</span>
              <CaretRight size={16} className="text-slate-300" />
            </a>
          ))}
          {features.showPoweredBy ? (
            <div className="flex items-center gap-2 px-5 py-4 text-[11px] text-slate-400">
              <MapPin size={14} />
              <span>{copy.poweredByLabel}</span>
            </div>
          ) : null}
        </div>
      </SheetContent>
    </Sheet>
  );
}
