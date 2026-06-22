"use client";

import { useState } from "react";
import { Sun, Moon } from "lucide-react";

/**
 * UI-only theme switch (Task 2).
 *
 * This is intentionally NOT wired to next-themes / a ThemeProvider yet.
 * It manages its own placeholder boolean state so the pill animates and
 * looks correct in isolation.
 *
 * To make it functional later:
 *   1. Wrap the app with next-themes' <ThemeProvider> (already a dependency).
 *   2. Replace the local `useState` below with `useTheme()` from "next-themes".
 *   3. Replace `setIsDark(!isDark)` with `setTheme(isDark ? "light" : "dark")`.
 * The markup/props below don't need to change.
 */
export default function ThemeToggle() {
  const [isDark, setIsDark] = useState(false);

  return (
    <button
      type="button"
      role="switch"
      aria-checked={isDark}
      aria-label="Toggle theme"
      onClick={() => setIsDark((prev) => !prev)}
      className={`
        relative inline-flex h-7 w-14 shrink-0 items-center rounded-full
        border border-gray-200
        transition-colors duration-300 ease-out
        ${isDark ? "bg-gray-900" : "bg-gray-100"}
      `}
    >
      {/* Static icons sit at each end so the moving thumb "reveals" them */}
      <Sun
        className={`
          absolute left-1.5 h-3.5 w-3.5 transition-opacity duration-300
          ${isDark ? "text-gray-500 opacity-40" : "text-orange-400 opacity-100"}
        `}
      />
      <Moon
        className={`
          absolute right-1.5 h-3.5 w-3.5 transition-opacity duration-300
          ${isDark ? "text-blue-300 opacity-100" : "text-gray-400 opacity-40"}
        `}
      />

      {/* Sliding thumb */}
      <span
        className={`
          relative z-10 flex h-5.5 w-5.5 items-center justify-center
          rounded-full bg-white shadow-md ring-1 ring-black/5
          transition-transform duration-300 ease-out
          ${isDark ? "translate-x-[28px]" : "translate-x-1"}
        `}
      >
        {isDark ? (
          <Moon className="h-3 w-3 text-gray-900" />
        ) : (
          <Sun className="h-3 w-3 text-orange-500" />
        )}
      </span>
    </button>
  );
}
