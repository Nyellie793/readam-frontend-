"use client";

import Link from "next/link";
import Logo from "../shared/Logo";
import AuthMobileMenu from "./AuthMobileMenu";

type AuthNavbarProps = {
  text: string;
  buttonText: string;
  href: string;
};

export default function AuthNavbar({
  text,
  buttonText,
  href,
}: AuthNavbarProps) {
  return (
    <header className="w-full border-b bg-white/70 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">

        {/* Logo */}
        <Logo />

        {/* RIGHT SIDE */}
        <div className="flex items-center gap-3">

          {/* Desktop text */}
          <span className="hidden sm:inline text-sm text-gray-600">
            {text}
          </span>

          {/* Desktop button */}
          <Link
            href={href}
            className="
              hidden sm:inline-flex
              rounded-xl
              bg-blue-600
              px-5
              py-2
              text-sm
              text-white
              font-medium
              hover:bg-blue-700
              transition
            "
          >
            {buttonText}
          </Link>

          {/* Mobile menu (THIS WAS MISSING) */}
          <div className="sm:hidden">
            <AuthMobileMenu />
          </div>

        </div>

      </div>
    </header>
  );
}