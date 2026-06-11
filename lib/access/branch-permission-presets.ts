import {
  type CrudAction,
  branchPermissionCodes,
  isBranchAssignablePermissionCode,
  moduleIdFromPermissionCode,
} from "./permission-catalog";

/** Day-to-day branch work without destructive delete. */
export const BRANCH_OPERATIONS_ACTIONS: readonly CrudAction[] = [
  "read",
  "create",
  "update",
  "validate",
] as const;

export type BranchPermissionPresetId =
  | "full_branch"
  | "branch_operations"
  | "desk_agent"
  | "warehouse"
  | "supervisor"
  | "read_only";

export type BranchPermissionPreset = {
  id: BranchPermissionPresetId;
  label: string;
  description: string;
};

export const BRANCH_PERMISSION_PRESETS: readonly BranchPermissionPreset[] = [
  {
    id: "branch_operations",
    label: "Branch operations (recommended)",
    description:
      "Create, view, update, and validate across all branch modules — typical for agents and supervisors.",
  },
  {
    id: "full_branch",
    label: "Full branch access",
    description: "All branch permissions including delete (use sparingly).",
  },
  {
    id: "supervisor",
    label: "Branch supervisor",
    description:
      "Operations plus limited delete on shipments, manifests, clients, and payments.",
  },
  {
    id: "desk_agent",
    label: "Desk / counter agent",
    description:
      "Shipments, manifests, consolidations, clients, payments, and related ops — no delete.",
  },
  {
    id: "warehouse",
    label: "Warehouse operator",
    description: "Warehouse, shipments, manifests, consolidations, and validation.",
  },
  {
    id: "read_only",
    label: "View only",
    description: "Read access on all branch modules.",
  },
] as const;

const DESK_AGENT_MODULES = new Set([
  "dashboard",
  "shipments",
  "consolidations",
  "manifests",
  "documents",
  "clients",
  "network",
  "routes",
  "payments",
  "receipts",
  "notifications",
  "validation",
  "whatsapp",
  "warehouse",
]);

const WAREHOUSE_MODULES = new Set([
  "warehouse",
  "shipments",
  "consolidations",
  "manifests",
  "documents",
  "validation",
]);

const SUPERVISOR_DELETE_MODULES = new Set([
  "shipments",
  "clients",
  "documents",
  "manifests",
  "consolidations",
  "payments",
  "warehouse",
]);

function actionFromCode(code: string): CrudAction | null {
  const act = code.split(".")[1];
  if (!act) return null;
  return (BRANCH_OPERATIONS_ACTIONS as readonly string[]).includes(act) ||
    act === "delete"
    ? (act as CrudAction)
    : null;
}

function filterCodes(
  pool: readonly string[],
  predicate: (moduleId: string, action: CrudAction) => boolean,
): string[] {
  const out: string[] = [];
  for (const code of pool) {
    if (!isBranchAssignablePermissionCode(code)) continue;
    const action = actionFromCode(code);
    if (!action) continue;
    const moduleId = moduleIdFromPermissionCode(code);
    if (predicate(moduleId, action)) out.push(code);
  }
  return out;
}

/** Build a preset from the live catalog or the static module×action grid. */
export function branchPermissionPresetCodes(
  presetId: BranchPermissionPresetId,
  catalogCodes?: Iterable<string>,
): string[] {
  const pool = catalogCodes
    ? [...catalogCodes].filter(isBranchAssignablePermissionCode)
    : branchPermissionCodes();

  switch (presetId) {
    case "full_branch":
      return [...pool];
    case "branch_operations":
      return filterCodes(pool, (_, action) =>
        (BRANCH_OPERATIONS_ACTIONS as readonly string[]).includes(action),
      );
    case "read_only":
      return filterCodes(pool, (_, action) => action === "read");
    case "desk_agent":
      return filterCodes(
        pool,
        (mod, action) =>
          DESK_AGENT_MODULES.has(mod) &&
          (BRANCH_OPERATIONS_ACTIONS as readonly string[]).includes(action),
      );
    case "warehouse":
      return filterCodes(
        pool,
        (mod, action) =>
          WAREHOUSE_MODULES.has(mod) &&
          (BRANCH_OPERATIONS_ACTIONS as readonly string[]).includes(action),
      );
    case "supervisor":
      return filterCodes(pool, (mod, action) => {
        if ((BRANCH_OPERATIONS_ACTIONS as readonly string[]).includes(action)) {
          return true;
        }
        return action === "delete" && SUPERVISOR_DELETE_MODULES.has(mod);
      });
    default:
      return [];
  }
}

/** Per-module shortcuts in the permission matrix. */
export type ModulePermissionShortcut = "all" | "operate" | "view" | "clear";

export function moduleShortcutCodes(
  moduleId: string,
  shortcut: ModulePermissionShortcut,
  catalogCodes: Iterable<string>,
): string[] {
  const moduleCodes = [...catalogCodes].filter(
    (c) => moduleIdFromPermissionCode(c) === moduleId,
  );
  switch (shortcut) {
    case "all":
      return moduleCodes;
    case "operate":
      return moduleCodes.filter((c) => {
        const action = actionFromCode(c);
        return (
          action != null &&
          (BRANCH_OPERATIONS_ACTIONS as readonly string[]).includes(action)
        );
      });
    case "view":
      return moduleCodes.filter((c) => actionFromCode(c) === "read");
    case "clear":
      return [];
  }
}
