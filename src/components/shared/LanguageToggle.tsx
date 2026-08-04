"use client";

import { useLocale, useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { setLocale } from "@/i18n/actions";
import { LOCALES, LOCALE_LABELS, type Locale } from "@/i18n/locales";

/**
 * This used to be `useState("EN")` and nothing else — clicking FR moved the
 * pill and reset on the next navigation. It now writes the locale cookie via a
 * server action and refreshes, so the choice actually applies and persists.
 */
export default function LanguageToggle() {
  const active = useLocale() as Locale;
  const t = useTranslations("nav");
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  function choose(locale: Locale) {
    if (locale === active) return;
    startTransition(async () => {
      await setLocale(locale);
      // Re-render server components with the new locale.
      router.refresh();
    });
  }

  return (
    <div
      role="group"
      aria-label={t("languageSwitch")}
      className="flex items-center gap-0.5 rounded-full border border-gray-200 bg-gray-50 p-1 text-xs font-semibold"
    >
      {LOCALES.map((l) => {
        const isActive = active === l;
        return (
          <button
            key={l}
            type="button"
            aria-pressed={isActive}
            disabled={pending}
            onClick={() => choose(l)}
            className={`relative rounded-full px-3 py-1 leading-none transition-all duration-200 ease-out disabled:opacity-60 ${
              isActive
                ? "bg-blue-600 text-white shadow-sm"
                : "bg-transparent text-gray-500 hover:bg-gray-200/70 hover:text-gray-700"
            }`}
          >
            {LOCALE_LABELS[l].short}
          </button>
        );
      })}
    </div>
  );
}
