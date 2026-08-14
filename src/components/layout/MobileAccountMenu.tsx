"use client";

import { LayoutDashboard, LogOut, Settings, User, CreditCard } from "lucide-react";
import { homePathFor } from "@/lib/auth";
import OptimizedLink from "../ui/OptimizedLink";

interface MobileAccountMenuProps {
  user: any;
  initials: string;
  close: () => void;
  handleLogout: () => void;
}

export default function MobileAccountMenu({
  user,
  initials,
  close,
  handleLogout,
}: MobileAccountMenuProps) {
  return (
    <div className="flex h-full flex-col">
      {/* User info header */}
      <div className="flex items-center gap-3 bg-blue-50 p-6">
        <div className="flex size-12 items-center justify-center rounded-full bg-blue-600 text-sm font-bold text-white">
          {initials}
        </div>
        <div className="min-w-0">
          <p className="font-semibold text-gray-900 truncate">
            {user.full_name ?? "Student"}
          </p>
          <p className="text-xs text-gray-500 truncate">{user.email}</p>
        </div>
      </div>

      {/* Nav links */}
      <nav className="flex flex-1 flex-col gap-0.5 p-3">
        {[
          { href: homePathFor(user), icon: LayoutDashboard, label: "Dashboard" },
          { href: "/settings#profile", icon: User, label: "Profile" },
          { href: "/payment", icon: CreditCard, label: "Subscription" },
          { href: "/settings", icon: Settings, label: "Settings" },
        ].map((item) => {
          const Icon = item.icon;
          return (
            <OptimizedLink
              key={item.label}
              href={item.href}
              onClick={close}
              className="flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 touch-manipulation"
            >
              <Icon className="size-4 text-gray-400" /> {item.label}
            </OptimizedLink>
          );
        })}
      </nav>

      <div className="border-t border-gray-100 p-3">
        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium text-red-600 hover:bg-red-50 touch-manipulation"
        >
          <LogOut className="size-4" /> Logout
        </button>
      </div>
    </div>
  );
}
