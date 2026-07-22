"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Logo from "@/components/shared/Logo";
import { STUDENT_NAV, AI_TUTOR_SUB_NAV } from "@/constants/student-nav";
import { cn } from "@/lib/utils";

interface SidebarProps {
  onNavigate?: () => void;
}

export default function Sidebar({ onNavigate }: SidebarProps) {
  const pathname = usePathname();
  const inAiTutor =
    pathname === "/dashboard/ai-tutor" || pathname == "/dashboard/ai-tutor/ai-hub" || pathname === "/dashboard/ai-tutor/ai-chat";

  return (
    <div className="flex min-h-full flex-col bg-white">
      <div className="px-6 py-6">
        <Logo />
      </div>

      <nav className="flex-1 space-y-1 px-3">
        {STUDENT_NAV.map((item) => {
          const Icon = item.icon;
          const isAiTutorParent = item.href === "/dashboard/ai-tutor"
          const active = 
           item.href === "/dashboard"
            ? pathname === "/dashboard"
            : isAiTutorParent
              ? inAiTutor
              : pathname === item.href || pathname.startsWith(item.href + "/");

          return (
            <div key={item.href}>
              <Link
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

              {/* AI Tutor sub-nav — expands when on either ai page */}
              {isAiTutorParent && inAiTutor && (
                <div className="ml-4 mt-1 space-y-1 border-l border-blue-100 pl-3">
                  {AI_TUTOR_SUB_NAV.map((sub) => {
                    const SubIcon = sub.icon;
                    const subActive = pathname === sub.href;
                    return (
                      <Link
                        key={sub.href}
                        href={sub.href}
                        onClick={onNavigate}
                        className={cn(
                          "flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-xs font-medium transition-colors",
                          subActive
                            ? "bg-blue-50 text-blue-700"
                            : "text-gray-500 hover:bg-gray-50 hover:text-gray-700"
                        )}
                      >
                        <SubIcon className="size-3.5 shrink-0" />
                        {sub.label}
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </nav>

      <div className="p-4">
        <Link
          href="/dashboard/ai-tutor/ai-chat"
          className="block w-full rounded-xl bg-blue-600 px-4 py-2.5 text-center text-sm font-semibold text-white shadow-sm transition-colors hover:bg-blue-700"
        >
          Start Studying
        </Link>
      </div>
    </div>
  );
}