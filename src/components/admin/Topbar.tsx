"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { ChevronDown, Menu } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { clearSession } from "@/lib/auth";
import { ROUTES } from "@/lib/constants";
import { useStoredUser, initialsOf } from "@/hooks/useStoredUser";
import Sidebar from "@/components/admin/Sidebar";
import { startMeasure, endMeasure } from "@/lib/performance";
import { useEffect } from "react";

interface TopbarProps {
  title: string;
  description?: string;
}

export default function Topbar({ title, description }: TopbarProps) {
  // The sheet stayed open after tapping a nav link, covering the page that
  // had just loaded, so the admin menu looked unresponsive on mobile.
  const [navOpen, setNavOpen] = useState(false);
  const router = useRouter();
  const user = useStoredUser();
  const name = user?.full_name ?? "Admin";
  const email = user?.email ?? "";
  const initials = initialsOf(user?.full_name, "AD");

  useEffect(() => {
    if (navOpen) {
      const frame = requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          endMeasure("admin-sidebar-open", 100);
        });
      });
      return () => cancelAnimationFrame(frame);
    }
  }, [navOpen]);

  function handleLogout() {
    clearSession();
    router.push(ROUTES.adminLogin);
  }

  return (
    <header className="sticky top-0 z-30 flex items-center gap-3 border-b border-gray-100 bg-white/90 px-4 py-4 backdrop-blur-md sm:px-6">
      {/* Mobile: hamburger opens the same Sidebar in a Sheet */}
      <Sheet open={navOpen} onOpenChange={setNavOpen}>
        <SheetTrigger
          onClick={() => {
            startMeasure("admin-sidebar-open");
            setNavOpen(true);
          }}
          className="rounded-lg p-2 transition hover:bg-gray-100 lg:hidden touch-manipulation"
          aria-label="Open menu"
        >
          <Menu className="h-5 w-5 text-gray-700" />
        </SheetTrigger>
        <SheetContent side="left" className="w-72 p-0">
          <Sidebar onNavigate={() => setNavOpen(false)} />
        </SheetContent>
      </Sheet>

      <div className="min-w-0 flex-1">
        <h1 className="truncate text-lg font-bold text-gray-900 sm:text-xl">{title}</h1>
        {description && (
          <p className="hidden truncate text-xs text-gray-400 sm:block">{description}</p>
        )}
      </div>

      <DropdownMenu>
        <DropdownMenuTrigger className="flex items-center gap-2 rounded-xl border border-gray-100 py-1.5 pl-1.5 pr-2 transition-colors hover:bg-gray-50">
          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-blue-600 text-xs font-bold text-white">
            {initials || "AD"}
          </span>
          <span className="hidden text-left text-xs leading-tight sm:block">
            <span className="block font-semibold text-gray-800">{name}</span>
            <span className="block text-gray-400">{email}</span>
          </span>
          <ChevronDown className="h-3.5 w-3.5 text-gray-400" />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuItem onClick={() => router.push("/admin/settings")}>
            Account settings
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem className="text-red-600" onClick={handleLogout}>
            Log out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
}
