"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/Input";
import { useTranslations } from "next-intl";

/**
 * Search across the course catalogue.
 *
 * This was a bare <form> with no submit control, so the only way to run a
 * search was to guess that Enter would do it — and on a phone the keyboard
 * shows "return", not "search", so most people typed and waited. It now has a
 * visible button, submits on Enter, and asks the mobile keyboard for a search
 * key. The project also avoids native form submission, which this no longer
 * relies on.
 */
export default function DashboardSearch() {
  const t = useTranslations("dash");
  const router = useRouter();
  const [value, setValue] = useState("");

  function submit() {
    const q = value.trim();
    if (!q) return;
    router.push(`/dashboard/courses?search=${encodeURIComponent(q)}`);
  }

  return (
    <div className="relative w-full lg:max-w-md">
      <Search className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-gray-400" />

      <Input
        type="search"
        value={value}
        // Tells the mobile keyboard to show a search key rather than return.
        enterKeyHint="search"
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            submit();
          }
        }}
        placeholder={t("searchCoursesShort")}
        className="h-12 w-full rounded-full border-gray-200 bg-white pl-12 pr-24 shadow-sm"
      />

      <button
        type="button"
        onClick={submit}
        disabled={!value.trim()}
        className="absolute right-1.5 top-1/2 -translate-y-1/2 rounded-full bg-blue-600 px-4 py-2 text-xs font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-40"
      >
        {t("search")}
      </button>
    </div>
  );
}
