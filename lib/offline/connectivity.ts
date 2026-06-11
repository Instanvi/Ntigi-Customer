"use client";

let _isReallyOnline =
  typeof navigator !== "undefined" ? navigator.onLine : true;
type Listener = () => void;
const listeners = new Set<Listener>();

export async function probeConnectivity(): Promise<boolean> {
  if (typeof navigator !== "undefined") {
    _setOnline(navigator.onLine);
  }
  return _isReallyOnline;
}

export function isOnline(): boolean {
  if (typeof navigator !== "undefined") {
    return navigator.onLine;
  }
  return _isReallyOnline;
}

export function subscribe(fn: Listener): () => void {
  listeners.add(fn);
  return () => {
    listeners.delete(fn);
  };
}

function _setOnline(value: boolean): void {
  if (value !== _isReallyOnline) {
    _isReallyOnline = value;
    listeners.forEach((l) => l());
  }
}

if (typeof window !== "undefined") {
  const handleChange = () => _setOnline(navigator.onLine);
  window.addEventListener("online", handleChange);
  window.addEventListener("offline", handleChange);
}
