"use client";

import { Link } from "@/lib/navigation";
import {
  Sheet,
  SheetContent,
} from "@/components/ui/sheet";
import { portalConfig } from "@/lib/portal-config";
import { CaretRight, X } from "@phosphor-icons/react";

export function PortalSideDrawer({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const { navigation, copy, version, features } = portalConfig;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="left"
        showCloseButton={false}
        className="w-[min(100vw-3rem,320px)] border-r border-slate-100 bg-white p-0"
      >
        <div className="flex h-full flex-col">
          <div className="flex items-center justify-end px-4 pt-4">
            <button
              type="button"
              aria-label="Close menu"
              onClick={() => onOpenChange(false)}
              className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100"
            >
              <X size={20} weight="bold" />
            </button>
          </div>

          <nav className="flex flex-col py-2">
            {navigation.drawerMenu.map((item) => {
              const className =
                "flex items-center gap-2 px-6 py-4 text-sm font-normal text-slate-800 hover:bg-slate-50";

              if (item.external) {
                return (
                  <a
                    key={item.id}
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={className}
                  >
                    <span className="flex-1">{item.label}</span>
                    <CaretRight size={16} className="text-slate-400" />
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
                  <span className="flex-1">{item.label}</span>
                  <CaretRight size={16} className="text-slate-400" />
                </Link>
              );
            })}
          </nav>

          <div className="mt-auto border-t border-slate-100 py-2">
            {navigation.legalLinks.map((item) => (
              <a
                key={item.id}
                href={item.href}
                className="flex items-center gap-2 px-6 py-3 text-base text-slate-500 hover:bg-slate-50"
              >
                <span className="flex-1">{item.label}</span>
                <CaretRight size={16} className="text-slate-300" />
              </a>
            ))}
            <p className="px-6 py-4 text-sm text-slate-400">
              version {version}
            </p>
            {features.showPoweredBy ? (
              <p className="px-6 pb-4 text-[11px] text-slate-400">
                {copy.poweredByLabel}
              </p>
            ) : null}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
