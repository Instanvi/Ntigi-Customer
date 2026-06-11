"use client";

import { cn } from "@/lib/utils";

export type TimelineEvent = {
  id: string;
  timestamp: string;
  title: string;
  subtitle?: string;
  description?: string;
  active?: boolean;
};

export function TrackingTimeline({ events }: { events: TimelineEvent[] }) {
  return (
    <div className="space-y-0 py-2">
      {events.map((event, index) => (
        <div key={event.id} className="relative flex gap-4 pb-8 last:pb-0">
          {index < events.length - 1 ? (
            <div
              className="absolute left-[5px] top-5 bottom-0 w-[3px] rounded-full bg-slate-400"
              aria-hidden
            />
          ) : null}
          <div
            className={cn(
              "relative z-10 mt-1 h-4 w-4 shrink-0 rounded-full border-[3px]",
              event.active
                ? "border-primary bg-primary"
                : "border-slate-400 bg-white",
            )}
          />
          <div className="min-w-0 flex-1">
            <p className="text-sm font-normal text-slate-800">
              {event.timestamp}
            </p>
            {event.subtitle ? (
              <p className="text-sm font-normal text-primary">{event.subtitle}</p>
            ) : null}
            {event.title ? (
              <p className="mt-1 text-sm font-normal text-slate-700">
                {event.title}
              </p>
            ) : null}
            {event.description ? (
              <p className="mt-1 text-sm leading-relaxed text-slate-500">
                {event.description}
              </p>
            ) : null}
          </div>
        </div>
      ))}
    </div>
  );
}
