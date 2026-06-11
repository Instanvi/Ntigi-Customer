declare module "next-pwa" {
  import { NextConfig } from "next";

  interface PWAConfig {
    dest?: string;
    register?: boolean;
    skipWaiting?: boolean;
    disable?: boolean;
    sw?: string;
    scope?: string;
    reloadOnOnline?: boolean;
    fallbacks?: {
      document?: string;
      image?: string;
      audio?: string;
      video?: string;
      font?: string;
    };
    cacheOnFrontEndNav?: boolean;
    subdomainPrefix?: string;
    dynamicStartUrl?: boolean;
    dynamicStartUrlRedirect?: string;
    runtimeCaching?: Array<{
      urlPattern: RegExp | string;
      handler:
        | "CacheFirst"
        | "NetworkFirst"
        | "StaleWhileRevalidate"
        | "NetworkOnly"
        | "CacheOnly";
      method?: string;
      options?: {
        cacheName?: string;
        expiration?: {
          maxEntries?: number;
          maxAgeSeconds?: number;
          purgeOnQuotaError?: boolean;
        };
        cacheableResponse?: {
          statuses?: number[];
          headers?: Record<string, string>;
        };
        backgroundSync?: {
          name: string;
          options?: {
            maxRetentionTime?: number;
          };
        };
        broadcastUpdate?: {
          channelName?: string;
        };
        matchOptions?: {
          ignoreSearch?: boolean;
          ignoreMethod?: boolean;
          ignoreVary?: boolean;
        };
        networkTimeoutSeconds?: number;
        plugins?: unknown[];
        fetchOptions?: RequestInit;
        rangeRequests?: boolean;
      };
    }>;
    publicExcludes?: string[];
    buildExcludes?: (string | RegExp)[];
    customWorkerDir?: string;
  }

  export default function withPWA(
    config: PWAConfig,
  ): (nextConfig: NextConfig) => NextConfig;
}
