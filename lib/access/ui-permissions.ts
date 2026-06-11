import type { AccessRequirement } from "./resource-access";

const systemAdmin = (
  anyPermission: readonly string[],
): AccessRequirement => ({
  roleGate: "SYSTEM_ADMIN",
  anyPermission,
});

const clientPortal = (
  anyPermission: readonly string[],
): AccessRequirement => ({
  roleGate: "CLIENT",
  anyPermission,
});

/**
 * UI gates aligned with `permission-catalog` modules.
 * Agency staff: permissions only. SYSTEM_ADMIN / CLIENT: role + permissions.
 */
export const UI_ACCESS = {
  systemAdminRead: systemAdmin(["system.admin.read"]),
  systemAdminWrite: systemAdmin([
    "system.admin.create",
    "system.admin.update",
  ]),
  systemAgenciesRead: systemAdmin(["system.agencies.read"]),
  systemAgenciesManage: systemAdmin([
    "system.agencies.create",
    "system.agencies.update",
  ]),
  systemUsersManage: systemAdmin([
    "system.users.create",
    "system.users.update",
  ]),
  systemSubscriptionsRead: systemAdmin(["system.subscriptions.read"]),
  systemSubscriptionsManage: systemAdmin([
    "system.subscriptions.create",
    "system.subscriptions.update",
  ]),
  systemStatsRead: systemAdmin(["system.stats.read"]),

  clientPortal: clientPortal([
    "dashboard.read",
    "shipments.read",
    "clients.read",
    "clients.update",
    "documents.read",
    "payments.read",
    "receipts.read",
    "notifications.read",
  ]),
  clientShipmentsRead: clientPortal(["shipments.read"]),
  clientProfileRead: clientPortal(["clients.read", "clients.update"]),

  dashboardRead: { anyPermission: ["dashboard.read"] },
  settingsRead: {
    anyPermission: ["settings.read", "configuration.read"],
  },

  shipmentsRead: { anyPermission: ["shipments.read"] },
  shipmentsCreate: {
    anyPermission: ["shipments.create", "shipments.update"],
  },
  shipmentsUpdate: { anyPermission: ["shipments.update"] },
  shipmentsDelete: {
    anyPermission: ["shipments.delete", "shipments.update"],
  },

  clientsRead: { anyPermission: ["clients.read"] },
  clientsCreate: {
    anyPermission: ["clients.create", "clients.update"],
  },
  clientsDelete: {
    anyPermission: ["clients.delete", "clients.update"],
  },

  /** Configuration hub + catalog screens (GM has full `configuration.*`). */
  configurationRead: { anyPermission: ["configuration.read"] },
  configurationCreate: {
    anyPermission: ["configuration.create", "configuration.update"],
  },
  configurationUpdate: {
    anyPermission: ["configuration.update", "configuration.create"],
  },
  configurationDelete: {
    anyPermission: ["configuration.delete", "configuration.update"],
  },

  branchesCreate: { anyPermission: ["branches.create"] },
  stopsCreate: { anyPermission: ["stops.create"] },

  rbacManage: { anyPermission: ["rbac.read", "rbac.update"] },
  rbacRead: { anyPermission: ["rbac.read"] },
  staffRead: { anyPermission: ["staff.read", "staff.update"] },

  financeRead: {
    anyPermission: ["receipts.read", "payments.read", "finance.read"],
  },

  notificationsRead: { anyPermission: ["notifications.read"] },

  vehiclesRead: { anyPermission: ["vehicles.read"] },
  vehiclesManage: {
    anyPermission: ["vehicles.create", "vehicles.update"],
  },
  trackersRead: { anyPermission: ["trackers.read"] },

  consolidationsRead: { anyPermission: ["consolidations.read"] },
  consolidationsCreate: {
    anyPermission: ["consolidations.create", "consolidations.update"],
  },

  manifestsRead: { anyPermission: ["manifests.read"] },
  manifestsCreate: {
    anyPermission: ["manifests.create", "manifests.update"],
  },

  routesRead: { anyPermission: ["routes.read"] },
  routesCreate: {
    anyPermission: ["routes.create", "routes.update"],
  },

  networkRead: { anyPermission: ["network.read"] },
  documentsRead: { anyPermission: ["documents.read"] },
  whatsappRead: {
    anyPermission: ["whatsapp.read", "configuration.read"],
  },
  warehouseRead: {
    anyPermission: ["warehouse.read", "shipments.read", "shipments.update"],
  },
  processTemplatesRead: {
    anyPermission: ["process-templates.read", "configuration.read"],
  },
  validationRead: { anyPermission: ["validation.read", "validation.validate"] },

  statsRead: { anyPermission: ["stats.read"] },
  /** Agency subscription / waybill usage (not platform `system.subscriptions`). */
  subscriptionsRead: { anyPermission: ["subscriptions.read"] },
} as const satisfies Record<string, AccessRequirement>;
