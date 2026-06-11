"use client";

import { cn } from "@/lib/utils";

export function PortalPage({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("portal-page-bg min-h-full flex-1", className)}>
      {children}
    </div>
  );
}
