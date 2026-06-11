"use client";

import { useRouter } from "@/lib/navigation";
import { PortalPage } from "@/components/portal/shell/portal-page";
import { PortalSubHeader } from "@/components/portal/shell/portal-sub-header";
import { ShipmentList } from "@/components/portal/shipments/shipment-list";
import { useSession } from "@/hooks/use-session";
import { portalConfig } from "@/lib/portal-config";

export default function ShipmentsPage() {
  const router = useRouter();
  const { user, isLoading } = useSession();

  if (isLoading || !user?.id) {
    return (
      <PortalPage>
        <PortalSubHeader title={portalConfig.copy.shipmentsTitle} />
        <div className="p-4 animate-pulse space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-32 rounded-[var(--portal-radius-card)] bg-white" />
          ))}
        </div>
      </PortalPage>
    );
  }

  return (
    <PortalPage>
      <PortalSubHeader title={portalConfig.copy.shipmentsTitle} />
      <ShipmentList
        enabled={!!user?.id}
        onOpenShipment={(trackingNo) =>
          router.push(`/shipments/${encodeURIComponent(trackingNo)}`)
        }
      />
    </PortalPage>
  );
}
