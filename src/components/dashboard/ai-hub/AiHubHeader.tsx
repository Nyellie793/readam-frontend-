"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Sparkles, Bell } from "lucide-react";
import { useStoredUser } from "@/hooks/useStoredUser";
import STUDENT from "@/services/student.service";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

function useGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "Good Morning";
  if (hour < 17) return "Good Afternoon";
  return "Good Evening";
}

export default function AiHubHeader() {
  const user = useStoredUser();
  const name = user?.full_name ?? "Student";
  const avatarUrl = user?.avatar_url ?? null;
  const [hasUnread, setHasUnread] = useState(false);
  const greeting = useGreeting();

  useEffect(() => {
    STUDENT.getNotifications()
      .then((data) => setHasUnread(data.unread_count > 0))
      .catch(() => null);
  }, []);

  const firstName = name.split(" ")[0];
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="flex flex-wrap items-start justify-between gap-4">
      <div>
        <span className="inline-flex items-center gap-1.5 rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-medium text-blue-600">
          <Sparkles className="size-3" />
          AI Assistant Hub
        </span>

        <h1 className="mt-3 text-2xl font-extrabold text-gray-900 sm:text-3xl">
          What would you like to master today?
        </h1>

        <p className="mt-1.5 max-w-xl text-sm text-gray-500">
          Your personalized AI companion is ready to help you navigate your
          curriculum, tackle tough questions, and optimize your study sessions
          for maximum impact.
        </p>

        <p className="mt-4 text-base font-semibold text-gray-800">
          {greeting}, <span className="text-blue-600">{firstName}</span>{" "}
          <span aria-hidden>👋</span>
        </p>
      </div>

      <div className="flex items-center gap-2">
        <Link
          href="/notifications"
          aria-label="Notifications"
          className="relative rounded-full p-2 text-gray-500 hover:bg-white hover:shadow-sm"
        >
          <Bell className="size-5" />
          {hasUnread && (
            <span className="absolute right-1.5 top-1.5 size-1.5 rounded-full bg-orange-400" />
          )}
        </Link>
        <Link
          href="/settings"
          aria-label="Settings"
          className="rounded-full hover:bg-white hover:shadow-sm"
        >
          <Avatar className="size-9">
            <AvatarImage src={avatarUrl ?? ""} />
            <AvatarFallback>{initials || "S"}</AvatarFallback>
          </Avatar>
        </Link>
      </div>
    </div>
  );
}
