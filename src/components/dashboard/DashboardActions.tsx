"use client";

import Link from "next/link";
import { Bell, Sparkles } from "lucide-react";

export default function DashboardActions() {
  return (
    <div className="flex items-center gap-3">

      <Link
        href="/notifications"
        className="rounded-full border border-gray-100 p-2.5 text-gray-500 hover:bg-gray-50"
      >
        <Bell className="size-[18px]" />
      </Link>

      <Link
        href="/dashboard/ai-tutor"
        className="
        flex
        items-center
        gap-2
        rounded-full
        bg-gradient-to-r
        from-indigo-700
        to-blue-600
        px-4
        py-2.5
        text-sm
        font-semibold
        text-white
        w-full
        "
      >
        <Sparkles className="size-4" />
        AI Assistant
      </Link>

    </div>
  );
}
