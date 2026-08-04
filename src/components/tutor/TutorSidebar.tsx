"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LogOut, ShieldCheck, Clock } from "lucide-react";
import Logo from "@/components/shared/Logo";
import { TUTOR_NAV } from "@/constants/tutor-nav";
import { cn } from "@/lib/utils";
import { clearSession } from "@/lib/auth";
import { ROUTES } from "@/lib/constants";
import { useTranslations } from "next-intl";

interface TutorSidebarProps {
  isVerified: boolean;
  onNavigate?: () => void;
}

export default function TutorSidebar({ isVerified, onNavigate }: TutorSidebarProps) {
  const t = useTranslations("tutor");
  const pathname = usePathname();
  const router = useRouter();

  function handleLogout() {
    clearSession();
    router.push(ROUTES.login);
  }

  return (
    <div className="flex h-full w-64 shrink-0 flex-col border-r border-gray-100 bg-white">
      <div className="border-b border-gray-50 px-6 py-6">
        <Logo />
      </div>

      <div className="px-4 pt-4">
        <div
          className={cn(
            "flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-semibold",
            isVerified ? "bg-teal-50 text-teal-700" : "bg-orange-50 text-orange-600"
          )}
        >
          {isVerified ? <ShieldCheck className="size-3.5 shrink-0" /> : <Clock className="size-3.5 shrink-0" />}
          {isVerified ? t("verifiedTutor") : t("pendingApproval")}
        </div>
      </div>

      <nav className="flex-1 space-y-1.5 overflow-y-auto px-3 py-6">
        {TUTOR_NAV.map((item) => {
          const Icon = item.icon;
          const active = item.href === "/tutor" ? pathname === "/tutor" : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavigate}
              className={cn(
                "flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-semibold transition-colors",
                active ? "bg-blue-600 text-white shadow-sm" : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              )}
            >
              <Icon className="h-4.5 w-4.5 shrink-0" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-gray-50 p-4">
        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-semibold text-gray-600 transition-colors hover:bg-gray-50 hover:text-red-600"
        >
          <LogOut className="h-4.5 w-4.5 shrink-0" />
          Log Out
        </button>
      </div>
    </div>
  );
}
