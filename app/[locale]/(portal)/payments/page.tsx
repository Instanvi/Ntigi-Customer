"use client";

import { useRouter } from "@/lib/navigation";
import { PortalPage } from "@/components/portal/shell/portal-page";
import { PortalSubHeader } from "@/components/portal/shell/portal-sub-header";
import { PaymentList } from "@/components/portal/payments/payment-list";
import { useSession } from "@/hooks/use-session";

export default function PaymentsPage() {
  const router = useRouter();
  const { user, isLoading } = useSession();

  if (isLoading || !user?.id) {
    return (
      <PortalPage>
        <PortalSubHeader title="Payments" />
        <div className="space-y-3 p-4 animate-pulse">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-32 rounded-[var(--portal-radius-card)] bg-white"
            />
          ))}
        </div>
      </PortalPage>
    );
  }

  return (
    <PortalPage>
      <PortalSubHeader title="Payments" />
      <PaymentList
        enabled={!!user?.id}
        onOpenShipment={(trackingNo) =>
          router.push(`/shipments/${encodeURIComponent(trackingNo)}`)
        }
      />
    </PortalPage>
  );
}
