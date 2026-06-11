export const CRUD_ACTIONS = [
  "create",
  "read",
  "update",
  "delete",
  "validate",
] as const;

export type CrudAction = (typeof CRUD_ACTIONS)[number];

export const FRONTEND_MODULES = [
  { id: "dashboard", label: "Dashboard" },
  { id: "shipments", label: "Shipments" },
  { id: "consolidations", label: "Consolidations" },
  { id: "manifests", label: "Manifests" },
  { id: "documents", label: "Documents" },
  { id: "clients", label: "Clients" },
  { id: "network", label: "Network" },
  { id: "routes", label: "Routes & pricing" },
  { id: "configuration", label: "Configuration" },
  { id: "branches", label: "Branches" },
  { id: "stops", label: "Stops & facilities" },
  { id: "agencies", label: "Agencies" },
  { id: "whatsapp", label: "WhatsApp" },
  { id: "finance", label: "Finance" },
  { id: "process-templates", label: "Process Templates" },
  { id: "staff", label: "Staff" },
  { id: "rbac", label: "Roles & access" },
  { id: "warehouse", label: "Warehouse" },
  { id: "payments", label: "Payments" },
  { id: "stats", label: "Statistics" },
  { id: "vehicles", label: "Vehicles" },
  { id: "trackers", label: "Trackers" },
  { id: "subscriptions", label: "Subscriptions" },
  { id: "settings", label: "Settings" },
  { id: "receipts", label: "Receipts" },
  { id: "notifications", label: "Notifications" },
  { id: "validation", label: "Validation" },
  { id: "admin", label: "Platform admin" },
] as const;

/**
 * Branch roles may grant almost all module permissions. Only agency-wide /
 * platform setup is withheld (GM / SYSTEM_ADMIN defaults). Keep in sync with backend.
 */
export const BRANCH_NON_ASSIGNABLE_MODULE_IDS = [
  "admin",
  "agencies",
  "subscriptions",
  "branches",
  "settings",
] as const;

/** Individual codes withheld even when their module is otherwise branch-assignable. */
export const BRANCH_EXCLUDED_PERMISSION_CODES = [] as const;

const BRANCH_NON_ASSIGNABLE_SET = new Set<string>(
  BRANCH_NON_ASSIGNABLE_MODULE_IDS
);
const BRANCH_EXCLUDED_SET = new Set<string>(BRANCH_EXCLUDED_PERMISSION_CODES);

export const SYSTEM_PLATFORM_MODULES = [
  "admin",
  "agencies",
  "subscriptions",
  "users",
  "stats",
] as const;

export function moduleIdFromPermissionCode(code: string): string {
  return code.split(".")[0] ?? code;
}

export function isBranchAssignablePermissionCode(code: string): boolean {
  if (code.startsWith("system.") || code.startsWith("admin.")) return false;
  if (BRANCH_EXCLUDED_SET.has(code)) return false;
  const mod = moduleIdFromPermissionCode(code);
  return !BRANCH_NON_ASSIGNABLE_SET.has(mod);
}

export function filterBranchAssignablePermissionCodes(
  codes: Iterable<string>
): string[] {
  return [...new Set([...codes].filter(isBranchAssignablePermissionCode))];
}

export function systemAdminPermissionCodes(): readonly string[] {
  return SYSTEM_PLATFORM_MODULES.flatMap(mod =>
    CRUD_ACTIONS.map(action => `system.${mod}.${action}`)
  );
}

export function allPermissionCodes(): string[] {
  const codes: string[] = [];
  for (const mod of FRONTEND_MODULES) {
    for (const action of CRUD_ACTIONS) {
      codes.push(`${mod.id}.${action}`);
    }
  }
  return codes;
}

export function branchPermissionCodes(): string[] {
  return allPermissionCodes().filter(isBranchAssignablePermissionCode);
}

/** Modules shown in the branch permission matrix (catalog order). */
export const BRANCH_MODULE_ORDER: readonly string[] = FRONTEND_MODULES.map(
  m => m.id
).filter(id => !BRANCH_NON_ASSIGNABLE_SET.has(id));

export const BRANCH_ASSIGNABLE_MODULE_IDS: readonly string[] =
  BRANCH_MODULE_ORDER;
