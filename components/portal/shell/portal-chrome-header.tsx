"use client";

import * as React from "react";
import Image from "next/image";
import { Link } from "@/lib/navigation";
import { List, Bell } from "@phosphor-icons/react";
import { useAgencyBrand } from "@/components/providers/agency-brand-provider";
import { PortalSideDrawer } from "@/components/portal/shell/portal-side-drawer";
import { portalConfig } from "@/lib/portal-config";
import { useSession } from "@/hooks/use-session";
import { useClientNotificationUnreadCount } from "@/hooks/api/use-client-notifications";
import { cn } from "@/lib/utils";

type PortalChromeHeaderProps = {
  title?: string;
  showMenu?: boolean;
  showNotifications?: boolean;
  tone?: "dark" | "light";
  className?: string;
  onMenuClick?: () => void;
  drawerOpen?: boolean;
  onDrawerOpenChange?: (open: boolean) => void;
};

export function PortalChromeHeader({
  title,
  showMenu,
  showNotifications,
  tone = "dark",
  className,
  onMenuClick,
  drawerOpen: controlledOpen,
  onDrawerOpenChange,
}: PortalChromeHeaderProps) {
  const { displayName, logoUrl } = useAgencyBrand();
  const [internalOpen, setInternalOpen] = React.useState(false);
  const { features } = portalConfig;
  const { user } = useSession();
  const { data: unreadCount = 0 } = useClientNotificationUnreadCount({
    enabled: !!user?.id,
  });

  const drawerOpen = controlledOpen ?? internalOpen;
  const setDrawerOpen = onDrawerOpenChange ?? setInternalOpen;

  const menuEnabled = showMenu ?? features.showDrawerMenu;
  const notificationsEnabled = showNotifications ?? features.showNotifications;
  const badgeCount = user?.id
    ? unreadCount
    : features.notificationBadgeCount;
  const showBadge =
    features.showNotificationBadge && badgeCount > 0;
  const isLight = tone === "light";

  return (
    <>
      <div
        className={cn(
          "flex items-center gap-3 px-[var(--portal-header-pad)] py-3 pt-[max(0.75rem,env(safe-area-inset-top))]",
          isLight ? "text-slate-900" : "text-white",
          className
        )}
      >
        {menuEnabled ? (
          <button
            type="button"
            aria-label="Open menu"
            onClick={() => {
              onMenuClick?.();
              setDrawerOpen(true);
            }}
            className={cn(
              "flex h-10 w-10 shrink-0 items-center justify-center",
              isLight ? "hover:bg-slate-100" : "hover:bg-white/10"
            )}
          >
            <List size={22} weight="regular" />
          </button>
        ) : (
          <span className="w-10 shrink-0" />
        )}

        <div className="flex min-w-0 flex-1 flex-col items-center justify-center">
          {logoUrl ? (
            <Image
              src={logoUrl}
              alt={displayName}
              width={120}
              height={32}
              className={cn(
                "h-8 w-auto max-w-[140px] object-contain",
                !isLight && "brightness-0 invert"
              )}
              unoptimized
              priority
            />
          ) : (
            <span className="truncate text-sm font-normal uppercase tracking-wide">
              {title ?? displayName}
            </span>
          )}
        </div>

        {notificationsEnabled ? (
          <Link
            href="/notifications"
            aria-label="Notifications"
            className={cn(
              "relative flex h-9 w-9 shrink-0 items-center justify-center rounded-full",
              isLight
                ? "bg-[#4E6BFA]/10 text-[#4E6BFA] hover:bg-[#4E6BFA]/15"
                : "bg-white/20 text-white hover:bg-white/30"
            )}
          >
            <Bell size={20} weight="fill" />
            {showBadge ? (
              <span className="absolute -right-0.5 -top-0.5 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-normal text-white">
                {badgeCount > 99 ? "99+" : badgeCount}
              </span>
            ) : null}
          </Link>
        ) : (
          <span className="w-10 shrink-0" />
        )}
      </div>

      {menuEnabled ? (
        <PortalSideDrawer open={drawerOpen} onOpenChange={setDrawerOpen} />
      ) : null}
    </>
  );
}
