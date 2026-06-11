"use client";

import * as React from "react";
import L from "leaflet";
import {
  MapContainer,
  Marker,
  Popup,
  TileLayer,
  useMap,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import type { BranchMapPin } from "@/lib/portal/stop-map-data";

if (typeof window !== "undefined") {
  // @ts-expect-error - Internal Leaflet property
  delete L.Icon.Default.prototype._getIconUrl;
  L.Icon.Default.mergeOptions({
    iconRetinaUrl:
      "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
    iconUrl:
      "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
    shadowUrl:
      "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
  });
}

const DEFAULT_CENTER: [number, number] = [4.15, 11.52];
const DEFAULT_ZOOM = 6;

const STOP_SVG: Record<string, string> = {
  BRANCH: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z"/><path d="M6 12h4"/><path d="M6 16h4"/><path d="M10 12h4"/><path d="M10 16h4"/><path d="M14 12h4"/><path d="M14 16h4"/></svg>`,
  AIRPORT: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z"/></svg>`,
  SEAPORT: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="5" r="3"/><path d="M12 22V8"/><path d="M5 12H2a10 10 0 0 0 20 0h-3"/></svg>`,
  WAREHOUSE: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><path d="M3.27 6.96 12 12.01l8.73-5.05"/><path d="M12 22.08V12"/></svg>`,
  STOP: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>`,
};

const STOP_COLOR: Record<string, string> = {
  BRANCH: "#263070",
  AIRPORT: "#0369a1",
  SEAPORT: "#0f766e",
  WAREHOUSE: "#b45309",
  STOP: "#64748b",
};

const branchIconCache = new Map<string, L.DivIcon>();

function branchMarkerIcon(stopType: string, isUserBranch: boolean): L.DivIcon {
  const st = (stopType || "BRANCH").toUpperCase();
  const key = `${st}:${isUserBranch ? 1 : 0}`;
  const cached = branchIconCache.get(key);
  if (cached) return cached;

  const color = STOP_COLOR[st] ?? STOP_COLOR.BRANCH;
  const svg = STOP_SVG[st] ?? STOP_SVG.BRANCH;
  const ring = isUserBranch
    ? "box-shadow:0 0 0 3px #f59e0c,0 4px 14px rgba(38,48,112,0.35);"
    : "box-shadow:0 4px 14px rgba(38,48,112,0.25);";
  const html = `<div style="width:36px;height:36px;border-radius:10px;background:#fff;display:flex;align-items:center;justify-content:center;color:${color};${ring}">${svg}</div>`;

  const icon = new L.DivIcon({
    html,
    className: "leaflet-div-icon ntigi-map-pin",
    iconSize: [36, 36],
    iconAnchor: [18, 36],
    popupAnchor: [0, -32],
  });
  branchIconCache.set(key, icon);
  return icon;
}

function stopTypeLabel(stopType: string): string {
  const st = (stopType || "BRANCH").toUpperCase();
  if (st === "BRANCH") return "Branch";
  return st.charAt(0) + st.slice(1).toLowerCase();
}

function FitMapToPins({ pins }: { pins: BranchMapPin[] }) {
  const map = useMap();

  React.useEffect(() => {
    if (pins.length === 0) {
      map.setView(DEFAULT_CENTER, DEFAULT_ZOOM);
      return;
    }
    const points = pins.map((p) => [p.lat, p.lng] as [number, number]);
    if (points.length === 1) {
      map.setView(points[0], 13);
      return;
    }
    map.fitBounds(L.latLngBounds(points), { padding: [48, 48], maxZoom: 12 });
  }, [pins, map]);

  return null;
}

function MapResize() {
  const map = useMap();
  React.useEffect(() => {
    const timers: number[] = [];
    const run = () => {
      try {
        map.invalidateSize();
      } catch {
        /* ignore */
      }
    };
    map.whenReady(() => {
      run();
      for (const ms of [90, 220, 500]) {
        timers.push(window.setTimeout(run, ms));
      }
    });
    window.addEventListener("resize", run);
    return () => {
      timers.forEach((t) => window.clearTimeout(t));
      window.removeEventListener("resize", run);
    };
  }, [map]);
  return null;
}

export function BranchLocationsMap({
  pins,
  className,
}: {
  pins: BranchMapPin[];
  className?: string;
}) {
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    const id = window.requestAnimationFrame(() => setMounted(true));
    return () => window.cancelAnimationFrame(id);
  }, []);

  if (!mounted) {
    return (
      <div
        className={className}
        style={{ background: "#DDE7F0" }}
        aria-hidden
      />
    );
  }

  return (
    <div className={className}>
      <MapContainer
        center={DEFAULT_CENTER}
        zoom={DEFAULT_ZOOM}
        minZoom={2}
        className="h-full w-full"
        style={{ background: "#DDE7F0" }}
        zoomControl
        scrollWheelZoom
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <MapResize />
        <FitMapToPins pins={pins} />
        {pins.map((pin) => (
          <Marker
            key={pin.id}
            position={[pin.lat, pin.lng]}
            icon={branchMarkerIcon(pin.stopType, Boolean(pin.isUserBranch))}
          >
            <Popup>
              <div className="space-y-1 text-sm">
                <p className="font-normal text-[#263070]">{pin.name}</p>
                <p className="text-[10px] text-slate-500">
                  {stopTypeLabel(pin.stopType)}
                  {pin.isUserBranch ? " · Your branch" : ""}
                </p>
                {pin.address ? (
                  <p className="text-slate-600">{pin.address}</p>
                ) : null}
                {pin.phone ? (
                  <a
                    href={`tel:${pin.phone.replace(/\s/g, "")}`}
                    className="block font-normal text-primary"
                  >
                    {pin.phone}
                  </a>
                ) : null}
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
