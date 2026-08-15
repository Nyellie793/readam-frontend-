"use client";

import { useEffect, useState } from "react";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import { useTranslations } from "next-intl";
import { clearSession, homePathFor } from "@/lib/auth";
import { useStoredUser, initialsOf } from "@/hooks/useStoredUser";

/**
 * Imported statically, deliberately.
 *
 * These were next/dynamic with ssr:false and no loading fallback, so tapping
 * the hamburger opened the sheet while the menu's chunk was still downloading
 * — an empty sidebar, and taps landing on nothing. A preload fired on
 * touchstart, but that only starts the fetch about 50ms before the sheet
 * opens, so on a slow connection the chunk loses the race.
 *
 * They are roughly 4KB of source each. Splitting them saved a couple of
 * kilobytes and cost a network round trip on the one interaction the user is
 * actually waiting for.
 */
import MobileNavMenu from "./MobileNavMenu";
import MobileAccountMenu from "./MobileAccountMenu";
import { usePathname, useRouter } from "next/navigation";
import { startMeasure, endMeasure } from "@/lib/performance";

// Dynamic imports for sub-menus


export default function MobileMenu() {
  const t = useTranslations("nav");
  const tc = useTranslations("common");
  const user = useStoredUser();
  const initials = initialsOf(user?.full_name, "--");
  const router = useRouter();
  const pathname = usePathname();

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

  // Performance budget instrumentation
  useEffect(() => {
    if (sheet !== null) {
      const frame = requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          endMeasure(`mobile-menu-${sheet}-open`, 100);
        });
      });
      return () => cancelAnimationFrame(frame);
    }
  }, [sheet]);

  function handleLogout() {
    close();
    clearSession();
    router.push("/login");
  }

  return (
    <div className="flex items-center gap-2">
      {/* Authenticated: show avatar with dropdown */}
      {user && (
        <button
          type="button"
          onClick={() => {
            startMeasure("mobile-menu-account-open");
            setSheet("account");
          }}
          className="flex size-9 items-center justify-center rounded-full bg-blue-600 text-sm font-bold text-white touch-manipulation"
          aria-label="Account menu"
        >
          {initials}
        </button>
      )}

      {/* Hamburger */}
      <button
        type="button"
        onClick={() => {
          startMeasure("mobile-menu-nav-open");
          setSheet("nav");
        }}
        className="rounded-lg p-2 transition hover:bg-gray-100 touch-manipulation"
        aria-label="Open menu"
      >
        <Menu className="h-7 w-7 text-gray-800" />
      </button>

      {/* The single sheet. Its contents depend on which trigger was pressed. */}
      <Sheet open={sheet !== null} onOpenChange={(o) => !o && close()}>
        {sheet === "account" && user && (
          <SheetContent side="right" className="w-[300px] px-0 pt-0">
            <MobileAccountMenu
              user={user}
              initials={initials}
              close={close}
              handleLogout={handleLogout}
            />
          </SheetContent>
        )}

        {sheet === "nav" && (
          <SheetContent side="right" className="w-[300px] px-6">
            <MobileNavMenu
              user={user}
              pathname={pathname}
              t={t}
              tc={tc}
              close={close}
            />
          </SheetContent>
        )}
      </Sheet>
    </div>
  );
}