"use client";

import Link from "next/link";
import Logo from "../shared/Logo";
import MobileMenu from "./MobileMenu";
import LanguageToggle from "../shared/LanguageToggle";
import ThemeToggle from "../shared/ThemeToggle";
import { NAV_LINKS } from "@/constants/navigation";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const pathname = usePathname();

  const isAuthPage =
    pathname === "/login" || pathname === "/signup";

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100 safe-top">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">

        {/* LOGO ALWAYS */}
        <Logo />

        {/* DESKTOP NAV (hidden on auth pages OR mobile) */}
        {!isAuthPage && (
          <nav className="hidden items-center gap-8 lg:flex">
            {NAV_LINKS.map((link) => {
              const active = pathname === link.href;

              return (
                <Link
                  key={link.title}
                  href={link.href}
                  className={`
                    relative pb-2 text-sm font-medium transition
                    ${
                      active
                        ? "text-black"
                        : "text-gray-600 hover:text-blue-600"
                    }
                  `}
                >
                  {link.title}

                  {active && (
                    <span className="absolute left-0 bottom-0 h-[3px] w-full rounded-full bg-orange-500" />
                  )}
                </Link>
              );
            })}
          </nav>
        )}

        {/* RIGHT SIDE ACTIONS */}
        {!isAuthPage ? (
          <div className="hidden items-center gap-3 lg:flex">
            <LanguageToggle />
            <ThemeToggle />

            <Link
              href="/login"
              className="
                rounded-xl bg-blue-600 px-5 py-2 text-sm font-semibold text-white
                transition hover:bg-blue-700
              "
            >
              Log In
            </Link>
          </div>
        ) : (
          // AUTH PAGES: keep ONLY minimal actions if needed
          <div className="hidden lg:flex items-center gap-3">
            <LanguageToggle />
            <ThemeToggle />
          </div>
        )}

        {/* MOBILE MENU (always visible except we simplify inside it) */}
        <div className="lg:hidden">
          <MobileMenu />
        </div>

      </div>
    </header>
  );
}