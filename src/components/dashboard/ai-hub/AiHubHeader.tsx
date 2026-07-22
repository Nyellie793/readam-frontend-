"use client";

import { useEffect, useState } from "react";
import { Sparkles, Bell, User } from "lucide-react";
import { getStoredUser } from "@/lib/auth";

export default function AiHubHeader() {
  const [name, setName] = useState("Student");

  useEffect(() => {
    const user = getStoredUser();
    if (user) setName(user.full_name ?? "Student");
  }, []);

  const firstName = name.split(" ")[0];

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
          Good Afternoon,{" "}
          <span className="text-blue-600">{firstName}</span>{" "}
          <span aria-hidden>👋</span>
        </p>
        <p className="text-sm text-gray-500">
          You&apos;re 3 lessons away from completing Mathematics.
        </p>
      </div>

      <div className="flex items-center gap-2">
        <button
          aria-label="Notifications"
          className="relative rounded-full p-2 text-gray-500 hover:bg-white hover:shadow-sm"
        >
          <Bell className="size-5" />
          <span className="absolute right-1.5 top-1.5 size-1.5 rounded-full bg-orange-400" />
        </button>
        <button
          aria-label="AI Assistant"
          className="rounded-full p-2 text-blue-600 hover:bg-white hover:shadow-sm"
        >
          <Sparkles className="size-5" />
        </button>
        <button
          aria-label="Profile"
          className="rounded-full p-2 text-gray-500 hover:bg-white hover:shadow-sm"
        >
          <User className="size-5" />
        </button>
      </div>
    </div>
  );
}