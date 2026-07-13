"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Logo from "@/components/shared/Logo";
import { STUDENT_NAV } from "@/constants/student-nav";
import { cn } from "@/lib/utils";

interface SidebarProps {
  onNavigate?: () => void;
}

/**
 * Student app nav rail. Reused as-is inside the desktop fixed sidebar
 * and can be dropped into a mobile <Sheet> the same way admin/Sidebar
 * does — `onNavigate` lets a mobile sheet close itself on link click.
 */
export default function Sidebar({ onNavigate }: SidebarProps) {
  const pathname = usePathname();

  return (
    <div className="flex h-full flex-col bg-white">
      <div className="px-6 py-6">
        <Logo />
      </div>

      <nav className="flex-1 space-y-1 px-3">
        {STUDENT_NAV.map((item) => {
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
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              )}
            >
              <Icon className="h-4.5 w-4.5 shrink-0" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="p-4">
        <button
          type="button"
          className="w-full rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-blue-700"
        >
          Start Studying
        </button>
      </div>
    </div>
  );
}
