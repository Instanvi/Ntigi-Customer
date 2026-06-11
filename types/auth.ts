import { UserRole } from "@/types/index";
import { type DefaultSession } from "next-auth";
import "next-auth/jwt";

export interface SessionUser {
  id: string;
  fullName: string;
  phoneNumber: string;
  email?: string | null;
  role: UserRole;
  branchId: string | null;
  branchName: string | null;
  agencyId: string | null;
  agencyName: string | null;
  agencyLogo?: string | null;
  avatarUrl?: string | null;
  accessToken?: string;
  branchRoleId?: string | null;
  permissions?: string[];
}

declare module "next-auth" {
  interface User extends SessionUser {
    /** Forced non-empty for lint */
    id: string;
  }

  interface Session extends DefaultSession {
    user: SessionUser & {
      id: string;
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT extends SessionUser {
    /** Forced non-empty for lint */
    id: string;
  }
}

// declare module "@auth/core/adapters" {
//   interface AdapterUser extends SessionUser {
//     /** Forced non-empty for lint */
//     id: string;
//   }
// }
