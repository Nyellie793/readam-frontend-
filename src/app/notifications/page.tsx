"use client";

import { useEffect, useState } from "react";
import Sidebar from "@/components/layout/Sidebar";
import Topbar from "@/components/layout/Topbar";
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
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    STUDENT.getNotifications()
      .then((data) => setNotifications(data.items))
      .catch(() => null)
      .finally(() => setLoading(false));
  }, []);

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
    STUDENT.markAllNotificationsRead().catch(() => null);
  };

  const toggleRead = (id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, is_read: true } : n)));
    STUDENT.markNotificationRead(id).catch(() => null);
  };

  const todayList = notifications.filter((n) => isToday(n.created_at));
  const yesterdayList = notifications.filter((n) => isYesterday(n.created_at));
  const olderList = notifications.filter((n) => !isToday(n.created_at) && !isYesterday(n.created_at));

  const unreadCount = todayList.filter((n) => !n.is_read).length;
  const hasUnread = notifications.some((n) => !n.is_read);

  return (
    <div className="flex min-h-screen bg-gray-50/50">
      <aside className="hidden lg:block w-64 shrink-0">
        <div className="fixed h-screen w-64">
          <Sidebar />
        </div>
      </aside>
      <div className="flex-1 flex flex-col min-w-0">
        <Topbar />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-4xl space-y-6">
          <NotificationHeader onMarkAllRead={markAllRead} hasUnread={hasUnread} />

          {loading && <p className="text-sm text-gray-400">Loading…</p>}

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
      </div>
    </div>
  );
}
