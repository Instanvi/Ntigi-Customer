/**
 * Access control helpers: privileges, JWT permission codes, nav visibility, shipment UX rules.
 * Import from `@/lib/access` instead of scattered `@/lib/rbac` / `@/utils/permissions`.
 */

export {
  isPrivilegeRole,
  isSystemAdminRole,
  isGeneralManagerRole,
  isClientRole,
} from "./privilege";
export { userHasAnyPermission, canQueryByPermission } from "./permissions";
export { userCanAccessNavEntry } from "./nav-entry";
export {
  userMayAccessResource,
  userHasPermissionCode,
  isSystemAdminUser,
  isClientUser,
  type AccessRequirement,
  type RoleGate,
} from "./resource-access";
export type { NavEntry } from "./nav-entry";
export { UI_ACCESS } from "./ui-permissions";
export {
  systemAdminPermissionCodes,
  branchPermissionCodes,
  BRANCH_ASSIGNABLE_MODULE_IDS,
  BRANCH_NON_ASSIGNABLE_MODULE_IDS,
  BRANCH_EXCLUDED_PERMISSION_CODES,
  BRANCH_MODULE_ORDER,
  filterBranchAssignablePermissionCodes,
  isBranchAssignablePermissionCode,
  SYSTEM_PLATFORM_MODULES,
} from "./permission-catalog";
export { shouldPinCorridorOriginToUserBranch } from "./shipment-corridor";
export {
  BRANCH_OPERATIONS_ACTIONS,
  BRANCH_PERMISSION_PRESETS,
  branchPermissionPresetCodes,
  moduleShortcutCodes,
  type BranchPermissionPresetId,
  type ModulePermissionShortcut,
} from "./branch-permission-presets";
