"use client";

import { useState } from "react";
import Sidebar from "@/components/layout/Sidebar";
import Topbar from "@/components/layout/Topbar";
import NotificationHeader from "@/components/notifications/NotificationHeader";
import NotificationGroup from "@/components/notifications/NotificationGroup";
import NotificationCard from "@/components/notifications/NotificationCard";
import { INITIAL_NOTIFICATIONS } from "@/data/notifications";

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState(INITIAL_NOTIFICATIONS);

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })));
  };

  const toggleRead = (id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, unread: false } : n)));
  };

  const todayList = notifications.filter((n) => n.id === "1" || n.id === "2");
  const yesterdayList = notifications.filter((n) => n.id === "3" || n.id === "4");
  const olderList = notifications.filter((n) => n.id === "5" || n.id === "6");

  const unreadCount = todayList.filter((n) => n.unread).length;
  const hasUnread = notifications.some((n) => n.unread);

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

          <div className="space-y-8">
            <NotificationGroup title="Today" badgeContent={unreadCount > 0 ? `${unreadCount} NEW` : undefined}>
              {todayList.map((n) => (
                <NotificationCard key={n.id} notification={n} onReadToggle={toggleRead} />
              ))}
            </NotificationGroup>

            <NotificationGroup title="Yesterday">
              {yesterdayList.map((n) => (
                <NotificationCard key={n.id} notification={n} onReadToggle={toggleRead} />
              ))}
            </NotificationGroup>

            <NotificationGroup title="Older">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {olderList.map((n) => (
                  <NotificationCard key={n.id} notification={n} onReadToggle={toggleRead} />
                ))}
              </div>
            </NotificationGroup>

            <div className="flex justify-center pt-4">
              <button className="text-xs font-semibold text-blue-600 hover:text-blue-700 transition-colors flex items-center gap-1 cursor-pointer">
                Load more history <span aria-hidden>∨</span>
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
