"use client";

import NotificationIcon from "./NotificationIcon";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export interface NotificationItem {
  id: string;
  type: "graded" | "reminder" | "failed" | "discussion" | "system" | "course";
  title: string;
  description: string;
  time: string;
  unread: boolean;
  highlightedText?: string; // e.g. "A+"
  actionLink?: string;
  actionText?: string;
}

interface NotificationCardProps {
  notification: NotificationItem;
  onReadToggle?: (id: string) => void;
  onActionClick?: (id: string, action: string) => void;
}

export default function NotificationCard({
  notification,
  onReadToggle,
  onActionClick,
}: NotificationCardProps) {
  const { id, type, title, description, time, unread, highlightedText, actionLink, actionText } = notification;

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
          <span className="text-[11px] font-medium text-gray-400 whitespace-nowrap shrink-0 mt-0.5">{time}</span>
        </div>

        {/* Process description to bold score / highlights if present */}
        <p className="text-xs leading-relaxed text-gray-500 max-w-2xl">
          {highlightedText ? (
            <>
              {description.split(highlightedText)[0]}
              <span className="text-blue-600 font-extrabold">{highlightedText}</span>
              {description.split(highlightedText)[1]}
            </>
          ) : (
            description
          )}
        </p>

        {/* Action Elements based on notification type */}
        {unread && (
          <div className="pt-2 flex flex-wrap gap-3">
            {type === "graded" && actionLink && (
              <Link
                href={actionLink}
                className="text-xs font-bold text-blue-600 hover:underline hover:text-blue-700"
                onClick={(e) => {
                  e.stopPropagation();
                  onActionClick?.(id, "view-feedback");
                }}
              >
                {actionText || "View Feedback"}
              </Link>
            )}

            {type === "reminder" && (
              <div className="flex items-center gap-2.5">
                <Button
                  size="sm"
                  className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl h-8 px-4 font-bold text-[11px] transition-colors"
                  onClick={(e) => {
                    e.stopPropagation();
                    onActionClick?.(id, "start-now");
                  }}
                >
                  Start Now
                </Button>
                <button
                  type="button"
                  className="text-[11px] font-bold text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-xl h-8 px-3 transition-colors"
                  onClick={(e) => {
                    e.stopPropagation();
                    onActionClick?.(id, "maybe-later");
                  }}
                >
                  Maybe Later
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
