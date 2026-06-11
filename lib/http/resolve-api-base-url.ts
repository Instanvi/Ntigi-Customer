/**
 * Resolves the REST API base URL for browser and server calls.
 * Relative paths (e.g. `/backend/api/v1`) are joined with `NEXT_PUBLIC_BACKEND_URL`
 * so local dev does not hit the Next.js server and return HTML 404 pages.
 */
export function resolveApiBaseUrl(): string {
  const configured =
    process.env.NEXT_PUBLIC_API_URL?.trim() || "/backend/api/v1";

  if (/^https?:\/\//i.test(configured)) {
    return configured.replace(/\/$/, "");
  }

  const backend = (
    process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3001"
  ).replace(/\/$/, "");
  const path = configured.startsWith("/") ? configured : `/${configured}`;
  return `${backend}${path}`;
}
