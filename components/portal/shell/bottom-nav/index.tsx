"use client";

import type { PortalBottomNavVariant } from "./types";
import { ClassicBottomNav } from "./variants/classic";
import { FloatingBottomNav } from "./variants/floating";
import { PillBottomNav } from "./variants/pill";
import { SolidBottomNav } from "./variants/solid";
import { UnderlineBottomNav } from "./variants/underline";
import { usePortalBottomNav } from "./use-bottom-nav";

const VARIANT_COMPONENTS: Record<
  PortalBottomNavVariant,
  () => React.ReactNode
> = {
  classic: ClassicBottomNav,
  floating: FloatingBottomNav,
  pill: PillBottomNav,
  underline: UnderlineBottomNav,
  solid: SolidBottomNav,
};

export function PortalBottomNav() {
  const { variant, isEmpty } = usePortalBottomNav();
  if (isEmpty) return null;
  const Component = VARIANT_COMPONENTS[variant];
  return <Component />;
}

export {
  bottomNavReserveClass,
  parseBottomNavVariant,
  PORTAL_BOTTOM_NAV_VARIANTS,
} from "./types";
export type { PortalBottomNavVariant } from "./types";
