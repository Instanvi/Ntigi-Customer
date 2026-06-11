"use client";

import { useEffect } from "react";
import { useRouter } from "@/lib/navigation";

/** Customer portal auth is OTP-only; legacy staff password routes redirect here. */
export function RedirectToLogin() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/login");
  }, [router]);

  return null;
}
