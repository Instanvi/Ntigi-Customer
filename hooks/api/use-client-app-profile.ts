"use client";

import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { ApiResponse, Client } from "@/types";

export function useClientAppProfile(options?: { enabled?: boolean }) {
  return useQuery<Client>({
    queryKey: ["client-app", "profile"],
    queryFn: async () => {
      const response = await api.get<ApiResponse<Client>>("/client-app/profile");
      return response.data.data;
    },
    enabled: options?.enabled !== false,
  });
}
