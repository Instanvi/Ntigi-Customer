"use client";

import { useEffect, useRef } from "react";
import { useSession as useNextAuthSession } from "next-auth/react";
import { setCachedAccessToken } from "@/lib/http/session-token";
import {
  clearPermissionsStorage,
  usePermissionsStore,
} from "@/store/use-permissions-store";
import type { SessionUser } from "@/types/auth";

/**
 * Keeps permission codes in localStorage + Zustand (not in NextAuth cookies).
 * Refreshes from GET /client-app/me when the session user changes.
 */
export function PermissionsSync() {
  const { data: session, status } = useNextAuthSession();
  const refreshFromServer = usePermissionsStore((s) => s.refreshFromServer);
  const lastSyncedUserId = useRef<string | null>(null);

  const baseUser = session?.user as SessionUser | undefined;
  const userId = baseUser?.id;
  const accessToken = baseUser?.accessToken;

  useEffect(() => {
    if (status === "unauthenticated") {
      lastSyncedUserId.current = null;
      clearPermissionsStorage();
      setCachedAccessToken(null);
      return;
    }

    if (!accessToken) {
      setCachedAccessToken(null);
      return;
    }

    setCachedAccessToken(accessToken);
  }, [status, accessToken]);

  useEffect(() => {
    if (status !== "authenticated" || !userId || !accessToken) return;
    if (lastSyncedUserId.current === userId) return;

    lastSyncedUserId.current = userId;
    void refreshFromServer(userId);
  }, [status, userId, accessToken, refreshFromServer]);

  return null;
}
