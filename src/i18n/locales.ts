/** Supported interface languages. */
export const LOCALES = ["en", "fr"] as const;
export type Locale = (typeof LOCALES)[number];

export const DEFAULT_LOCALE: Locale = "en";

/** Cookie holding the chosen language. Read on the server to pick messages. */
export const LOCALE_COOKIE = "readam_locale";

export const LOCALE_LABELS: Record<Locale, { short: string; full: string; note: string }> = {
  en: { short: "EN", full: "English (UK)", note: "System default language" },
  fr: { short: "FR", full: "Français (Cameroun)", note: "Langue officielle du Cameroun" },
};

export function isLocale(value: string | undefined): value is Locale {
  return !!value && (LOCALES as readonly string[]).includes(value);
}
