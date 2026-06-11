import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
export function getErrorMessage(err: unknown): string {
  if (!err) return "Unknown error";
  if (typeof err === "string") return err;
  if (typeof err === "object") {
    if ("error" in err && typeof err.error === "string") return err.error;
    if ("message" in err && typeof err.message === "string") return err.message;
    return JSON.stringify(err);
  }
  return String(err);
}

export function maskIdentifier(str: string): string {
  if (!str) return "";
  if (str.includes("@")) {
    const [local, domain] = str.split("@");
    if (local.length <= 2) return str;
    return `${local[0]}***@${domain}`;
  }
  // Phone masking
  if (str.length > 7) {
    return str.slice(0, 4) + "****" + str.slice(-3);
  }
  return str;
}

