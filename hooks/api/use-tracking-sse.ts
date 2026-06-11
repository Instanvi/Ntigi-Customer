"use client";

import { useEffect, useRef, useState } from "react";
import { useSession } from "@/hooks/use-session";

const BACKEND_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3001";

export interface LocationUpdate {
  vehicleId: string;
  latitude: number;
  longitude: number;
  consolidationId?: string;
  timestamp: Date;
}

export function useVehicleTracking(vehicleId: string | null) {
  const { user } = useSession();
  const [location, setLocation] = useState<LocationUpdate | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const eventSourceRef = useRef<EventSource | null>(null);

  useEffect(() => {
    if (!vehicleId || !user?.accessToken) {
      setLocation(null);
      setIsConnected(false);
      return;
    }

    let reconnectTimeout: NodeJS.Timeout;
    let reconnectAttempts = 0;
    const maxReconnectAttempts = 5;

    const connect = () => {
      try {
        if (eventSourceRef.current) {
          eventSourceRef.current.close();
        }

        // Connect directly to the backend SSE endpoint with token as query param
        const url = new URL(
          `${BACKEND_URL}/backend/api/v1/sse/tracking/${vehicleId}`,
        );
        url.searchParams.set("token", user.accessToken as string);

        const eventSource = new EventSource(url.toString());
        eventSourceRef.current = eventSource;

        eventSource.onopen = () => {
          console.log(`[SSE] Connected to vehicle ${vehicleId}`);
          setIsConnected(true);
          setError(null);
          reconnectAttempts = 0;
        };

        eventSource.onmessage = (event) => {
          try {
            const data = JSON.parse(event.data);
            setLocation({
              ...data,
              timestamp: new Date(data.timestamp),
            });
          } catch (err) {
            console.error("[SSE] Failed to parse message:", err);
          }
        };

        eventSource.onerror = () => {
          console.error(`[SSE] Connection error for vehicle ${vehicleId}`);
          setIsConnected(false);
          eventSource.close();

          if (reconnectAttempts < maxReconnectAttempts) {
            const delay = Math.min(
              1000 * Math.pow(2, reconnectAttempts),
              30000,
            );
            reconnectAttempts++;
            console.log(
              `[SSE] Reconnecting in ${delay}ms (attempt ${reconnectAttempts}/${maxReconnectAttempts})`,
            );
            reconnectTimeout = setTimeout(connect, delay);
          } else {
            setError("Failed to connect to tracking service");
          }
        };
      } catch (err) {
        console.error("[SSE] Failed to create connection:", err);
        setError("Failed to initialize tracking");
      }
    };

    connect();

    return () => {
      if (reconnectTimeout) {
        clearTimeout(reconnectTimeout);
      }
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
        eventSourceRef.current = null;
      }
      setIsConnected(false);
    };
  }, [vehicleId, user?.accessToken]);

  return { location, isConnected, error };
}

export function useMultiVehicleTracking(vehicleIds: string[]) {
  const { user } = useSession();
  const [locations, setLocations] = useState<Map<string, LocationUpdate>>(
    new Map(),
  );
  const [connectedVehicles, setConnectedVehicles] = useState<Set<string>>(
    new Set(),
  );
  const eventSourcesRef = useRef<Map<string, EventSource>>(new Map());

  useEffect(() => {
    if (!user?.accessToken) return;

    const currentVehicleIds = new Set(vehicleIds);
    const existingVehicleIds = new Set(eventSourcesRef.current.keys());

    // Close connections for vehicles no longer in the list
    existingVehicleIds.forEach((vehicleId) => {
      if (!currentVehicleIds.has(vehicleId)) {
        const eventSource = eventSourcesRef.current.get(vehicleId);
        if (eventSource) {
          eventSource.close();
          eventSourcesRef.current.delete(vehicleId);
        }
        setConnectedVehicles((prev) => {
          const next = new Set(prev);
          next.delete(vehicleId);
          return next;
        });
      }
    });

    // Create connections for new vehicles — directly to backend SSE
    vehicleIds.forEach((vehicleId) => {
      if (!eventSourcesRef.current.has(vehicleId)) {
        const url = new URL(
          `${BACKEND_URL}/backend/api/v1/sse/tracking/${vehicleId}`,
        );
        url.searchParams.set("token", user.accessToken as string);

        const eventSource = new EventSource(url.toString());

        eventSource.onopen = () => {
          console.log(`[SSE] Connected to vehicle ${vehicleId}`);
          setConnectedVehicles((prev) => new Set(prev).add(vehicleId));
        };

        eventSource.onmessage = (event) => {
          try {
            const data = JSON.parse(event.data);
            setLocations((prev) => {
              const next = new Map(prev);
              next.set(vehicleId, {
                ...data,
                timestamp: new Date(data.timestamp),
              });
              return next;
            });
          } catch (err) {
            console.error(
              `[SSE] Failed to parse message for vehicle ${vehicleId}:`,
              err,
            );
          }
        };

        eventSource.onerror = () => {
          console.error(`[SSE] Connection error for vehicle ${vehicleId}`);
          setConnectedVehicles((prev) => {
            const next = new Set(prev);
            next.delete(vehicleId);
            return next;
          });
          eventSource.close();
          eventSourcesRef.current.delete(vehicleId);
        };

        eventSourcesRef.current.set(vehicleId, eventSource);
      }
    });

    const eventSources = eventSourcesRef.current;
    return () => {
      eventSources.forEach((eventSource) => {
        eventSource.close();
      });
      eventSources.clear();
      setConnectedVehicles(new Set());
    };
  }, [vehicleIds, user?.accessToken]);

  return { locations, connectedVehicles };
}
