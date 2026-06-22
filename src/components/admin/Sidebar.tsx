"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ShieldCheck, LogOut } from "lucide-react";
import { ADMIN_NAV } from "@/constants/admin-nav";
import { cn } from "@/lib/utils";

interface SidebarProps {
  onNavigate?: () => void;
}

/**
 * Admin navigation rail. Reused as-is inside the desktop fixed sidebar
 * and inside the mobile <Sheet> (Task 6) — `onNavigate` lets the mobile
 * sheet close itself when a link is clicked.
 */
export default function Sidebar({ onNavigate }: SidebarProps) {
  const pathname = usePathname();

  return (
    <div className="flex h-full flex-col bg-[#0B1437] text-white">
      <div className="flex items-center gap-2 px-6 py-6">
        <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600">
          <ShieldCheck className="h-5 w-5 text-white" />
        </span>
        <div>
          <p className="text-sm font-bold leading-tight">ReadAm Admin</p>
          <p className="text-[11px] text-white/40">Management Portal</p>
        </div>
      </div>

      <nav className="flex-1 space-y-1 px-3">
        {ADMIN_NAV.map((item) => {
          const Icon = item.icon;
          const active = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavigate}
              className={cn(
                "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
                active
                  ? "bg-blue-600 text-white shadow-sm"
                  : "text-white/60 hover:bg-white/5 hover:text-white"
              )}
            >
              <Icon className="h-4.5 w-4.5 shrink-0" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="space-y-3 p-4">
        <div className="rounded-xl bg-white/5 p-4">
          <p className="text-xs font-bold text-emerald-400">● System Health</p>
          <p className="mt-1 text-[11px] text-white/40">All systems operational</p>
        </div>

        <button
          type="button"
          className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-white/60 transition-colors hover:bg-white/5 hover:text-white"
        >
          <LogOut className="h-4.5 w-4.5" />
          Log out
        </button>
      </div>
    </div>
  );
}
