"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";
import NextTopLoader from "nextjs-toploader";
import { SessionProvider } from "@/hooks/use-session";
import { PermissionsSync } from "@/components/providers/permissions-sync";
import { AgencyBrandProvider } from "@/components/providers/agency-brand-provider";
import { Toaster } from "@/components/ui/sonner";

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000,
            refetchOnWindowFocus: false,
            retry: 1,
          },
        },
      }),
  );

  return (
    <QueryClientProvider client={queryClient}>
      <NextTopLoader
        color="#263070"
        height={3}
        showSpinner={false}
        showForHashAnchor={false}
        zIndex={9999}
      />
      <SessionProvider>
        <AgencyBrandProvider>
          <PermissionsSync />
          {children}
          <Toaster position="top-right" toastOptions={{ duration: 3000 }} />
        </AgencyBrandProvider>
      </SessionProvider>
    </QueryClientProvider>
  );
}
