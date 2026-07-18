"use client";

import { Bell, Sparkles } from "lucide-react";

export default function DashboardActions() {
  return (
    <div className="flex items-center gap-3">

      <button
        className="rounded-full border border-gray-100 p-2.5 text-gray-500 hover:bg-gray-50"
      >
        <Bell className="size-[18px]" />
      </button>

      <button
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
      </button>

    </div>
  );
}