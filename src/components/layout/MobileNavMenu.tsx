"use client";

import { LogIn, UserPlus } from "lucide-react";
import Logo from "../shared/Logo";
import LanguageToggle from "../shared/LanguageToggle";
import ThemeToggle from "../shared/ThemeToggle";
import OptimizedLink from "../ui/OptimizedLink";
import { NAV_LINKS } from "@/constants/navigation";
import { cn } from "@/lib/utils";

interface MobileNavMenuProps {
  user: any;
  pathname: string;
  t: (key: string) => string;
  tc: (key: string) => string;
  close: () => void;
}

export default function MobileNavMenu({
  user,
  pathname,
  t,
  tc,
  close,
}: MobileNavMenuProps) {
  return (
    <div className="flex h-full flex-col">
      <div className="border-b py-6">
        <Logo />
      </div>

      <nav className="flex flex-1 flex-col gap-2 py-8">
        {NAV_LINKS.map((link) => {
          const active =
            link.href === "/" ? pathname === "/" : pathname.startsWith(link.href);
          return (
            <OptimizedLink
              key={t(link.title)}
              href={link.href}
              onClick={close}
              aria-current={active ? "page" : undefined}
              className={cn(
                "rounded-lg px-4 py-3 text-lg font-medium transition touch-manipulation",
                active
                  ? "bg-blue-50 font-semibold text-blue-600"
                  : "text-gray-700 hover:bg-blue-50 hover:text-blue-600"
              )}
            >
              {t(link.title)}
            </OptimizedLink>
          );
        })}
      </nav>

      <div className="border-t py-5">
        <p className="mb-3 text-sm font-semibold text-gray-500">
          {tc("languageTheme")}
        </p>
        <div className="flex items-center justify-between gap-3">
          <LanguageToggle />
          <ThemeToggle />
        </div>
      </div>

      {!user && (
        <div className="flex flex-col gap-2 pb-6">
          <OptimizedLink
            href="/login"
            onClick={close}
            className="flex items-center justify-center gap-2 w-full rounded-xl border border-blue-600 px-6 py-3 font-semibold text-blue-600 hover:bg-blue-50 touch-manipulation"
          >
            <LogIn className="size-4" /> Sign In
          </OptimizedLink>
          <OptimizedLink
            href="/select-role"
            onClick={close}
            className="flex items-center justify-center gap-2 w-full rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700 touch-manipulation"
          >
            <UserPlus className="size-4" /> Sign Up
          </OptimizedLink>
        </div>
      )}
    </div>
  );
}
