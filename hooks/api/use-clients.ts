"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { SearchParams, ApiResponse, Client, Paginated } from "@/types";

interface CreateClientInput {
  agencyId: string;
  fullName: string;
  phoneNumber: string;
  email?: string | null;
  secondaryPhone?: string | null;
  website?: string | null;
  companyName?: string | null;
  address?: string | null;
  postalCode?: string | null;
  city?: string | null;
  region?: string | null;
  countryCode?: string | null;
  taxId?: string | null;
  notes?: string | null;
  customerCategoryId?: string | null;
  clientType?: "INDIVIDUAL" | "BUSINESS";
  isVerified?: boolean;
}

interface UpdateClientInput {
  fullName?: string;
  phoneNumber?: string;
  email?: string | null;
  secondaryPhone?: string | null;
  website?: string | null;
  companyName?: string | null;
  address?: string | null;
  postalCode?: string | null;
  city?: string | null;
  region?: string | null;
  countryCode?: string | null;
  taxId?: string | null;
  notes?: string | null;
  customerCategoryId?: string | null;
  clientType?: "INDIVIDUAL" | "BUSINESS";
  isVerified?: boolean;
}

export function useClients(agencyId: string, params?: SearchParams) {
  return useQuery<Paginated<Client>>({
    queryKey: ["clients", agencyId, params],
    queryFn: async () => {
      const response = await api.get<ApiResponse<Client[]>>("/clients", {
        params: { agencyId, ...params },
      });

      const resData = response.data;
      if (resData && resData.success) {
        const mappedData = {
          data: resData.data || [],
          pagination: resData.pagination || {
            page: 1,
            limit: 20,
            total: (resData.data || []).length,
            totalPages: 1,
          },
        };
        return mappedData;
      }

      return {
        data: [],
        pagination: { page: 1, limit: 20, total: 0, totalPages: 0 },
      };
    },
    enabled: !!agencyId,
  });
}

export function useClient(id: string) {
  return useQuery<Client>({
    queryKey: ["clients", id],
    queryFn: async () => {
      const response = await api.get<ApiResponse<Client>>(`/clients/${id}`);
      return response.data.data;
    },
    enabled: !!id,
  });
}

export function useCreateClient() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: CreateClientInput) => {
      const response = await api.post("/clients", data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["clients"] });
    },
  });
}

export function useUpdateClient() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: string;
      data: UpdateClientInput;
    }) => {
      const response = await api.put(`/clients/${id}`, data);
      return response.data;
    },
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ["clients"] });
      queryClient.invalidateQueries({ queryKey: ["clients", id] });
    },
  });
}

export function useDeleteClient() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const response = await api.delete(`/clients/${id}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["clients"] });
    },
  });
}
