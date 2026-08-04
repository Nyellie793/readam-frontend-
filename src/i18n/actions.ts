"use server";

import { cookies } from "next/headers";
import { LOCALE_COOKIE, type Locale } from "./locales";

/**
 * Persist the chosen language.
 *
 * A server action rather than document.cookie so the very next server render
 * already has the new locale — otherwise the page would flash the old language
 * before hydrating.
 */
export async function setLocale(locale: Locale): Promise<void> {
  const store = await cookies();
  store.set(LOCALE_COOKIE, locale, {
    path: "/",
    maxAge: 60 * 60 * 24 * 365,
    sameSite: "lax",
  });
}
