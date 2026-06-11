"use client";

import { useSyncExternalStore, useEffect } from "react";
import { isOnline, subscribe, probeConnectivity } from "@/lib/offline/connectivity";

// ---------------------------------------------------------------------------
// Snapshot functions for useSyncExternalStore
// ---------------------------------------------------------------------------

function getSnapshot(): boolean {
  return !isOnline();
}

function getServerSnapshot(): boolean {
  return false; // Assume online on server
}

// ---------------------------------------------------------------------------
// Hook
// ---------------------------------------------------------------------------

/**
 * Returns `true` when the app has no **real** internet connectivity.
 *
 * Unlike the raw `navigator.onLine`, this hook uses a backend health-check
 * probe that detects the common "WiFi is connected but there's no data"
 * scenario (very common with African ISPs).
 *
 * The probe runs:
 * - Once on first mount
 * - Whenever the browser fires `online` / `offline` events
 * - Every 30 seconds periodically
 */
export function useOffline(): boolean {
  // Trigger an immediate probe on mount in case the periodic one hasn't
  // fired yet (e.g. the user just navigated to this page).
  useEffect(() => {
    void probeConnectivity();
  }, []);

  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
