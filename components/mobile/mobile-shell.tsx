"use client";

import { usePathname } from "@/lib/navigation";
import {
  PortalBottomNav,
  bottomNavReserveClass,
} from "@/components/portal/shell/portal-bottom-nav";
import { PWAInstallPrompt } from "@/components/shared/pwa-install-prompt";
import { portalConfig } from "@/lib/portal-config";
import { cn } from "@/lib/utils";

const FULL_SCREEN_ROUTES = ["/locations"];

export function MobileShell({
  children,
  className,
  hideNav = false,
}: {
  children: React.ReactNode;
  className?: string;
  hideNav?: boolean;
}) {
  const pathname = usePathname();
  const isFullScreen = FULL_SCREEN_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`),
  );
  const navHidden = hideNav || isFullScreen;
  const navPadding = bottomNavReserveClass(
    portalConfig.navigation.bottomNavVariant ?? "classic",
  );

  return (
    <div className={cn("portal-page-bg min-h-dvh", className)}>
      <div
        className={cn(
          "mx-auto flex min-h-dvh w-full max-w-lg flex-col",
          !navHidden && navPadding,
          !navHidden && "md:pb-0",
        )}
      >
        {children}
      </div>
      {!navHidden && <PortalBottomNav />}
      <PWAInstallPrompt />
    </div>
  );
}
