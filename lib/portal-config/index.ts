import { buildPortalConfig } from "./build-config";

export { buildPortalConfig } from "./build-config";
export { DEFAULT_PORTAL_CONFIG } from "./defaults";
export { resolvePortalIcon } from "./icons";
export {
  PORTAL_BOTTOM_NAV_VARIANTS,
  bottomNavReserveClass,
  parseBottomNavVariant,
} from "./bottom-nav-variant";
export type {
  PortalBottomNavVariant,
  PortalLocale,
  PortalConfig,
  PortalConfigOverride,
  PortalCopy,
  PortalDrawerItem,
  PortalFeatures,
  PortalIconName,
  PortalLegalLink,
  PortalNavTab,
  PortalQuickAction,
} from "./types";

/** Singleton — frozen at build time from env / JSON. */
export const portalConfig = buildPortalConfig();

export function isNavTabActive(
  pathname: string,
  tab: { href: string; matchPaths?: string[] },
): boolean {
  const prefixes = tab.matchPaths?.length ? tab.matchPaths : [tab.href];
  return prefixes.some(
    (prefix) =>
      pathname === prefix || pathname.startsWith(`${prefix}/`),
  );
}

export function runQuickAction(
  action: import("./types").PortalQuickAction["action"],
  ctx: {
    router: { push: (href: string) => void };
    supportPhone: string | null;
    locationsUrl: string | null;
  },
): void {
  switch (action.type) {
    case "href":
      ctx.router.push(action.href);
      break;
    case "scroll":
      document.getElementById(action.target)?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
      break;
    case "tel": {
      const phone = ctx.supportPhone?.replace(/\s/g, "");
      if (phone) window.location.href = `tel:${phone}`;
      else ctx.router.push("/account");
      break;
    }
    case "external":
      window.open(action.url, "_blank", "noopener,noreferrer");
      break;
  }
}
