"use client";

import type { PortalNotice } from "@/lib/portal-config/types";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

export function NoticeCarousel({
  title,
  notices,
  className,
}: {
  title: string;
  notices: PortalNotice[];
  className?: string;
}) {
  if (notices.length === 0) return null;

  return (
    <section className={cn("px-[var(--portal-header-pad)]", className)}>
      <h3 className="mb-2 text-sm font-normal text-[#4E6BFA]">{title}</h3>
      <ScrollArea className="w-full whitespace-nowrap">
        <div className="flex w-max gap-2.5 pb-2">
          {notices.map((notice) => (
            <article
              key={notice.id}
              className="portal-card w-[min(82vw,300px)] shrink-0 rounded-none px-3 py-2.5 text-[15px] font-normal leading-snug text-slate-600"
            >
              {notice.title ? (
                <p className="mb-1 text-base font-normal text-slate-800">
                  {notice.title}
                </p>
              ) : null}
              <p className="whitespace-normal text-[15px] leading-snug">
                {notice.body}
              </p>
            </article>
          ))}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </section>
  );
}
