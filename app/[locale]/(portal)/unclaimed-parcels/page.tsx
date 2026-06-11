"use client";

import * as React from "react";
import { useTranslations } from "next-intl";
import { MagnifyingGlass } from "@phosphor-icons/react";

import { PortalPage } from "@/components/portal/shell/portal-page";
import { PortalSubHeader } from "@/components/portal/shell/portal-sub-header";
import { LostParcelCard } from "@/components/portal/unclaimed-parcels/lost-parcel-card";
import { LostParcelDetailSheet } from "@/components/portal/unclaimed-parcels/lost-parcel-detail-sheet";
import { useLostParcels } from "@/hooks/api/use-lost-parcels";
import { useSession } from "@/hooks/use-session";
import type { LostParcel } from "@/types";
import { Input } from "@/components/ui/input";

export default function UnclaimedParcelsPage() {
  const t = useTranslations("portal.unclaimedParcels");
  const { user, isLoading: sessionLoading } = useSession();
  const [search, setSearch] = React.useState("");
  const [selected, setSelected] = React.useState<LostParcel | null>(null);

  const query = useLostParcels(
    { page: 1, limit: 50 },
    { enabled: !!user?.id },
  );

  const parcels = React.useMemo(() => {
    const rows = query.data?.data ?? [];
    const term = search.trim().toLowerCase();
    if (!term) return rows;
    return rows.filter((p) => {
      const haystack = [
        p.referenceNo,
        p.description,
        p.branchName,
        p.branchCity,
        p.color,
        p.markings,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      return haystack.includes(term);
    });
  }, [query.data?.data, search]);

  if (sessionLoading || !user?.id) {
    return (
      <PortalPage>
        <PortalSubHeader title={t("title")} />
        <div className="space-y-3 p-4 animate-pulse">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-28 rounded-[var(--portal-radius-card)] bg-white"
            />
          ))}
        </div>
      </PortalPage>
    );
  }

  return (
    <PortalPage>
      <PortalSubHeader title={t("title")} />
      <div className="space-y-4 px-4 pb-6">
        <p className="text-sm text-slate-600">{t("description")}</p>

        <div className="relative">
          <MagnifyingGlass className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t("searchPlaceholder")}
            className="h-11 rounded-xl border-slate-200 bg-white pl-10"
          />
        </div>

        {query.isLoading ? (
          <div className="space-y-3 animate-pulse">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-28 rounded-[var(--portal-radius-card)] bg-white"
              />
            ))}
          </div>
        ) : parcels.length === 0 ? (
          <div className="rounded-[var(--portal-radius-card)] bg-white p-8 text-center">
            <p className="text-sm font-medium text-slate-900">{t("emptyTitle")}</p>
            <p className="mt-2 text-sm text-slate-500">{t("emptyBody")}</p>
          </div>
        ) : (
          <div className="space-y-3">
            {parcels.map((parcel) => (
              <LostParcelCard
                key={parcel.id}
                parcel={parcel}
                onPress={() => setSelected(parcel)}
              />
            ))}
          </div>
        )}
      </div>

      <LostParcelDetailSheet
        parcel={selected}
        open={!!selected}
        onOpenChange={(open) => !open && setSelected(null)}
      />
    </PortalPage>
  );
}
