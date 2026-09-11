"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Logo from "@/components/shared/Logo";
import { STUDENT_NAV, AI_TUTOR_SUB_NAV } from "@/constants/student-nav";
import { cn } from "@/lib/utils";
import { BookOpen, Sparkles, PanelLeftClose, PanelLeftOpen } from "lucide-react";

export interface SidebarProps {
  onNavigate?: () => void;
  /** Icon-only rail instead of the full labelled nav. Desktop only — the
   *  mobile drawer never passes this, it has its own way to close (swipe /
   *  the X button), not a persistent rail worth shrinking. */
  collapsed?: boolean;
  /** Present only for the persistent desktop sidebar; omitted (no toggle
   *  button rendered) for the mobile drawer's instance. */
  onToggleCollapse?: () => void;
}

export default function Sidebar({ onNavigate, collapsed = false, onToggleCollapse }: SidebarProps) {
  const pathname = usePathname();

  const inAiTutor =
    pathname === "/dashboard/ai-tutor" ||
    pathname === "/dashboard/ai-tutor/ai-hub" ||
    pathname === "/dashboard/ai-tutor/ai-chat";

  // Payments active on the plans hub, either purchase flow, or checkout
  const inPayments = pathname.startsWith("/payment") || pathname.startsWith("/checkout");

  return (
    <div className="flex h-full min-h-screen w-full flex-col border-r border-gray-100 bg-white">
      <div
        className={cn(
          "flex items-center border-b border-gray-50 px-6 py-6",
          collapsed && "justify-center px-3"
        )}
      >
        {!collapsed && <Logo />}
        {onToggleCollapse && (
          <button
            type="button"
            onClick={onToggleCollapse}
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            className={cn(
              "rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-gray-50 hover:text-gray-700",
              !collapsed && "ml-auto"
            )}
          >
            {collapsed ? <PanelLeftOpen className="size-[18px]" /> : <PanelLeftClose className="size-[18px]" />}
          </button>
        )}
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
                title={collapsed ? item.label : undefined}
                className={cn(
                  "flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-semibold transition-colors",
                  collapsed && "justify-center px-0",
                  active
                    ? "bg-blue-600 text-white shadow-sm"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                )}
              >
                <Icon className="h-4.5 w-4.5 shrink-0" />
                {!collapsed && item.label}
              </Link>

              {/* Sub-nav needs room a collapsed rail doesn't have — skip it
                  there rather than squeeze it in; the parent link above still
                  goes straight to AI Hub / Plans & Pricing. */}
              {!collapsed && isAiTutorParent && inAiTutor && (
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

              {!collapsed && isPaymentsParent && inPayments && (
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
                    Plans & Pricing
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
                </div>
              )}
            </div>
          );
        })}
      </nav>

      <div className={cn("border-t border-gray-50 p-4", collapsed && "px-2")}>
        <Link
          href="/dashboard/ai-tutor/ai-chat"
          title={collapsed ? "Start Studying" : undefined}
          className={cn(
            "flex items-center justify-center gap-2 rounded-xl bg-blue-600 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-blue-700",
            collapsed ? "mx-auto size-10 p-0" : "w-full px-4 py-2.5"
          )}
        >
          {collapsed ? <Sparkles className="size-4" /> : "Start Studying"}
        </Link>
      </div>
    </div>
  );
}
