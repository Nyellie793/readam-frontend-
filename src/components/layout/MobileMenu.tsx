"use client";

import Link from "next/link";

import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";

import { Menu } from "lucide-react";

import { NAV_LINKS } from "@/constants/navigation";
import { usePathname } from "next/navigation";

import LanguageToggle from "../shared/LanguageToggle";
import ThemeToggle from "../shared/ThemeToggle";
import Logo from "../shared/Logo";

export default function MobileMenu() {
  return (
    <Sheet>
      <SheetTrigger
        className="
        rounded-lg
        p-2
        transition
        hover:bg-gray-100
        "
      >
        <Menu className="h-8 w-8 text-gray-800" />
      </SheetTrigger>

      <SheetContent
        side="right"
        className="w-[300px] px-6"
      >
        <div className="flex h-full flex-col">

          {/* Logo */}

          <div className="border-b py-6">
            <Logo />
          </div>

          {/* Navigation */}

          <nav className="flex flex-1 flex-col gap-2 py-8">

            {NAV_LINKS.map((link) => (
              <Link
                key={link.title}
                href={link.href}
                className="
                rounded-lg
                px-4
                py-3

                text-lg
                font-medium
                text-gray-700

                transition

                hover:bg-blue-50
                hover:text-blue-600
                "
              >
                {link.title}
              </Link>
            ))}

          </nav>

          {/* Language + Theme */}

          <div className="border-t py-6">

            <p className="mb-3 text-sm font-semibold text-gray-500">
              Language
            </p>

            <div className="flex items-center justify-between gap-3">
              <LanguageToggle />
              <ThemeToggle />
            </div>

          </div>

          {/* Login */}

          <div className="pb-6">

            <Link
              href="/login"
              className="
              w-full
              rounded-xl
              bg-blue-600
              py-3
              px-6
              font-semibold
              text-white
              transition
              hover:bg-blue-700
              "
            >
              Login
            </Link>

          </div>

        </div>
      </SheetContent>
    </Sheet>
  );
}