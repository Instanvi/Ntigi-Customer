import { writeFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { config as loadEnv } from "dotenv";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, "..");

loadEnv({ path: resolve(root, ".env.local") });
loadEnv({ path: resolve(root, ".env") });

const appName = process.env.NEXT_PUBLIC_APP_NAME?.trim() || "First Cargo";
const themeColor = process.env.NEXT_PUBLIC_BRAND_PRIMARY?.trim() || "#263070";
const slug = process.env.NEXT_PUBLIC_AGENCY_SLUG?.trim() || "first-cargo";

const manifest = {
  name: appName,
  short_name: appName.length > 12 ? appName.slice(0, 12) : appName,
  description: `${appName} — track and manage your shipments`,
  start_url: "/en/dashboard",
  scope: "/",
  display: "standalone",
  background_color: "#ffffff",
  theme_color: themeColor,
  orientation: "portrait-primary",
  icons: [
    {
      src: "/icons/icon-192x192.svg",
      sizes: "192x192",
      type: "image/svg+xml",
      purpose: "maskable any",
    },
    {
      src: "/icons/icon-512x512.svg",
      sizes: "512x512",
      type: "image/svg+xml",
      purpose: "maskable any",
    },
  ],
  shortcuts: [
    {
      name: "Track shipment",
      short_name: "Track",
      url: "/en/dashboard/track",
      icons: [
        {
          src: "/icons/icon-96x96.svg",
          sizes: "96x96",
          type: "image/svg+xml",
        },
      ],
    },
    {
      name: "My shipments",
      short_name: "Home",
      url: "/en/dashboard",
      icons: [
        {
          src: "/icons/icon-96x96.svg",
          sizes: "96x96",
          type: "image/svg+xml",
        },
      ],
    },
  ],
  id: `customer-portal-${slug}`,
};

writeFileSync(
  resolve(root, "public/manifest.json"),
  JSON.stringify(manifest, null, 2),
);
console.log(`Generated PWA manifest for ${appName} (${slug})`);
