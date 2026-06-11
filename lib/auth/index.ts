import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { authConfig } from "./config";
import axios from "axios";
import { ApiResponse, LoginResponse } from "@/types";

const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:3001";

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  trustHost: true,
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        phoneNumber: { label: "Phone Number", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.phoneNumber || !credentials?.password) return null;

        try {
          const response = await axios.post<ApiResponse<LoginResponse>>(
            `${BACKEND_URL}/api/auth/login`,
            {
              phoneNumber: credentials.phoneNumber,
              password: credentials.password,
            },
          );

          if (response.data && response.data.success) {
            const { user, token } = response.data.data;
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
            };
          }
          return null;
        } catch (error) {
          console.error("Auth error:", error);
          return null;
        }
      },
    }),
  ],
});
