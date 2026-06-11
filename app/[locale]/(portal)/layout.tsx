"use client";

import { MobileShell } from "@/components/mobile/mobile-shell";
import { useSession } from "next-auth/react";
import { SessionUser } from "@/types/auth";
import { useRouter } from "@/lib/navigation";
import { useEffect } from "react";

export default function PortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session, status } = useSession();
  const user = session?.user as SessionUser | undefined;
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.replace("/login");
    }
  }, [status, router]);

  if (status === "loading" || !user) {
    return (
      <div className="flex min-h-dvh items-center justify-center portal-page-bg">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    );
  }

  return <MobileShell>{children}</MobileShell>;
}
