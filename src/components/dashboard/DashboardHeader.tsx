"use client";

import { useState } from "react";
import { Menu, Search, Bell, Sparkles, Settings, X } from "lucide-react";
import DashboardGreeting from "./DashboardGreeting";
import DashboardMobileSidebar from "./DashboardMobileSidebar";
import DashboardSearch from "./DashboardSearch";
import DashboardActions from "./DashboardActions";

export default function DashboardHeader() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  return (
    <>
      {/* ── Mobile top bar ── */}
      <div className="flex items-center justify-between lg:hidden mb-4">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setSidebarOpen(true)}
            className="flex h-9 w-9 items-center justify-center rounded-xl hover:bg-gray-100"
            aria-label="Open menu"
          >
            <Menu size={22} />
          </button>
          <DashboardGreeting />
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={() => setSearchOpen((o) => !o)}
            className="rounded-full p-2 text-gray-500 hover:bg-gray-100"
            aria-label="Search"
          >
            <Search className="size-5" />
          </button>
          <button className="rounded-full p-2 text-gray-500 hover:bg-gray-100" aria-label="Notifications">
            <Bell className="size-5" />
          </button>
          <button className="rounded-full p-2 text-violet-500 hover:bg-gray-100" aria-label="AI Assistant">
            <Sparkles className="size-5" />
          </button>
          <button className="rounded-full p-2 text-gray-500 hover:bg-gray-100" aria-label="Settings">
            <Settings className="size-5" />
          </button>
        </div>
      </div>

      {/* Mobile search bar — expands below top bar when search icon tapped */}
      {searchOpen && (
        <div className="mb-4 flex items-center gap-2 lg:hidden">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-gray-400" />
            <input
              autoFocus
              placeholder="Search courses..."
              className="h-11 w-full rounded-full border border-gray-200 bg-white pl-10 pr-4 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </div>
          <button
            onClick={() => setSearchOpen(false)}
            className="rounded-full p-2 text-gray-500 hover:bg-gray-100"
          >
            <X className="size-5" />
          </button>
        </div>
      )}

      {/* ── Desktop header ── */}
      <header className="hidden lg:flex flex-wrap items-center justify-between gap-4">
        <DashboardGreeting />
        <div className="ml-auto flex items-center gap-4">
          <DashboardSearch />
          <DashboardActions />
        </div>
      </header>

      {/* Mobile sidebar drawer */}
      <DashboardMobileSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
    </>
  );
}