"use client";

import { useState } from "react";

const LANGUAGES = ["EN", "FR"] as const;
type Language = (typeof LANGUAGES)[number];

export default function LanguageToggle() {
  const [lang, setLang] = useState<Language>("EN");

  return (
    <div
      role="group"
      aria-label="Language switch"
      className="flex items-center gap-0.5 rounded-full border border-gray-200 bg-gray-50 p-1 text-xs font-semibold"
    >
      {LANGUAGES.map((l) => {
        const active = lang === l;

        return (
          <button
            key={l}
            type="button"
            aria-pressed={active}
            onClick={() => setLang(l)}
            className={`
              relative rounded-full px-3 py-1 leading-none
              transition-all duration-250 ease-out
              ${
                active
                  ? "bg-blue-600 text-white shadow-sm"
                  : "bg-transparent text-gray-500 hover:bg-gray-200/70 hover:text-gray-700"
              }
            `}
          >
            {l}
          </button>
        );
      })}
    </div>
  );
}
