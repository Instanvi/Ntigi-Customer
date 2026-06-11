"use client";

import { PortalBottomNavTabLink } from "../tab-link";
import { usePortalBottomNav } from "../use-bottom-nav";

/** Default mockup bar — light gray surface, top border. */
export function ClassicBottomNav() {
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
            className="min-h-[var(--portal-bottom-nav-tab-height)] gap-1 py-1.5"
          />
        ))}
      </div>
    </nav>
  );
}
