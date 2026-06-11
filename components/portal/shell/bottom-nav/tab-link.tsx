"use client";

import { Link } from "@/lib/navigation";
import { cn } from "@/lib/utils";

import type { BottomNavTabState } from "./use-bottom-nav";

type PortalBottomNavTabLinkProps = {
  state: BottomNavTabState;
  className?: string;
  iconSize?: number;
  showLabel?: boolean;
  children?: React.ReactNode;
};

export function PortalBottomNavTabLink({
  state,
  className,
  iconSize = 20,
  showLabel = true,
  children,
}: PortalBottomNavTabLinkProps) {
  const { tab, active, Icon } = state;

  return (
    <Link
      href={tab.href}
      aria-current={active ? "page" : undefined}
      className={cn(
        "relative flex flex-1 flex-col items-center justify-center transition-colors",
        className,
        state.active
          ? "text-[var(--portal-nav-active)]"
          : "text-[var(--portal-nav-inactive)]",
      )}
    >
      {children ?? (
        <>
          <Icon size={iconSize} weight={active ? "fill" : "regular"} />
          {showLabel ? (
            <span className="mt-0.5 text-[11px] font-normal leading-tight text-inherit">
              {tab.label}
            </span>
          ) : null}
        </>
      )}
    </Link>
  );
}
