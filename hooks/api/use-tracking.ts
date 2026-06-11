"use client";

import {
  useQuery,
  useMutation,
  UseMutationOptions,
} from "@tanstack/react-query";
import { api } from "@/lib/api";
import { agencySlug } from "@/lib/agency-config";
import { TrackingLog, ApiResponse } from "@/types";

export function useTrackingLogs(vehicleId: string) {
  return useQuery({
    queryKey: ["tracking", vehicleId],
    queryFn: async () => {
      const response = await api.get(`/tracking/logs/${vehicleId}`);
      return response.data;
    },
    enabled: !!vehicleId,
  });
}

export function useCreateTrackingLog(
  options?: UseMutationOptions<
    ApiResponse<TrackingLog>,
    Error,
    { vehicleId: string; latitude: string; longitude: string; consolidationId?: string }
  >,
) {
  return useMutation({
    mutationFn: async (data: {
      vehicleId: string;
      latitude: string;
      longitude: string;
      consolidationId?: string;
    }) => {
      const response = await api.post("/tracking/location", data);
      return response.data;
    },
    ...options,
  });
}

type PublicTrackingApiPayload = PublicTrackingResult & {
  shipment?: Record<string, unknown>;
  currentHolder?: PublicTrackingResult["currentHolder"];
  invoice?: PublicTrackingResult["invoice"];
};

function normalizeCurrentHolder(
  holder: unknown,
): PublicTrackingResult["currentHolder"] {
  if (!holder || typeof holder !== "object") return undefined;
  const h = holder as PublicTrackingResult["currentHolder"];
  if (
    h?.type === "BRANCH" ||
    h?.type === "VEHICLE" ||
    h?.type === "CLIENT"
  ) {
    return h;
  }
  return undefined;
}

function toIsoDate(value: unknown): string | undefined {
  if (!value) return undefined;
  if (value instanceof Date) return value.toISOString();
  if (typeof value === "string") return value;
  return undefined;
}

function normalizePublicTrackingPayload(
  data: PublicTrackingApiPayload,
): PublicTrackingResult {
  const nested = data.shipment;
  if (!nested || typeof nested !== "object") {
    return data;
  }

  const voyage = nested.voyage as
    | { arrivalTime?: string; carrier?: { carrierName?: string } }
    | undefined;
  const manifestVoyage = (
    nested.manifest as { voyage?: { arrivalTime?: string; carrier?: { carrierName?: string } } } | undefined
  )?.voyage;

  const carrier =
    (typeof nested.carrier === "string" && nested.carrier) ||
    voyage?.carrier?.carrierName ||
    manifestVoyage?.carrier?.carrierName ||
    undefined;

  const expectedDeliveryDate =
    toIsoDate(voyage?.arrivalTime) ??
    toIsoDate(manifestVoyage?.arrivalTime) ??
    toIsoDate(nested.expectedDeliveryDate) ??
    data.expectedDeliveryDate;

  return {
    trackingNo: String(nested.trackingNo ?? data.trackingNo),
    status: String(nested.status ?? data.status),
    origin: {
      name: String(
        (nested.origin as { name?: string })?.name ?? data.origin?.name ?? "N/A",
      ),
      city: (nested.origin as { city?: string })?.city ?? data.origin?.city,
      address:
        (nested.origin as { address?: string })?.address ?? data.origin?.address,
      latitude:
        (nested.origin as { latitude?: string })?.latitude ??
        data.origin?.latitude,
      longitude:
        (nested.origin as { longitude?: string })?.longitude ??
        data.origin?.longitude,
    },
    destination: {
      name: String(
        (nested.destination as { name?: string })?.name ??
          data.destination?.name ??
          "N/A",
      ),
      city:
        (nested.destination as { city?: string })?.city ?? data.destination?.city,
      address:
        (nested.destination as { address?: string })?.address ??
        data.destination?.address,
      latitude:
        (nested.destination as { latitude?: string })?.latitude ??
        data.destination?.latitude,
      longitude:
        (nested.destination as { longitude?: string })?.longitude ??
        data.destination?.longitude,
    },
    quantity: data.quantity ?? 0,
    description:
      (nested.packages as { description?: string }[] | undefined)?.[0]
        ?.description ??
      data.description,
    createdAt: toIsoDate(nested.createdAt) ?? data.createdAt,
    expectedDeliveryDate,
    carrier,
    transitMode: String(nested.mode ?? data.transitMode ?? "LAND"),
    packages: data.packages ?? [],
    currentLocation: data.currentLocation,
    vehicleId: data.vehicleId,
    currentHolder: normalizeCurrentHolder(
      data.currentHolder ?? nested.currentHolder,
    ),
    invoice: data.invoice,
  };
}

