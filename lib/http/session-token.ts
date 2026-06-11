/** In-memory cache for the backend JWT — avoids `getSession()` on every API request. */
let cachedAccessToken: string | null = null;

export function getCachedAccessToken(): string | null {
  return cachedAccessToken;
}

export function setCachedAccessToken(token: string | null | undefined): void {
  cachedAccessToken = token?.trim() ? token : null;
}
