import type { SessionUser } from "@/types/auth";
import type { UserRole } from "@/types/roles";

/** Role gates reserved for platform admin and client portal accounts. */
export type RoleGate = "SYSTEM_ADMIN" | "CLIENT";

export type AccessRequirement = {
  /** At least one JWT permission code (branch role, enum defaults, or CLIENT grants). */
  anyPermission: readonly string[];
  /**
   * When set, the session job title must match. Used for **SYSTEM_ADMIN** (platform)
   * and **CLIENT** (portal) only. Agency staff (GM, manager, agent, …) never use this.
   */
  roleGate?: RoleGate;
};

export function isSystemAdminUser(user: SessionUser | undefined): boolean {
  return user?.role === "SYSTEM_ADMIN";
}

export function isClientUser(user: SessionUser | undefined): boolean {
  return user?.role === "CLIENT";
}

/**
 * Nav, `RoleCheck`, and `Can`.
 *
 * - **SYSTEM_ADMIN / CLIENT:** `roleGate` + permission codes (role is mandatory).
 * - **Agency staff:** permission codes only (managers can grant extras via branch roles).
 */
export function userMayAccessResource(
  user: SessionUser | undefined,
  requirement: AccessRequirement,
): boolean {
  if (!user) return false;

  const perms = user.permissions ?? [];
  const codes = requirement.anyPermission;
  const hasCode = (c: string) => perms.includes(c);
  const matchesAnyCode = () =>
    codes.length > 0 && codes.some((c) => hasCode(c));

  if (requirement.roleGate === "SYSTEM_ADMIN") {
    if (user.role !== "SYSTEM_ADMIN") return false;
    return codes.length === 0 || matchesAnyCode();
  }

  if (requirement.roleGate === "CLIENT") {
    if (user.role !== "CLIENT") return false;
    return codes.length === 0 || matchesAnyCode();
  }

  // Agency operations: never grant from job title alone.
  if (user.role === "SYSTEM_ADMIN" || user.role === "CLIENT") {
    return false;
  }

  if (!codes.length || !perms.length) return false;
  return matchesAnyCode();
}

export function userHasPermissionCode(
  user: SessionUser | undefined,
  code: string,
): boolean {
  return userMayAccessResource(user, { anyPermission: [code] });
}
