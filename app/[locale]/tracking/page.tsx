import { redirect } from "next/navigation";

type PageProps = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function LegacyTrackingRedirectPage({
  params,
  searchParams,
}: PageProps) {
  const { locale } = await params;
  const sp = await searchParams;
  const query = new URLSearchParams();

  const trackingNo = sp.trackingNo ?? sp.q;
  if (typeof trackingNo === "string" && trackingNo.trim()) {
    query.set("trackingNo", trackingNo.trim().toUpperCase());
  }
  if (typeof sp.phone === "string" && sp.phone.trim()) {
    query.set("phone", sp.phone.trim());
  }

  const suffix = query.toString() ? `?${query.toString()}` : "";
  redirect(`/${locale}/dashboard/track${suffix}`);
}
