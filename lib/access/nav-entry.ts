import type { ComponentType } from "react";
import type { IconProps } from "@phosphor-icons/react";
import type { SessionUser } from "@/types/auth";
import {
  userMayAccessResource,
  type AccessRequirement,
} from "./resource-access";

export type NavEntry = {
  title: string;
  url: string;
  icon: ComponentType<IconProps>;
  showInMoreHubEvenIfPrimary?: boolean;
} & AccessRequirement;

/** Sidebar / “More” — permissions for agency staff; role + permissions for SA / CLIENT. */
export function userCanAccessNavEntry(
  user: SessionUser | undefined,
  entry: AccessRequirement,
): boolean {
  return userMayAccessResource(user, entry);
}
