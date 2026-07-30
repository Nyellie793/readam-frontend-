"use client";

import { Bell, Menu, Search, X } from "lucide-react";
import { useEffect, useState } from "react";
import UserDropdown from "@/components/dashboard/UserDropdown";
import { Input } from "@/components/ui/Input";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import Sidebar from "./Sidebar";
import Link from "next/link";
import STUDENT from "@/services/student.service";

interface TopbarProps {
  searchPlaceholder?: string;
  onSearchChange?: (val: string) => void;
  searchValue?: string;
}

export default function Topbar({
  searchPlaceholder = "Search notifications or courses...",
  onSearchChange,
  searchValue = "",
}: TopbarProps) {
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [hasUnread, setHasUnread] = useState(false);

  useEffect(() => {
    STUDENT.getNotifications()
      .then((data) => setHasUnread(data.unread_count > 0))
      .catch(() => null);
  }, []);

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-gray-100 bg-white/90 px-4 backdrop-blur-md sm:px-6 lg:px-8">
      {/* Mobile: Hamburger menu to open Sidebar in a Sheet */}
      <div className="flex items-center gap-2 lg:hidden">
        <Sheet>
          <SheetTrigger asChild>
            <button className="flex h-9 w-9 items-center justify-center rounded-xl hover:bg-gray-100">
              <Menu className="h-5 w-5 text-gray-600" />
            </button>
          </SheetTrigger>
          <SheetContent side="left" className="w-64 p-0">
            <Sidebar />
          </SheetContent>
        </Sheet>
        <Link href="/dashboard" className="text-lg font-bold text-blue-600 lg:hidden">
          Read<span className="text-orange-500">Am</span>
        </Link>
      </div>

      {/* Desktop Search Bar */}
      <div className="hidden max-w-md flex-1 lg:block">
        <div className="relative">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-gray-400" />
          <Input
            placeholder={searchPlaceholder}
            value={searchValue}
            onChange={(e) => onSearchChange?.(e.target.value)}
            className="h-10 w-full rounded-full border-gray-200 bg-gray-50 pl-10 pr-4 text-sm outline-none focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100"
          />
        </div>
      </div>

      {/* Right Side Actions */}
      <div className="flex items-center gap-3">
        {/* Mobile Search Toggle */}
        <button
          onClick={() => setMobileSearchOpen(!mobileSearchOpen)}
          className="rounded-full p-2 text-gray-500 hover:bg-gray-50 lg:hidden"
          aria-label="Toggle Search"
        >
          <Search className="size-5" />
        </button>

        {/* Notifications Icon Link */}
        <Link
          href="/notifications"
          className="relative rounded-full p-2 text-gray-500 hover:bg-gray-50 transition-colors"
        >
          <Bell className="size-5" />
          {hasUnread && (
            <span className="absolute right-2 top-2 size-2 rounded-full bg-blue-600 ring-2 ring-white" />
          )}
        </Link>

        {/* User Profile Dropdown */}
        <UserDropdown />
      </div>

      {/* Mobile Search Overlay */}
      {mobileSearchOpen && (
        <div className="absolute inset-x-0 top-0 z-40 flex h-16 items-center gap-2 bg-white px-4 shadow-md lg:hidden">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-gray-400" />
            <input
              placeholder={searchPlaceholder}
              value={searchValue}
              onChange={(e) => onSearchChange?.(e.target.value)}
              className="h-10 w-full rounded-full border border-gray-200 bg-gray-50 pl-10 pr-4 text-sm outline-none focus:border-blue-500 focus:bg-white"
              autoFocus
            />
          </div>
          <button
            onClick={() => setMobileSearchOpen(false)}
            className="rounded-full p-2 text-gray-500 hover:bg-gray-100"
          >
            <X className="size-5" />
          </button>
        </div>
      )}
    </header>
  );
}
