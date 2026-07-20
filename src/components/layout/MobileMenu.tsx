"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, LayoutDashboard, LogIn, UserPlus, LogOut, Settings, User, CreditCard } from "lucide-react";
import { NAV_LINKS } from "@/constants/navigation";
import LanguageToggle from "../shared/LanguageToggle";
import ThemeToggle from "../shared/ThemeToggle";
import Logo from "../shared/Logo";
import { getStoredUser, clearSession } from "@/lib/auth";
import { useRouter } from "next/navigation";

export default function MobileMenu() {
  const [user, setUser] = useState<any>(null);
  const [initials, setInitials] = useState("--");
  const router = useRouter();

  useEffect(() => {
    const stored = getStoredUser();
    if (stored) {
      setUser(stored);
      const fullName = stored.full_name ?? "Student";
      setInitials(
        fullName.split(" ").map((n: string) => n[0]).join("").slice(0, 2).toUpperCase()
      );
    }
  }, []);

  function handleLogout() {
    clearSession();
    router.push("/login");
  }

  return (
    <div className="flex items-center gap-2">
      {/* Authenticated: show avatar with dropdown — same as desktop UserDropdown */}
      {user && (
        <Sheet>
          <SheetTrigger asChild>
            <button
              className="flex size-9 items-center justify-center rounded-full bg-blue-600 text-sm font-bold text-white"
              aria-label="Account menu"
            >
              {initials}
            </button>
          </SheetTrigger>
          <SheetContent side="right" className="w-[300px] px-0 pt-0">
            <div className="flex h-full flex-col">
              {/* User info header */}
              <div className="flex items-center gap-3 bg-blue-50 p-6">
                <div className="flex size-12 items-center justify-center rounded-full bg-blue-600 text-sm font-bold text-white">
                  {initials}
                </div>
                <div className="min-w-0">
                  <p className="font-semibold text-gray-900 truncate">{user.full_name ?? "Student"}</p>
                  <p className="text-xs text-gray-500 truncate">{user.email}</p>
                </div>
              </div>

              

              {/* Nav links */}
              <nav className="flex flex-1 flex-col gap-0.5 p-3">
                <Link href="/dashboard"
                  className="flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50">
                  <LayoutDashboard className="size-4 text-gray-400" /> Dashboard
                </Link>
                <Link href="/settings/profile"
                  className="flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50">
                  <User className="size-4 text-gray-400" /> Profile
                </Link>
                <Link href="/payments"
                  className="flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50">
                  <CreditCard className="size-4 text-gray-400" /> Subscription
                </Link>
                <Link href="/settings"
                  className="flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50">
                  <Settings className="size-4 text-gray-400" /> Settings
                </Link>
              </nav>

              <div className="border-t border-gray-100 p-3">
                <button onClick={handleLogout}
                  className="flex w-full items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium text-red-600 hover:bg-red-50">
                  <LogOut className="size-4" /> Logout
                </button>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      )}

      {/* Hamburger — opens nav links */}
      <Sheet>
        <SheetTrigger className="rounded-lg p-2 transition hover:bg-gray-100">
          <Menu className="h-7 w-7 text-gray-800" />
        </SheetTrigger>
        <SheetContent side="right" className="w-[300px] px-6">
          <div className="flex h-full flex-col">
            <div className="border-b py-6"><Logo /></div>

            <nav className="flex flex-1 flex-col gap-2 py-8">
              {NAV_LINKS.map((link) => (
                <Link key={link.title} href={link.href}
                  className="rounded-lg px-4 py-3 text-lg font-medium text-gray-700 transition hover:bg-blue-50 hover:text-blue-600">
                  {link.title}
                </Link>
              ))}
            </nav>

            <div className="border-t py-5">
              <p className="mb-3 text-sm font-semibold text-gray-500">Language & Theme</p>
              <div className="flex items-center justify-between gap-3">
                <LanguageToggle />
                <ThemeToggle />
              </div>
            </div>

            {!user && (
              <div className="flex flex-col gap-2 pb-6">
                <Link href="/login"
                  className="flex items-center justify-center gap-2 w-full rounded-xl border border-blue-600 px-6 py-3 font-semibold text-blue-600 hover:bg-blue-50">
                  <LogIn className="size-4" /> Sign In
                </Link>
                <Link href="/signup"
                  className="flex items-center justify-center gap-2 w-full rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700">
                  <UserPlus className="size-4" /> Sign Up
                </Link>
              </div>
            )}
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}