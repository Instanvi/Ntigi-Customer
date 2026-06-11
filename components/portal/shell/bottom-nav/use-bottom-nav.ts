"use client";

import { usePathname } from "@/lib/navigation";
import {
  isNavTabActive,
  parseBottomNavVariant,
  portalConfig,
  resolvePortalIcon,
} from "@/lib/portal-config";
import type { PortalBottomNavVariant, PortalNavTab } from "@/lib/portal-config";

export type BottomNavTabState = {
  tab: PortalNavTab;
  active: boolean;
  Icon: ReturnType<typeof resolvePortalIcon>;
};

export function usePortalBottomNav() {
  const pathname = usePathname();
  const tabs = portalConfig.navigation.bottomTabs;
  const variant: PortalBottomNavVariant = parseBottomNavVariant(
    portalConfig.navigation.bottomNavVariant,
  );

  const tabStates: BottomNavTabState[] = tabs.map((tab) => ({
    tab,
    active: isNavTabActive(pathname, tab),
    Icon: resolvePortalIcon(tab.icon),
  }));

  return { tabs, tabStates, variant, isEmpty: tabs.length === 0 };
}
