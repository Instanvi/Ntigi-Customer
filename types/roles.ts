export type UserRole =
  | "SYSTEM_ADMIN"
  | "GENERAL_MANAGER"
  | "MANAGER"
  | "AGENT"
  | "DRIVER"
  | "CUSTOMS_AGENT"
  | "CLIENT";

export const ROLES: Record<UserRole, UserRole> = {
  SYSTEM_ADMIN: "SYSTEM_ADMIN",
  GENERAL_MANAGER: "GENERAL_MANAGER",
  MANAGER: "MANAGER",
  AGENT: "AGENT",
  DRIVER: "DRIVER",
  CUSTOMS_AGENT: "CUSTOMS_AGENT",
  CLIENT: "CLIENT",
};

export const ROLE_LABELS: Record<UserRole, string> = {
  SYSTEM_ADMIN: "System Admin",
  GENERAL_MANAGER: "General Manager",
  MANAGER: "Agency Manager",
  AGENT: "Staff",
  DRIVER: "Driver",
  CUSTOMS_AGENT: "Customs Agent",
  CLIENT: "Client",
};
