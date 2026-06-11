"use client";

import * as React from "react";
import { useRouter } from "@/lib/navigation";
import { PortalPage } from "@/components/portal/shell/portal-page";
import { PortalHomeHero } from "@/components/portal/shell/portal-home-hero";
import { NoticeCarousel } from "@/components/portal/home/notice-carousel";
import { QuickActionRow } from "@/components/portal/home/quick-action-row";
import {
  portalConfig,
  resolvePortalIcon,
  runQuickAction,
} from "@/lib/portal-config";
import { useSession } from "@/hooks/use-session";
import { useClientHomeNotices } from "@/hooks/api/use-client-home-notices";
import type { PortalNotice } from "@/lib/portal-config/types";

export default function CustomerDashboardPage() {
  const router = useRouter();
  const { home, copy, features } = portalConfig;
  const { user } = useSession();
  const { data: apiNotices = [] } = useClientHomeNotices({
    enabled: !!user?.id,
  });

  const mergedNotices = React.useMemo((): PortalNotice[] => {
    const fromApi: PortalNotice[] = apiNotices.map((n) => ({
      id: n.id,
      title: n.title,
      body: n.content,
    }));
    const staticIds = new Set(home.notices.map((n) => n.id));
    const apiOnly = fromApi.filter((n) => !staticIds.has(n.id));
    return [...home.notices, ...apiOnly];
  }, [apiNotices, home.notices]);

  return (
    <PortalPage>
      <PortalHomeHero />

      <div className="space-y-3 pb-4 pt-4">
        <NoticeCarousel
          title={home.noticeSectionTitle || copy.noticeSectionTitle}
          notices={mergedNotices}
        />

        {features.showHomeQuickActions ? (
          <div className="flex flex-col gap-2 px-[var(--portal-header-pad)]">
            {home.quickActions.map(action => {
              const Icon = resolvePortalIcon(action.icon);
              return (
                <QuickActionRow
                  key={action.id}
                  label={action.label}
                  icon={Icon}
                  iconAccent={
                    action.id === "locations" ? "orange" : "primary"
                  }
                  onClick={() =>
                    runQuickAction(action.action, {
                      router,
                      supportPhone: portalConfig.support.phone,
                      locationsUrl: portalConfig.support.locationsUrl,
                    })
                  }
                />
              );
            })}
          </div>
        ) : null}
      </div>
    </PortalPage>
  );
}
