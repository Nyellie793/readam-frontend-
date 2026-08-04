import { cookies } from "next/headers";
import { getRequestConfig } from "next-intl/server";
import { DEFAULT_LOCALE, LOCALE_COOKIE, isLocale } from "./locales";

/**
 * Locale resolution, per request.
 *
 * Deliberately cookie-based rather than URL-prefixed (/en/…, /fr/…). Prefixed
 * routing would change every URL on the site, invalidating the canonical tags,
 * sitemap and Open Graph URLs, and breaking any link already shared. The
 * trade-off is that a locale cannot be linked to directly, which matters far
 * less here than keeping URLs stable.
 */
export default getRequestConfig(async () => {
  const store = await cookies();
  const cookieValue = store.get(LOCALE_COOKIE)?.value;
  const locale = isLocale(cookieValue) ? cookieValue : DEFAULT_LOCALE;

  return {
    locale,
    messages: (await import(`./messages/${locale}.json`)).default,
  };
});
