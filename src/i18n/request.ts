import { getRequestConfig } from "next-intl/server";
import { DEFAULT_LOCALE, isLocale } from "./locales";

/**
 * Locale resolution, per request.
 *
 * The locale comes from the [locale] route segment, not from the cookie
 * directly. That indirection is what makes static rendering possible: reading
 * cookies here forced every route in the app into a per-request serverless
 * render, because the root layout calls into this config.
 *
 * Visitors still never see a locale in the URL. src/proxy.ts reads the cookie
 * and rewrites /about to /en/about internally, so canonical tags, the sitemap
 * and Open Graph URLs stay exactly as they were.
 */
export default getRequestConfig(async ({ requestLocale }) => {
  const requested = await requestLocale;
  const locale = isLocale(requested) ? requested : DEFAULT_LOCALE;

  return {
    locale,
    messages: (await import(`./messages/${locale}.json`)).default,
  };
});
