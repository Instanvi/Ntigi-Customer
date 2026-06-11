import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { UserRole } from "@/types/index";

export const validateRequest = async () => {
  const session = await auth();
  return {
    user: session?.user ?? null,
    session: session,
  };
};

export async function checkRole(allowedRoles: UserRole[]) {
  const session = await auth();
  const user = session?.user;

  if (!user) {
    return redirect("/login");
  }

  if (!allowedRoles.includes(user.role as UserRole)) {
    return redirect("/unauthorized");
  }

  return user;
}
