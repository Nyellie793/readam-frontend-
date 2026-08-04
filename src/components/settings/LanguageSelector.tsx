"use client";

import { useTransition } from "react";
import { useLocale, useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/Card";
import { Check, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { setLocale } from "@/i18n/actions";
import { LOCALES, LOCALE_LABELS, type Locale } from "@/i18n/locales";

const FLAG: Record<Locale, string> = { en: "🇬🇧", fr: "🇨🇲" };

/**
 * The settings language picker.
 *
 * It previously held its own useState and fired a success toast without
 * changing anything — the selection reset on reload and no text was ever
 * translated. It now shares the same locale cookie as the header toggle, so
 * the two always agree.
 */
export default function LanguageSelector() {
  const active = useLocale() as Locale;
  const t = useTranslations("settings");
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  function choose(locale: Locale) {
    if (locale === active || pending) return;
    startTransition(async () => {
      await setLocale(locale);
      router.refresh();
      toast.success(t("languageChanged", { language: LOCALE_LABELS[locale].full }));
    });
  }

  return (
    <Card className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
      <CardContent className="p-6">
        <div className="space-y-4">
          <div>
            <h3 className="text-sm font-bold text-gray-800">{t("languageTitle")}</h3>
            <p className="mt-1 text-xs text-gray-500">{t("languageBody")}</p>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {LOCALES.map((l) => {
              const isActive = active === l;
              return (
                <button
                  key={l}
                  type="button"
                  onClick={() => choose(l)}
                  disabled={pending}
                  aria-pressed={isActive}
                  className={`flex items-center justify-between rounded-xl border p-4 text-left transition-all disabled:opacity-60 ${
                    isActive
                      ? "border-blue-600 bg-blue-50/40 text-blue-900 ring-1 ring-blue-600"
                      : "border-gray-200 text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xl" aria-hidden="true">
                      {FLAG[l]}
                    </span>
                    <div>
                      <p className="text-xs font-bold">{LOCALE_LABELS[l].full}</p>
                      <p className="mt-0.5 text-[11px] text-gray-400">{LOCALE_LABELS[l].note}</p>
                    </div>
                  </div>
                  {pending && !isActive ? (
                    <Loader2 className="size-4 shrink-0 animate-spin text-blue-600" />
                  ) : (
                    isActive && <Check className="size-4 shrink-0 text-blue-600" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
