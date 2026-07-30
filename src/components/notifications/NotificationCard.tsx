"use client";

import NotificationIcon from "./NotificationIcon";
import { cn } from "@/lib/utils";
import Link from "next/link";
import type { NotificationItem as ApiNotificationItem } from "@/types/api.types";

interface NotificationCardProps {
  notification: ApiNotificationItem;
  onReadToggle?: (id: string) => void;
}

function formatTime(iso: string): string {
  const date = new Date(iso);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffHours = diffMs / (1000 * 60 * 60);
  if (diffHours < 24) {
    const hours = Math.max(1, Math.round(diffHours));
    return `${hours}h ago`;
  }
  return date.toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" });
}

export default function NotificationCard({ notification, onReadToggle }: NotificationCardProps) {
  const { id, type, title, message, is_read } = notification;
  const unread = !is_read;

  return (
    <div
      onClick={() => unread && onReadToggle?.(id)}
      className={cn(
        "relative flex flex-col sm:flex-row gap-4 p-5 rounded-2xl border transition-all cursor-pointer bg-white",
        unread
          ? "border-blue-100 border-l-4 border-l-blue-600 shadow-sm"
          : "border-gray-100 shadow-none hover:shadow-sm"
      )}
    >
      <NotificationIcon type={type} />

      <div className="flex-1 space-y-1.5 min-w-0">
        <div className="flex items-start justify-between gap-4">
          <h4 className="text-sm font-bold text-gray-900 leading-snug">{title}</h4>
          <span className="text-[11px] font-medium text-gray-400 whitespace-nowrap shrink-0 mt-0.5">
            {formatTime(notification.created_at)}
          </span>
        </div>

        <p className="text-xs leading-relaxed text-gray-500 max-w-2xl">{message}</p>

        {notification.related_payment_id && (
          <div className="pt-2">
            <Link
              href="/settings"
              className="text-xs font-bold text-blue-600 hover:underline hover:text-blue-700"
              onClick={(e) => e.stopPropagation()}
            >
              View Billing
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
