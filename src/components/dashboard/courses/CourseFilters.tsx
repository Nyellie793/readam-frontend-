"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown, Flame } from "lucide-react";
import Logo from "@/components/shared/Logo";
import { STUDENT_NAV } from "@/constants/student-nav";
import { cn } from "@/lib/utils";

const CONTENT_TYPES = [
  { id: "video", label: "Video Lessons", checked: true },
  { id: "pdf", label: "PDF Guides", checked: false },
  { id: "tests", label: "Practice Tests", checked: false },
];

interface CourseFiltersProps {
  onNavigate?: () => void;
  showLogo?: boolean;
}

/**
 * Left rail for the /courses catalog: primary nav (top 3 items), content
 * type checkboxes, education level select, and the study streak widget.
 * Reused as-is inside the desktop fixed sidebar and inside a mobile
 * <Sheet> the same way admin/Sidebar does.
 */
export default function CourseFilters({ 
  onNavigate,
  showLogo = true,
 }: CourseFiltersProps) {
  const pathname = usePathname();
  const navItems = STUDENT_NAV.slice(0, 3);

  return (
    <div className="flex min-h-full flex-col bg-white">
      {showLogo && (
        <div className="px-6 py-6 border-gray-100">
          <Logo />
        </div>
      )}

      <nav className="space-y-1 px-3">
        {navItems.map((item) => {
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

      <div className="mt-6 border-t border-gray-100 px-6 pt-6">
        <p className="text-sm font-bold text-gray-900">Content Type</p>
        <div className="mt-3 flex flex-col gap-2.5">
          {CONTENT_TYPES.map((type) => (
            <label key={type.id} className="flex items-center gap-2.5 text-sm text-gray-700">
              <input
                type="checkbox"
                defaultChecked={type.checked}
                className="size-4 rounded border-gray-300 accent-blue-600"
              />
              {type.label}
            </label>
          ))}
        </div>
      </div>

      <div className="mt-6 border-t border-gray-100 px-6 pt-6">
        <p className="text-sm font-bold text-gray-900">Education Level</p>
        <div className="relative mt-3">
          <select
            defaultValue="Engineering"
            className="w-full appearance-none rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm outline-none focus-visible:ring-2 focus-visible:ring-blue-600/30"
          >
            <option>Engineering</option>
            <option>Design</option>
            <option>Business</option>
            <option>Science</option>
          </select>
          <ChevronDown className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-gray-400" />
        </div>
      </div>

      <div className="mt-auto pt-10 p-6">
        <div className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
          <p className="text-sm font-semibold text-gray-900">Study Streak</p>
          <div className="mt-2 flex items-center gap-1.5 text-sm">
            <Flame className="size-4 fill-orange-500 text-orange-500" />
            <span className="font-semibold text-gray-900">7 Day Streak</span>
          </div>
          <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-gray-100">
            <div className="h-full w-2/3 rounded-full bg-orange-500" />
          </div>
        </div>
      </div>
    </div>
  );
}
