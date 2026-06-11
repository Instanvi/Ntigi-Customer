/** Row from `GET /permissions/catalog` */
export interface PermissionCatalogRow {
  id: string;
  code: string;
  name: string;
  description: string | null;
  category: string;
}

/** Row from `GET /branches/:branchId/permission-sets` */
export interface BranchPermissionSetSummary {
  id: string;
  branchId: string;
  name: string;
  description: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface BranchPermissionSetDetail extends BranchPermissionSetSummary {
  permissionLinks: { permission: PermissionCatalogRow }[];
}
