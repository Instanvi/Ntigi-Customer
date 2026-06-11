"use client";

import { cn } from "@/lib/utils";

import { PortalBottomNavTabLink } from "../tab-link";
import { usePortalBottomNav } from "../use-bottom-nav";

/** Active tab marked with a primary top accent bar. */
export function UnderlineBottomNav() {
  const { tabStates, isEmpty } = usePortalBottomNav();
  if (isEmpty) return null;

  return (
    <nav
      className="fixed bottom-0 inset-x-0 z-50 border-t border-slate-200/80 bg-white pb-[env(safe-area-inset-bottom)] md:hidden"
      aria-label="Main navigation"
    >
      <div className="mx-auto flex max-w-lg items-stretch">
        {tabStates.map((state) => (
          <PortalBottomNavTabLink
            key={state.tab.id}
            state={state}
            className="min-h-[var(--portal-bottom-nav-tab-height)] gap-1 py-1.5 pt-1"
            iconSize={22}
          >
            <span
              className={cn(
                "absolute top-0 left-1/2 h-0.5 w-8 -translate-x-1/2 rounded-full bg-[var(--portal-nav-active)] transition-opacity",
                state.active ? "opacity-100" : "opacity-0",
              )}
              aria-hidden
            />
            <state.Icon
              size={22}
              weight={state.active ? "fill" : "regular"}
            />
            <span className="mt-0.5 text-[11px] font-normal leading-tight text-inherit">
              {state.tab.label}
            </span>
          </PortalBottomNavTabLink>
        ))}
      </div>
    </nav>
  );
}
