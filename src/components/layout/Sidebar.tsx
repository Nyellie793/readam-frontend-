"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Logo from "@/components/shared/Logo";
import { STUDENT_NAV, AI_TUTOR_SUB_NAV } from "@/constants/student-nav";
import { cn } from "@/lib/utils";
import { BookOpen, Sparkles, FileText } from "lucide-react";

export interface SidebarProps {
  onNavigate?: () => void;
}

export default function Sidebar({ onNavigate }: SidebarProps) {
  const pathname = usePathname();

  const inAiTutor =
    pathname === "/dashboard/ai-tutor" ||
    pathname === "/dashboard/ai-tutor/ai-hub" ||
    pathname === "/dashboard/ai-tutor/ai-chat";

  // Payments active if on /payment, /payment/ai-sessions, /checkout, /payment/success, or /payment/failed
  const inPayments = pathname.startsWith("/payment") || pathname.startsWith("/checkout");

  return (
    <div className="flex h-full min-h-screen flex-col bg-white border-r border-gray-100 w-64 shrink-0">
      <div className="px-6 py-6 border-b border-gray-50">
        <Logo />
      </div>

      <nav className="flex-1 space-y-1.5 px-3 py-6">
        {STUDENT_NAV.map((item) => {
          const Icon = item.icon;
          const isAiTutorParent = item.label === "AI Tutor";
          const isPaymentsParent = item.label === "Payments";

          // Determine if this nav item is active
          const active =
            item.href === "/dashboard"
              ? pathname === "/dashboard"
              : isAiTutorParent
                ? inAiTutor
                : isPaymentsParent
                  ? inPayments
                  : pathname === item.href || (pathname.startsWith(item.href) && item.href !== "/");

          // Override href for Payments parent link to point to first child
          const itemHref = isPaymentsParent ? "/payment" : (isAiTutorParent ? "/dashboard/ai-tutor/ai-hub" : item.href);

          return (
            <div key={item.label}>
              <Link
                href={itemHref}
                onClick={onNavigate}
                className={cn(
                  "flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-semibold transition-colors",
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
                <div className="ml-4 mt-1.5 space-y-1 border-l border-blue-100 pl-3.5">
                  {AI_TUTOR_SUB_NAV.map((sub) => {
                    const SubIcon = sub.icon;
                    const subActive = pathname === sub.href;
                    return (
                      <Link
                        key={sub.href}
                        href={sub.href}
                        onClick={onNavigate}
                        className={cn(
                          "flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-xs font-semibold transition-colors",
                          subActive
                            ? "bg-blue-50 text-blue-700 font-bold"
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

              {/* Payments sub-nav — expands when on payments pages */}
              {isPaymentsParent && inPayments && (
                <div className="ml-4 mt-1.5 space-y-1 border-l border-blue-100 pl-3.5">
                  <Link
                    href="/payment"
                    onClick={onNavigate}
                    className={cn(
                      "flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-xs font-semibold transition-colors",
                      pathname === "/payment"
                        ? "bg-blue-50 text-blue-700 font-bold"
                        : "text-gray-500 hover:bg-gray-50 hover:text-gray-700"
                    )}
                  >
                    <BookOpen className="size-3.5 shrink-0" />
                    GCE Pricing
                  </Link>
                  <Link
                    href="/payment/ai-sessions"
                    onClick={onNavigate}
                    className={cn(
                      "flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-xs font-semibold transition-colors",
                      pathname === "/payment/ai-sessions"
                        ? "bg-blue-50 text-blue-700 font-bold"
                        : "text-gray-500 hover:bg-gray-50 hover:text-gray-700"
                    )}
                  >
                    <Sparkles className="size-3.5 shrink-0" />
                    AI Study Sessions
                  </Link>
                  <Link
                    href="/payment/past-questions"
                    onClick={onNavigate}
                    className={cn(
                      "flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-xs font-semibold transition-colors",
                      pathname === "/payment/past-questions"
                        ? "bg-blue-50 text-blue-700 font-bold"
                        : "text-gray-500 hover:bg-gray-50 hover:text-gray-700"
                    )}
                  >
                    <FileText className="size-3.5 shrink-0" />
                    Past Questions
                  </Link>
                </div>
              )}
            </div>
          );
        })}
      </nav>

      <div className="p-4 border-t border-gray-50">
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
