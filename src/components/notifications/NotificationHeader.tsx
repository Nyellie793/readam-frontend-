"use client";

import { CheckCheck, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface NotificationHeaderProps {
  onMarkAllRead: () => void;
  hasUnread: boolean;
}

export default function NotificationHeader({
  onMarkAllRead,
  hasUnread,
}: NotificationHeaderProps) {
  return (
    <div className="flex flex-wrap items-start justify-between gap-4 pb-4 border-b border-gray-100">
      <div>
        <h1 className="text-2xl font-extrabold text-gray-900 sm:text-3xl">Notifications</h1>
        <p className="mt-1 text-xs text-gray-500 max-w-xl">
          Stay updated with your learning progress, payment invoices, and community activity.
        </p>
      </div>

      <div className="flex items-center gap-2">
        <Button
          onClick={onMarkAllRead}
          variant="outline"
          disabled={!hasUnread}
          className="border-gray-200 hover:bg-gray-50 text-gray-700 h-10 px-4 rounded-xl text-xs font-semibold flex items-center gap-2 transition-colors disabled:opacity-60"
        >
          <CheckCheck className="size-4 shrink-0 text-gray-500" />
          Mark all as read
        </Button>
        <Link href="/settings">
          <Button
            variant="outline"
            size="icon"
            className="border-gray-200 hover:bg-gray-50 text-gray-500 h-10 w-10 rounded-xl transition-colors"
            aria-label="Notification settings"
          >
            <Settings className="size-4 shrink-0" />
          </Button>
        </Link>
      </div>
    </div>
  );
}
