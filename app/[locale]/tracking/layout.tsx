"use client";

import { MobileShell } from "@/components/mobile/mobile-shell";

export default function TrackingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <MobileShell hideNav={false}>{children}</MobileShell>;
}