export interface PublicTrackingResult {
  trackingNo: string;
  status: string;
  carrier?: string;
  origin: {
    name: string;
    city?: string;
    address?: string;
    latitude?: string;
    longitude?: string;
  };
  destination: {
    name: string;
    city?: string;
    address?: string;
    latitude?: string;
    longitude?: string;
  };
  quantity: string | number;
  description?: string;
  createdAt: string;
  expectedDeliveryDate?: string;
  transitMode?: string;
  packages: {
    description: string;
    qty: string | number;
    weight?: string | number;
    dimensions?: string | null;
  }[];
  currentLocation?: {
    latitude: number | string;
    longitude: number | string;
    timestamp: string;
  };
  vehicleId?: string;
  currentHolder?: {
    type: "BRANCH" | "VEHICLE" | "CLIENT";
    data: {
      name?: string;
      plateNumber?: string;
      latitude?: number;
      longitude?: number;
    };
  };
  invoice?: {
    invoiceNo: string;
    totalAmount: string;
    currency: string;
    status: string;
    dueDate?: string | null;
  } | null;
}

export function usePublicTracking(trackingNo: string, phoneNumber: string) {
  return useQuery({
    queryKey: ["tracking", "public", trackingNo, phoneNumber, agencySlug],
    queryFn: async () => {
      const response = await api.get<ApiResponse<PublicTrackingResult>>(
        `/client-app/tracking/${trackingNo}`,
        {
          params: { phoneNumber, agencySlug },
        },
      );
      return normalizePublicTrackingPayload(
        response.data.data as PublicTrackingApiPayload,
      );
    },
    enabled: !!trackingNo && !!phoneNumber,
    retry: false,
  });
}

export function useVesselInfoLookup() {
  return useMutation({
    mutationFn: async (imoOrMmsi: string) => {
      const q = String(imoOrMmsi ?? "").trim();
      const res = await api.get<ApiResponse<Record<string, unknown>>>(
        "/tracking/vessel/info",
        { params: { imoOrMmsi: q } },
      );
      return res.data.data;
    },
  });
}

export function useVesselLocationLookup() {
  return useMutation({
    mutationFn: async (imoOrMmsi: string) => {
      const q = String(imoOrMmsi ?? "").trim();
      const res = await api.get<ApiResponse<Record<string, unknown>>>(
        "/tracking/vessel/location",
        { params: { imoOrMmsi: q } },
      );
      return res.data.data;
    },
  });
}

export function useVesselCredits(enabled: boolean) {
  return useQuery({
    queryKey: ["tracking", "vessel", "credits"],
    queryFn: async () => {
      const res = await api.get<ApiResponse<Record<string, unknown>>>(
        "/tracking/vessel/credits",
      );
      return res.data.data;
    },
    enabled,
    staleTime: 60_000,
  });
}

export function useDeclineShipment() {
  return useMutation({
    mutationFn: async ({ trackingNo, reason }: { trackingNo: string; reason: string }) => {
      const response = await api.post(
        `/client-app/tracking/${trackingNo}/decline`,
        { reason },
      );
      return response.data;
    },
  });
}
