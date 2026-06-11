"use client";

import { cn } from "@/lib/utils";

import { PortalBottomNavTabLink } from "../tab-link";
import { usePortalBottomNav } from "../use-bottom-nav";

/** Brand-primary bar with high-contrast active/inactive states. */
export function SolidBottomNav() {
  const { tabStates, isEmpty } = usePortalBottomNav();
  if (isEmpty) return null;

  return (
    <nav
      className="fixed bottom-0 inset-x-0 z-50 bg-primary pb-[env(safe-area-inset-bottom)] shadow-[0_-4px_20px_rgba(15,23,42,0.15)] md:hidden"
      aria-label="Main navigation"
    >
      <div className="mx-auto flex max-w-lg items-stretch">
        {tabStates.map((state) => (
          <PortalBottomNavTabLink
            key={state.tab.id}
            state={state}
            className={cn(
              "min-h-[var(--portal-bottom-nav-tab-height)] gap-1 py-1.5",
              state.active
                ? "text-white"
                : "text-white/55 hover:text-white/75",
            )}
          >
            <span
              className={cn(
                "flex flex-col items-center gap-0.5",
                state.active && "scale-105 transition-transform",
              )}
            >
              <state.Icon
                size={state.active ? 24 : 22}
                weight={state.active ? "fill" : "regular"}
              />
              <span className="mt-0.5 text-[11px] font-normal leading-tight text-inherit">
                {state.tab.label}
              </span>
            </span>
          </PortalBottomNavTabLink>
        ))}
      </div>
    </nav>
  );
}
