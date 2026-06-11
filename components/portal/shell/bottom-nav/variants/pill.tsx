"use client";

import { cn } from "@/lib/utils";

import { PortalBottomNavTabLink } from "../tab-link";
import { usePortalBottomNav } from "../use-bottom-nav";

/** Active tab sits on a rounded primary-tint pill. */
export function PillBottomNav() {
  const { tabStates, isEmpty } = usePortalBottomNav();
  if (isEmpty) return null;

  return (
    <nav
      className="fixed bottom-0 inset-x-0 z-50 border-t border-slate-200/60 bg-white pb-[env(safe-area-inset-bottom)] shadow-[0_-2px_16px_rgba(15,23,42,0.04)] md:hidden"
      aria-label="Main navigation"
    >
      <div className="mx-auto flex max-w-lg items-stretch px-1 pt-1">
        {tabStates.map((state) => (
          <PortalBottomNavTabLink
            key={state.tab.id}
            state={state}
            className={cn(
              "min-h-[var(--portal-bottom-nav-tab-height)] gap-1 rounded-xl px-1 py-1.5",
              state.active && "bg-[#4F578B]/10",
            )}
          />
        ))}
      </div>
    </nav>
  );
}
