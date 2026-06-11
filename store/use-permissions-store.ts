import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { fetchPermissionCodesFromApi } from "@/lib/auth/permissions-client";

const STORAGE_KEY = "ntigi-permissions-storage";

interface PermissionsState {
  userId: string | null;
  permissions: string[];
  /** True while fetching fresh codes from /auth/me */
  isRefreshing: boolean;
  setSession: (userId: string, permissions: string[]) => void;
  clearSession: () => void;
  /**
   * Refresh from API and persist to localStorage.
   * Skips if already refreshing for the same user.
   */
  refreshFromServer: (userId: string) => Promise<string[]>;
}

export const usePermissionsStore = create<PermissionsState>()(
  persist(
    (set, get) => ({
      userId: null,
      permissions: [],
      isRefreshing: false,

      setSession: (userId, permissions) =>
        set({ userId, permissions, isRefreshing: false }),

      clearSession: () =>
        set({ userId: null, permissions: [], isRefreshing: false }),

      refreshFromServer: async (userId) => {
        if (!userId) return [];
        const state = get();
        if (state.isRefreshing && state.userId === userId) {
          return state.permissions;
        }

        set({ isRefreshing: true });
        try {
          const permissions = await fetchPermissionCodesFromApi();
          set({ userId, permissions, isRefreshing: false });
          return permissions;
        } catch {
          set({ isRefreshing: false });
          return get().userId === userId ? get().permissions : [];
        }
      },
    }),
    {
      name: STORAGE_KEY,
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        userId: state.userId,
        permissions: state.permissions,
      }),
    },
  ),
);

/** Save permissions right after login (from login response body). */
export function persistPermissionsAfterLogin(
  userId: string,
  permissions: string[] | undefined,
) {
  usePermissionsStore
    .getState()
    .setSession(userId, Array.isArray(permissions) ? permissions : []);
}

export function clearPermissionsStorage() {
  usePermissionsStore.getState().clearSession();
  if (typeof window !== "undefined") {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      /* ignore */
    }
  }
}

/** Permissions for the active user (empty if userId mismatch). */
export function selectPermissionsForUser(userId: string | undefined): string[] {
  const { userId: storedId, permissions } = usePermissionsStore.getState();
  if (!userId || userId !== storedId) return [];
  return permissions;
}
