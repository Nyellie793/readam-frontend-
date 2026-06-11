"use client";

import { useState } from "react";

export default function LanguageToggle() {
  const [lang, setLang] = useState<"EN" | "FR">("EN");

  return (
    <div className="flex items-center rounded-full border border-gray-200 text-xs font-medium overflow-hidden w-fit">
      {(["EN", "FR"] as const).map((l) => (
        <button
          key={l}
          onClick={() => setLang(l)}
          className={`px-2 py-1 transition leading-none ${
            lang === l
              ? "bg-gray-100 text-gray-900"
              : "text-gray-400 hover:text-gray-600"
          }`}
        >
          {l}
        </button>
      ))}
    </div>
  );
}