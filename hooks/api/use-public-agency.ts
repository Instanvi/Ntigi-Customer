"use client";

import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { agencySlug, API_BASE_URL } from "@/lib/agency-config";

export type PublicAgency = {
  id: string;
  name: string;
  slug: string;
  logoUrl: string | null;
  status: string;
};

export function usePublicAgency() {
  return useQuery({
    queryKey: ["public-agency", agencySlug],
    queryFn: async (): Promise<PublicAgency> => {
      const res = await axios.get<{
        success: boolean;
        data: PublicAgency;
      }>(`${API_BASE_URL}/client-app/agency/${encodeURIComponent(agencySlug)}`);
      if (!res.data?.success || !res.data.data) {
        throw new Error("Agency not found");
      }
      return res.data.data;
    },
    staleTime: 30 * 60 * 1000,
    retry: 1,
  });
}
