"use client";

import * as React from "react";
import { useRouter } from "@/lib/navigation";
import {
  usePublicTracking,
  type PublicTrackingResult,
} from "@/hooks/api/use-tracking";
import { ParcelDetailView } from "@/components/portal/parcel/parcel-detail-view";
import { PortalPage } from "@/components/portal/shell/portal-page";
import { PortalSubHeader } from "@/components/portal/shell/portal-sub-header";
import { TrackingVerifyForm } from "@/components/portal/tracking/tracking-verify-form";
import type { TrackingFormValues } from "@/components/portal/tracking/tracking-verify-form";
import { portalConfig } from "@/lib/portal-config";
import { AxiosError } from "axios";
import { toast } from "sonner";
import { useSearchParams } from "next/navigation";
import { useSession } from "@/hooks/use-session";

export function PortalTrackView({
  backHref = "/dashboard",
}: {
  backHref?: string;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { copy } = portalConfig;
  const { user } = useSession();
  const [trackingParams, setTrackingParams] = React.useState<{
    trackingNo: string;
    phoneNumber: string;
  } | null>(null);

  const initialTrackingNo =
    searchParams.get("trackingNo")?.trim().toUpperCase() ||
    searchParams.get("q")?.trim().toUpperCase() ||
    "";

  const initialPhone =
    searchParams.get("phone")?.trim() || user?.phoneNumber?.trim() || "";

  const defaultFormValues = React.useMemo(
    () => ({
      trackingNo: initialTrackingNo,
      phoneNumber: initialPhone,
    }),
    [initialTrackingNo, initialPhone],
  );

  React.useEffect(() => {
    const q =
      searchParams.get("trackingNo")?.trim().toUpperCase() ||
      searchParams.get("q")?.trim().toUpperCase();
    const phoneFromUrl = searchParams.get("phone")?.trim();

    if (q && phoneFromUrl) {
      setTrackingParams({ trackingNo: q, phoneNumber: phoneFromUrl });
    }
  }, [searchParams]);

  const {
    data: shipment,
    isLoading,
    isError,
    error,
  } = usePublicTracking(
    trackingParams?.trackingNo || "",
    trackingParams?.phoneNumber || "",
  );

  const handleStartTracking = (values: TrackingFormValues) => {
    setTrackingParams({
      trackingNo: values.trackingNo.trim().toUpperCase(),
      phoneNumber: values.phoneNumber,
    });
  };

  const reset = () => {
    setTrackingParams(null);
    const q = initialTrackingNo;
    if (q) {
      router.replace(
        `${backHref}/track?trackingNo=${encodeURIComponent(q)}`,
      );
    } else {
      router.replace(`${backHref}/track`);
    }
  };

  React.useEffect(() => {
    if (isError) {
      const axiosError = error as AxiosError<{ message?: string }>;
      const message =
        axiosError.response?.data?.message ||
        "Tracking failed. Check your ID and phone number.";
      toast.error("Verification failed", { description: message });
      setTrackingParams(null);
    }
  }, [isError, error]);

  if (shipment && !isLoading) {
    return (
      <ParcelDetailView
        shipment={shipment as PublicTrackingResult}
        onReset={reset}
      />
    );
  }

  return (
    <PortalPage>
      <PortalSubHeader
        title={copy.trackHeroTitle}
        onBack={() => router.push(backHref)}
      />
      <div className="px-[var(--portal-header-pad)] py-4 pb-6">
        <div className="portal-card p-5">
          <TrackingVerifyForm
            defaultValues={defaultFormValues}
            onSubmit={handleStartTracking}
            isLoading={isLoading && !!trackingParams}
          />
        </div>
      </div>
    </PortalPage>
  );
}
