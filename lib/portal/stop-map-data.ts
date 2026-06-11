import type { Stop } from "@/types";

function parsePair(
  lat: string | number | null | undefined,
  lng: string | number | null | undefined,
): { lat: number; lng: number } | null {
  if (lat == null || lng == null || lat === "" || lng === "") return null;
  const la = typeof lat === "number" ? lat : parseFloat(String(lat));
  const ln = typeof lng === "number" ? lng : parseFloat(String(lng));
  if (!Number.isFinite(la) || !Number.isFinite(ln)) return null;
  return { lat: la, lng: ln };
}

export function resolveStopCoordinates(
  stop: Stop,
): { lat: number; lng: number } | null {
  const direct = parsePair(stop.latitude, stop.longitude);
  if (direct) return direct;
  const addrs = stop.addresses ?? [];
  const addr = addrs.find((a) => a.isDefault) ?? addrs[0];
  if (!addr) return null;
  return parsePair(addr.latitude, addr.longitude);
}

export function formatStopAddress(stop: Stop): string | null {
  const addrs = stop.addresses ?? [];
  const addr = addrs.find((a) => a.isDefault) ?? addrs[0];
  if (addr?.address?.trim()) return addr.address.trim();
  const parts = [addr?.city, stop.city, stop.country].filter(
    (p): p is string => Boolean(p?.trim()),
  );
  return parts.length > 0 ? parts.join(", ") : null;
}

export function formatStopPhone(stop: Stop): string | null {
  const phone = stop.phoneNumber?.trim();
  if (phone) return phone;
  const addrs = stop.addresses ?? [];
  const addr = addrs.find((a) => a.isDefault) ?? addrs[0];
  return addr?.phoneNumber?.trim() || null;
}

export function collectStopGeocodePlaces(stops: Stop[]): {
  key: string;
  q: string;
  cc: string;
}[] {
  const seen = new Set<string>();
  const rows: { key: string; q: string; cc: string }[] = [];

  for (const s of stops) {
    if (resolveStopCoordinates(s)) continue;
    const q = s.city?.trim() || s.name?.trim() || "";
    if (q.length < 3) continue;
    const cc = (s.countryCode?.trim() || "").toUpperCase();
    const key = `${cc}|${q.toLowerCase()}`;
    if (seen.has(key)) continue;
    seen.add(key);
    rows.push({ key, q, cc });
  }

  return rows;
}

export type BranchMapPin = {
  id: string;
  lat: number;
  lng: number;
  name: string;
  stopType: string;
  address: string | null;
  phone: string | null;
  isUserBranch?: boolean;
};

export function stopsToMapPins(
  stops: Stop[],
  options?: { highlightStopId?: string | null },
): BranchMapPin[] {
  const highlight = options?.highlightStopId?.trim() || null;
  const out: BranchMapPin[] = [];

  for (const s of stops) {
    const c = resolveStopCoordinates(s);
    if (!c) continue;
    out.push({
      id: `stop-${s.id}`,
      lat: c.lat,
      lng: c.lng,
      name: s.name,
      stopType: s.stopType ?? "BRANCH",
      address: formatStopAddress(s),
      phone: formatStopPhone(s),
      isUserBranch: highlight !== null && s.id === highlight,
    });
  }

  return out;
}

export function geocodedStopToPin(
  stop: Stop,
  pos: [number, number],
  highlightStopId?: string | null,
): BranchMapPin {
  return {
    id: `stop-${stop.id}`,
    lat: pos[0],
    lng: pos[1],
    name: stop.name,
    stopType: stop.stopType ?? "BRANCH",
    address: formatStopAddress(stop),
    phone: formatStopPhone(stop),
    isUserBranch: Boolean(highlightStopId && stop.id === highlightStopId),
  };
}
