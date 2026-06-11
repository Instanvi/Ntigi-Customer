"use client";

import { cn } from "@/lib/utils";

import { PortalBottomNavTabLink } from "../tab-link";
import { usePortalBottomNav } from "../use-bottom-nav";

/** Elevated card inset from screen edges — iOS-style floating bar. */
export function FloatingBottomNav() {
  const { tabStates, isEmpty } = usePortalBottomNav();
  if (isEmpty) return null;

  return (
    <nav
      className="pointer-events-none fixed bottom-0 inset-x-0 z-50 px-3 pb-[calc(0.5rem+env(safe-area-inset-bottom))] md:hidden"
      aria-label="Main navigation"
    >
      <div className="pointer-events-auto mx-auto flex max-w-lg items-stretch rounded-2xl border border-slate-200/90 bg-white/95 shadow-[0_8px_32px_rgba(15,23,42,0.12)] backdrop-blur-md">
        {tabStates.map((state) => (
          <PortalBottomNavTabLink
            key={state.tab.id}
            state={state}
            className="min-h-[var(--portal-bottom-nav-tab-height)] gap-1 py-1.5"
          />
        ))}
      </div>
    </nav>
  );
}
