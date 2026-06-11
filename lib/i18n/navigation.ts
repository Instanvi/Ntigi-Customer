import { createNavigation } from "next-intl/navigation";
import { routing } from "@/i18n/routing";

export { routing };

export const { Link, redirect, usePathname, useRouter, getPathname } =
  createNavigation(routing);
