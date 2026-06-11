"use client";

import { portalConfig } from "@/lib/portal-config";

/** White-label portal config (build-time; same for all clients in a deployment). */
export function usePortalConfig() {
  return portalConfig;
}
