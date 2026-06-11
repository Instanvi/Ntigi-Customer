"use client";

import { useQuery, useQueries } from "@tanstack/react-query";
import { api } from "@/lib/api";
import type { ApiPaginatedResponse, ApiResponse, Stop } from "@/types";
import {
  collectStopGeocodePlaces,
  geocodedStopToPin,
  resolveStopCoordinates,
  stopsToMapPins,
  type BranchMapPin,
} from "@/lib/portal/stop-map-data";
import { useMemo } from "react";

export type GeocodeHit = {
  lat: number;
  lng: number;
  displayName?: string;
};

const STOPS_LIMIT = "1000";

export function useAgencyStopsForMap(options?: {
  enabled?: boolean;
  highlightStopId?: string | null;
}) {
  const enabled = options?.enabled !== false;

  const stopsQuery = useQuery({
    queryKey: ["locations", "stops", "portal-map"],
    queryFn: async () => {
      const response = await api.get<ApiPaginatedResponse<Stop>>(
        "/locations/stops",
        { params: { page: "1", limit: STOPS_LIMIT } },
      );
      return response.data;
    },
    enabled,
    staleTime: 5 * 60 * 1000,
  });

  const stops = stopsQuery.data?.data ?? [];

  const geoPlaces = useMemo(
    () => collectStopGeocodePlaces(stops),
    [stops],
  );

  const geoQueries = useQueries({
    queries: geoPlaces.map((p) => ({
      queryKey: ["locations", "geocode", "portal-map", p.cc, p.q],
      queryFn: async () => {
        const res = await api.get<ApiResponse<GeocodeHit[]>>(
          "/locations/geocode",
          {
            params: { q: p.q, ...(p.cc ? { countryCode: p.cc } : {}) },
          },
        );
        const payload = res.data;
        const hit =
          payload.success && Array.isArray(payload.data) && payload.data[0]
            ? payload.data[0]
            : null;
        return {
          key: p.key,
          pos: hit ? ([hit.lat, hit.lng] as [number, number]) : null,
        };
      },
      enabled: enabled && p.q.length >= 3,
      staleTime: 7 * 24 * 60 * 60 * 1000,
    })),
  });

  const geocodeByKey = useMemo(() => {
    const m = new Map<string, [number, number]>();
    geoQueries.forEach((q, i) => {
      const row = geoPlaces[i];
      if (row && q.data?.pos) m.set(row.key, q.data.pos);
    });
    return m;
  }, [geoQueries, geoPlaces]);

  const pins = useMemo((): BranchMapPin[] => {
    const highlight = options?.highlightStopId ?? null;
    const base = stopsToMapPins(stops, { highlightStopId: highlight });
    const seenIds = new Set(base.map((p) => p.id));
    const extras: BranchMapPin[] = [];

    for (const s of stops) {
      if (resolveStopCoordinates(s)) continue;
      const q = s.city?.trim() || s.name?.trim() || "";
      if (q.length < 3) continue;
      const cc = (s.countryCode?.trim() || "").toUpperCase();
      const key = `${cc}|${q.toLowerCase()}`;
      const pos = geocodeByKey.get(key);
      if (!pos) continue;
      const id = `stop-${s.id}`;
      if (seenIds.has(id)) continue;
      seenIds.add(id);
      extras.push(geocodedStopToPin(s, pos, highlight));
    }

    return [...base, ...extras];
  }, [stops, geocodeByKey, options?.highlightStopId]);

  return {
    pins,
    isLoading: stopsQuery.isLoading,
    isError: stopsQuery.isError,
    refetch: stopsQuery.refetch,
  };
}
