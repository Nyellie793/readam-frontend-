"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { Menu, LayoutDashboard, LogIn, UserPlus, LogOut, Settings, User, CreditCard } from "lucide-react";
import { useTranslations } from "next-intl";
import { NAV_LINKS } from "@/constants/navigation";
import LanguageToggle from "../shared/LanguageToggle";
import ThemeToggle from "../shared/ThemeToggle";
import Logo from "../shared/Logo";
import { clearSession, homePathFor } from "@/lib/auth";
import { cn } from "@/lib/utils";
import { useStoredUser, initialsOf } from "@/hooks/useStoredUser";
import { usePathname, useRouter } from "next/navigation";

export default function MobileMenu() {
  const t = useTranslations("nav");
  const tc = useTranslations("common");
  const user = useStoredUser();
  const initials = initialsOf(user?.full_name, "--");
  const router = useRouter();
  // The desktop navbar highlighted the current page; the mobile menu did not.
  const pathname = usePathname();

  /**
   * Both sheets are controlled so they can be closed on navigation.
   *
   * Uncontrolled, tapping a link navigated underneath but left the panel
   * covering the screen, so nothing appeared to happen. That is what made the
   * mobile menu look like its buttons were dead.
   */
  /**
   * One sheet at a time, deliberately.
   *
   * Two Radix Sheets were mounted side by side. Each is a modal dialog, and
   * Radix sets pointer-events:none on document.body while one is open,
   * removing it on close. With two in the same tree that bookkeeping gets out
   * of sync, and the body can be left unclickable forever — the whole page
   * dead, close button included. Rendering a single Sheet whose contents
   * depend on which trigger was pressed makes that impossible.
   */
  const [sheet, setSheet] = useState<null | "account" | "nav">(null);
  const close = () => setSheet(null);

  /**
   * Safety net for the same failure. If anything still leaves the body
   * locked — an unmount mid-animation, a future second dialog — this clears
   * it rather than stranding the user on a page that ignores every tap.
   */
  useEffect(() => {
    if (sheet !== null) return;
    const id = setTimeout(() => {
      if (document.body.style.pointerEvents === "none") {
        document.body.style.removeProperty("pointer-events");
      }
    }, 350);
    return () => clearTimeout(id);
  }, [sheet]);

  function handleLogout() {
    close();
    clearSession();
    router.push("/login");
  }

  return (
    <div className="flex items-center gap-2">
      {/* Authenticated: show avatar with dropdown — same as desktop UserDropdown */}
      {user && (
        <button
          type="button"
          onClick={() => setSheet("account")}
          className="flex size-9 items-center justify-center rounded-full bg-blue-600 text-sm font-bold text-white"
          aria-label="Account menu"
        >
          {initials}
        </button>
      )}

      {/* Hamburger */}
      <button
        type="button"
        onClick={() => setSheet("nav")}
        className="rounded-lg p-2 transition hover:bg-gray-100"
        aria-label="Open menu"
      >
        <Menu className="h-7 w-7 text-gray-800" />
      </button>

      {/* The single sheet. Its contents depend on which trigger was pressed. */}
      <Sheet open={sheet !== null} onOpenChange={(o) => !o && close()}>
        {sheet === "account" && user && (
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
              {/* Profile, Subscription and Settings all pointed at /settings,
                  so two of the three did nothing at all once you were on that
                  page. Profile and Subscription now deep-link to their own
                  cards, and Payments goes where the sidebar sends it. */}
              <nav className="flex flex-1 flex-col gap-0.5 p-3">
                {[
                  { href: homePathFor(user), icon: LayoutDashboard, label: "Dashboard" },
                  { href: "/settings#profile", icon: User, label: "Profile" },
                  { href: "/payment", icon: CreditCard, label: "Subscription" },
                  { href: "/settings", icon: Settings, label: "Settings" },
                ].map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.label}
                      href={item.href}
                      onClick={close}
                      className="flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50"
                    >
                      <Icon className="size-4 text-gray-400" /> {item.label}
                    </Link>
                  );
                })}
              </nav>

              <div className="border-t border-gray-100 p-3">
                <button onClick={handleLogout}
                  className="flex w-full items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium text-red-600 hover:bg-red-50">
                  <LogOut className="size-4" /> Logout
                </button>
              </div>
            </div>
          </SheetContent>
        )}

        {sheet === "nav" && (
          <SheetContent side="right" className="w-[300px] px-6">
          <div className="flex h-full flex-col">
            <div className="border-b py-6"><Logo /></div>

            <nav className="flex flex-1 flex-col gap-2 py-8">
              {NAV_LINKS.map((link) => {
                const active =
                  link.href === "/" ? pathname === "/" : pathname.startsWith(link.href);
                return (
                  <Link
                    key={t(link.title)}
                    href={link.href}
                    onClick={close}
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      "rounded-lg px-4 py-3 text-lg font-medium transition",
                      active
                        ? "bg-blue-50 font-semibold text-blue-600"
                        : "text-gray-700 hover:bg-blue-50 hover:text-blue-600"
                    )}
                  >
                    {t(link.title)}
                  </Link>
                );
              })}
            </nav>

            <div className="border-t py-5">
              <p className="mb-3 text-sm font-semibold text-gray-500">{tc("languageTheme")}</p>
              <div className="flex items-center justify-between gap-3">
                <LanguageToggle />
                <ThemeToggle />
              </div>
            </div>

            {!user && (
              <div className="flex flex-col gap-2 pb-6">
                <Link href="/login" onClick={close}
                  className="flex items-center justify-center gap-2 w-full rounded-xl border border-blue-600 px-6 py-3 font-semibold text-blue-600 hover:bg-blue-50">
                  <LogIn className="size-4" /> Sign In
                </Link>
                <Link href="/select-role" onClick={close}
                  className="flex items-center justify-center gap-2 w-full rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700">
                  <UserPlus className="size-4" /> Sign Up
                </Link>
              </div>
            )}
          </div>
          </SheetContent>
        )}
      </Sheet>
    </div>
  );
}