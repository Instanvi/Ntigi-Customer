"use client";

import { useSession as useNextAuthSession } from "next-auth/react";
import { useEffect, useMemo } from "react";
import { SessionUser } from "@/types/auth";
import {
  selectPermissionsForUser,
  usePermissionsStore,
} from "@/store/use-permissions-store";

export { SessionProvider } from "next-auth/react";

export function useSession() {
  const { data: session, status, update } = useNextAuthSession();
  const baseUser = (session?.user as SessionUser) ?? null;

  const storedUserId = usePermissionsStore((s) => s.userId);
  const storedPermissions = usePermissionsStore((s) => s.permissions);
  const isRefreshing = usePermissionsStore((s) => s.isRefreshing);

  const permissions = useMemo(() => {
    if (!baseUser?.id) return [];
    return baseUser.id === storedUserId ? storedPermissions : selectPermissionsForUser(baseUser.id);
  }, [baseUser?.id, storedUserId, storedPermissions]);

  const user = useMemo(() => {
    if (!baseUser) return null;
    return { ...baseUser, permissions };
  }, [baseUser, permissions]);

  const isLoading = status === "loading";

  const permissionsReady =
    !baseUser?.accessToken ||
    (baseUser.id === storedUserId && storedPermissions.length > 0) ||
    !isRefreshing;

  return {
    user,
    isLoading,
    permissionsReady,
    status,
    update,
    agencyId: user?.agencyId ?? null,
    branchId: user?.branchId ?? null,
  };
}

/** Convenience hook — throws if there's no agencyId */
export function useAgencyId(): string {
  const { user } = useSession();
  if (!user?.agencyId) {
    throw new Error("No agency found in session");
  }
  return user.agencyId;
}

/**
 * Stop (branch) id when the user is assigned to a branch (e.g. AGENT).
 * `undefined` for agency-wide roles (GENERAL_MANAGER, SYSTEM_ADMIN, etc.) — do not throw.
 */
export function useBranchId(): string | undefined {
  const { user } = useSession();
  return user?.branchId ?? undefined;
}
