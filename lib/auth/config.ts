import type { NextAuthConfig } from "next-auth";
import { UserRole } from "@/types/index";
import { SessionUser } from "@/types/auth";

export const authConfig = {
  providers: [],
  cookies: {
    sessionToken: {
      name: "customer-auth.session-token",
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: process.env.NODE_ENV === "production",
      },
    },
  },
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      if (user) {
        const u = user as SessionUser;
        return {
          ...token,
          id: u.id,
          fullName: u.fullName,
          phoneNumber: u.phoneNumber,
          email: u.email,
          role: u.role,
          branchId: u.branchId,
          branchName: u.branchName,
          agencyId: u.agencyId,
          agencyName: u.agencyName,
          agencyLogo: u.agencyLogo,
          avatarUrl: u.avatarUrl ?? null,
          accessToken: u.accessToken,
          branchRoleId: u.branchRoleId ?? null,
        };
      }
      if (trigger === "update" && session && typeof session === "object") {
        const patch = session as Partial<SessionUser>;
        return {
          ...token,
          ...(patch.fullName !== undefined && { fullName: patch.fullName }),
          ...(patch.phoneNumber !== undefined && {
            phoneNumber: patch.phoneNumber,
          }),
          ...(patch.email !== undefined && { email: patch.email }),
          ...(patch.avatarUrl !== undefined && { avatarUrl: patch.avatarUrl }),
        };
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user = {
          ...session.user,
          id: token.id as string,
          fullName: token.fullName as string,
          phoneNumber: token.phoneNumber as string,
          role: token.role as UserRole,
          branchId: token.branchId as string | null,
          branchName: token.branchName as string | null,
          agencyId: token.agencyId as string | null,
          agencyName: token.agencyName as string | null,
          agencyLogo: token.agencyLogo as string | null | undefined,
          avatarUrl: (token.avatarUrl as string | null | undefined) ?? null,
          accessToken: token.accessToken as string | undefined,
          branchRoleId:
            (token.branchRoleId as string | null | undefined) ?? null,
        };
      }
      return session;
    },
  },
  session: { strategy: "jwt" },
  pages: {
    signIn: "/login",
  },
} satisfies NextAuthConfig;
