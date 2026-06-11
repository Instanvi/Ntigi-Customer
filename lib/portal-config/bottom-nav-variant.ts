import type { PortalBottomNavVariant } from "./types";

export const PORTAL_BOTTOM_NAV_VARIANTS = [
  "classic",
  "floating",
  "pill",
  "underline",
  "solid",
] as const satisfies readonly PortalBottomNavVariant[];

export function parseBottomNavVariant(
  raw: string | undefined,
): PortalBottomNavVariant {
  const v = raw?.trim().toLowerCase();
  if (
    v &&
    (PORTAL_BOTTOM_NAV_VARIANTS as readonly string[]).includes(v)
  ) {
    return v as PortalBottomNavVariant;
  }
  return "classic";
}

/** Tailwind padding class — full string so JIT can see it at build time. */
export function bottomNavReserveClass(
  variant: PortalBottomNavVariant = "classic",
): string {
  switch (variant) {
    case "floating":
      return "pb-[calc(4.75rem+env(safe-area-inset-bottom))]";
    case "solid":
      return "pb-[calc(3.5rem+env(safe-area-inset-bottom))]";
    default:
      return "pb-[calc(3.75rem+env(safe-area-inset-bottom))]";
  }
}
