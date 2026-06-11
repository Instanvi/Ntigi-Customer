"use client";

import dynamic from "next/dynamic";
import { useTranslations } from "next-intl";
import { PortalDetailHeader } from "@/components/portal/shell/portal-detail-header";
import { useAgencyStopsForMap } from "@/hooks/api/use-agency-stops";
import { useSession } from "@/hooks/use-session";

const BranchLocationsMap = dynamic(
  () =>
    import("@/components/portal/locations/branch-locations-map").then(
      (mod) => mod.BranchLocationsMap,
    ),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-full items-center justify-center bg-[#DDE7F0]">
        <div className="h-8 w-8 animate-spin border-2 border-primary border-t-transparent" />
      </div>
    ),
  },
);

export default function LocationsPage() {
  const t = useTranslations("portal.locations");
  const { user } = useSession();
  const { pins, isLoading } = useAgencyStopsForMap({
    enabled: !!user?.id,
    highlightStopId: user?.branchId,
  });

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-white">
      <PortalDetailHeader title={t("title")} />
      <div className="relative min-h-0 flex-1">
        {isLoading ? (
          <div className="flex h-full items-center justify-center bg-[#DDE7F0]">
            <div className="h-8 w-8 animate-spin border-2 border-primary border-t-transparent" />
          </div>
        ) : (
          <BranchLocationsMap pins={pins} className="h-full" />
        )}
      </div>
    </div>
  );
}
