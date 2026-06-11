"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useRouter } from "@/lib/navigation";

const STORED_IDENTIFIER_KEY = "customer_login_identifier";

/** OTP entry lives on /login; preserve identifier from old bookmarks. */
export default function LoginVerifyPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const identifier =
      searchParams.get("identifier") ||
      searchParams.get("loginId") ||
      searchParams.get("phone");
    if (identifier?.trim()) {
      sessionStorage.setItem(STORED_IDENTIFIER_KEY, identifier.trim());
    }
    router.replace("/login");
  }, [router, searchParams]);

  return null;
}
