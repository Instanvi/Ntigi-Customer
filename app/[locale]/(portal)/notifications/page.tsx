"use client";

import { Bell } from "@phosphor-icons/react";
import { PortalPage } from "@/components/portal/shell/portal-page";
import { PortalSubHeader } from "@/components/portal/shell/portal-sub-header";
import { Skeleton } from "@/components/ui/skeleton";
import { useRouter } from "@/lib/navigation";
import { useSession } from "@/hooks/use-session";
import {
  useClientNotifications,
  useMarkAllClientNotificationsRead,
  useMarkClientNotificationRead,
  type ClientNotification,
} from "@/hooks/api/use-client-notifications";
import {
  formatNotificationTime,
  notificationCategoryIcon,
  notificationHref,
} from "@/lib/portal/notification-display";
import { ClientNotificationCategoryBadge } from "@/components/portal/notifications/client-notification-category-badge";
import { cn } from "@/lib/utils";

function NotificationCard({
  item,
  onOpen,
}: {
  item: ClientNotification;
  onOpen: (item: ClientNotification) => void;
}) {
  const Icon = notificationCategoryIcon(item.category);

  return (
    <button
      type="button"
      onClick={() => onOpen(item)}
      className={cn(
        "portal-card flex w-full gap-3 p-4 text-left active:scale-[0.99] transition-transform",
        !item.isRead && "border-l-4 border-l-primary",
      )}
    >
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
        <Icon size={22} weight="duotone" />
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0 flex-1 space-y-1">
            <ClientNotificationCategoryBadge category={item.category} />
            <p className="text-sm font-normal text-slate-900">{item.title}</p>
          </div>
          <span className="shrink-0 text-xs text-slate-400">
            {formatNotificationTime(item.createdAt)}
          </span>
        </div>
        <p className="mt-1 text-sm leading-relaxed text-slate-600">
          {item.content}
        </p>
      </div>
    </button>
  );
}

export default function NotificationsPage() {
  const router = useRouter();
  const { user } = useSession();
  const { data, isLoading, isError } = useClientNotifications({
    enabled: !!user?.id,
  });
  const markRead = useMarkClientNotificationRead();
  const markAllRead = useMarkAllClientNotificationsRead();

  const notifications = data?.data ?? [];

  const handleOpen = (item: ClientNotification) => {
    if (!item.isRead) {
      markRead.mutate(item.id);
    }
    const href = notificationHref(item.metadata);
    if (href) router.push(href);
  };

  return (
    <PortalPage>
      <PortalSubHeader title="Notifications" />

      <div className="px-[var(--portal-header-pad)] py-4 pb-6">
        {isLoading ? (
          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton
                key={i}
                className="h-24 w-full rounded-[var(--portal-radius-card)]"
              />
            ))}
          </div>
        ) : isError ? (
          <div className="portal-card flex flex-col items-center px-6 py-12 text-center">
            <Bell size={40} className="text-primary/40" weight="duotone" />
            <p className="mt-4 text-sm font-normal text-slate-900">
              Could not load notifications
            </p>
            <p className="mt-1 text-sm text-slate-500">Please try again later.</p>
          </div>
        ) : notifications.length === 0 ? (
          <div className="portal-card flex flex-col items-center px-6 py-12 text-center">
            <Bell size={40} className="text-primary/40" weight="duotone" />
            <p className="mt-4 text-sm font-normal text-slate-900">All caught up</p>
            <p className="mt-1 text-sm text-slate-500">No new notifications.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {notifications.some((n) => !n.isRead) ? (
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => markAllRead.mutate()}
                  className="text-xs font-normal text-primary"
                >
                  Mark all as read
                </button>
              </div>
            ) : null}
            {notifications.map((item) => (
              <NotificationCard
                key={item.id}
                item={item}
                onOpen={handleOpen}
              />
            ))}
          </div>
        )}
      </div>
    </PortalPage>
  );
}
