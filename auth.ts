import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import axios from "axios";
import { authConfig } from "@/lib/auth/config";
import { ApiResponse, LoginResponse } from "@/types";
import { CUSTOMER_AGENCY_SLUG_HEADER } from "@/lib/agency-config";
import { requireAgencySlug } from "@/lib/http/client-app-auth-headers";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL!;

export class StaffAccountOnCustomerPortalError extends Error {
  constructor() {
    super(
      "This account is for agency staff. Please sign in at the operations portal.",
    );
    this.name = "StaffAccountOnCustomerPortalError";
  }
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  trustHost: true,
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        identifier: { label: "Identifier", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const rawPassword = String(credentials?.password ?? "");
        if (!rawPassword.startsWith("otp:")) {
          return null;
        }

        let portalAgencySlug: string;
        try {
          portalAgencySlug = requireAgencySlug();
        } catch {
          console.error("Customer authorize: agency slug not configured");
          return null;
        }

        const payload = {
          identifier: credentials?.identifier,
          code: rawPassword.slice(4),
        };

        try {
          const response = await axios.post<ApiResponse<LoginResponse>>(
            `${BACKEND_URL}/backend/api/v1/client-app/auth/otp/verify`,
            payload,
            {
              headers: {
                [CUSTOMER_AGENCY_SLUG_HEADER]: portalAgencySlug,
              },
            },
          );

          if (!response.data?.success) {
            return null;
          }

          const { user, token } = response.data.data;

          if (user.role !== "CLIENT") {
            throw new StaffAccountOnCustomerPortalError();
          }

          return {
            id: user.id,
            fullName: user.fullName,
            phoneNumber: user.phoneNumber,
            email: user.email,
            role: user.role,
            branchId: user.branchId,
            branchName: user.branchName,
            agencyId: user.agencyId,
            agencyName: user.agencyName,
            agencyLogo: user.agencyLogo,
            avatarUrl: user.avatarUrl ?? null,
            accessToken: token,
            branchRoleId: user.branchRoleId ?? null,
          };
        } catch (error) {
          if (error instanceof StaffAccountOnCustomerPortalError) {
            throw error;
          }
          console.error("Customer authorize error:", error);
          return null;
        }
      },
    }),
  ],
});
