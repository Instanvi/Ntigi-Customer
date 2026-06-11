import type { SessionUser } from "@/types/auth";

/** True if JWT lists any of `codes`. Empty permissions → false (explicit denial unless caller handles legacy). */
export function userHasAnyPermission(
  user: SessionUser | undefined,
  codes: readonly string[],
): boolean {
  if (!user?.permissions?.length || !codes.length) return false;
  return codes.some((c) => user.permissions!.includes(c));
}

/** Raw permission array checks (e.g. dashboard widgets) — optional allow-when-missing for legacy tokens. */
export function canQueryByPermission(
  permissions: readonly string[] | undefined,
  required: readonly string[],
  options?: { allowWhenMissing?: boolean },
): boolean {
  if (!permissions?.length) return options?.allowWhenMissing ?? false;
  return required.some((code) => permissions.includes(code));
}
