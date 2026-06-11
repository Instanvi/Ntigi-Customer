import type { SessionUser } from "@/types/auth";

/**
 * Shipment booking (logistics tab): pin corridor origin to the user’s branch when they are
 * branch-assigned and their JWT does not include `routes.update`.
 *
 * When `permissions` is missing or empty (legacy session), origin is not pinned.
 */
export function shouldPinCorridorOriginToUserBranch(
  user: SessionUser | undefined,
): boolean {
  const branchId = (user?.branchId ?? "").trim();
  if (!branchId) return false;
  const perms = user?.permissions;
  if (!perms?.length) return false;
  return !perms.includes("routes.update");
}
