import type { UserRole } from "@/types/roles";

/** Platform operator (role + `system.*` permissions). */
export function isSystemAdminRole(role: UserRole | string | undefined): boolean {
  return role === "SYSTEM_ADMIN";
}

/** Agency general manager (broad agency permissions, not platform admin). */
export function isGeneralManagerRole(role: UserRole | string | undefined): boolean {
  return role === "GENERAL_MANAGER";
}

/** Client portal account. */
export function isClientRole(role: UserRole | string | undefined): boolean {
  return role === "CLIENT";
}

/**
 * Legacy UX helpers (e.g. GM shipment restrictions in CASL).
 * Nav/page access uses JWT permissions; SA and CLIENT also use {@link RoleGate}.
 */
export function isPrivilegeRole(role: UserRole | string | undefined): boolean {
  return isSystemAdminRole(role) || isGeneralManagerRole(role);
}
