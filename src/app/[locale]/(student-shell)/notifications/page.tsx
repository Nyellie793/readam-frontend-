"use client";

import useSWR from "swr";
import NotificationHeader from "@/components/notifications/NotificationHeader";
import NotificationGroup from "@/components/notifications/NotificationGroup";
import NotificationCard from "@/components/notifications/NotificationCard";
import STUDENT from "@/services/student.service";
import type { NotificationItem } from "@/types/api.types";
import { useTranslations } from "next-intl";

function isToday(iso: string): boolean {
  const d = new Date(iso);
  const now = new Date();
  return d.toDateString() === now.toDateString();
}

function isYesterday(iso: string): boolean {
  const d = new Date(iso);
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  return d.toDateString() === yesterday.toDateString();
}

export default function NotificationsPage() {
  const t = useTranslations("settings");
  // Same SWR key as the unread-dot in Topbar/AiHubHeader — marking read here
  // updates their badge too instead of leaving it stale until next refetch.
  const { data, isLoading: loading, mutate } = useSWR("notifications-unread", () => STUDENT.getNotifications());
  const notifications = data?.items ?? [];

  const markAllRead = () => {
    mutate(
      (current) => current && { ...current, items: current.items.map((n) => ({ ...n, is_read: true })) }
    );
    STUDENT.markAllNotificationsRead().catch(() => null);
  };

  const toggleRead = (id: string) => {
    mutate(
      (current) =>
        current && {
          ...current,
          items: current.items.map((n: NotificationItem) => (n.id === id ? { ...n, is_read: true } : n)),
        }
    );
    STUDENT.markNotificationRead(id).catch(() => null);
  };

  const todayList = notifications.filter((n) => isToday(n.created_at));
  const yesterdayList = notifications.filter((n) => isYesterday(n.created_at));
  const olderList = notifications.filter((n) => !isToday(n.created_at) && !isYesterday(n.created_at));

  const unreadCount = todayList.filter((n) => !n.is_read).length;
  const hasUnread = notifications.some((n) => !n.is_read);

  return (
    <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-4xl space-y-6">
      <NotificationHeader onMarkAllRead={markAllRead} hasUnread={hasUnread} />

      {loading && (
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-20 animate-pulse rounded-2xl bg-gray-100" />
          ))}
        </div>
      )}

      {!loading && notifications.length === 0 && (
        <p className="text-sm text-gray-400">
          {t("noNotifications")}
        </p>
      )}

      <div className="space-y-8">
        {todayList.length > 0 && (
          <NotificationGroup title={t("today")} badgeContent={unreadCount > 0 ? `${unreadCount} ${t("new")}` : undefined}>
            {todayList.map((n) => (
              <NotificationCard key={n.id} notification={n} onReadToggle={toggleRead} />
            ))}
          </NotificationGroup>
        )}

        {yesterdayList.length > 0 && (
          <NotificationGroup title={t("yesterday")}>
            {yesterdayList.map((n) => (
              <NotificationCard key={n.id} notification={n} onReadToggle={toggleRead} />
            ))}
          </NotificationGroup>
        )}

        {olderList.length > 0 && (
          <NotificationGroup title={t("older")}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {olderList.map((n) => (
                <NotificationCard key={n.id} notification={n} onReadToggle={toggleRead} />
              ))}
            </div>
          </NotificationGroup>
        )}
      </div>
    </main>
  );
}
