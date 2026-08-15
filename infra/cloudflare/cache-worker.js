/**
 * Edge cache for readamcm.com, keyed on path + locale.
 *
 * Why this exists
 * ───────────────
 * Every page is server-rendered per request, because next-intl reads the
 * locale cookie during render and that marks all routes dynamic. Next then
 * sends `cache-control: private, no-store`, so nothing caches — not Vercel's
 * edge, not the browser. Every navigation is a cold serverless invocation,
 * measured between 1.1s and 13s for the same page. That spread is why the site
 * feels fine sometimes and frozen other times.
 *
 * Cloudflare's built-in Cache Rules cannot vary on a cookie below Enterprise,
 * and caching these pages without varying on `readam_locale` would serve one
 * language to everyone. So the cache key is built here instead.
 *
 * What is cached
 * ──────────────
 * Only public marketing pages, and only for anonymous visitors. Anything
 * behind sign-in is served straight from the origin, every time. Getting that
 * wrong would leak one student's page to another, which is far worse than the
 * problem being solved.
 */

const CACHEABLE_PATHS = new Set([
  "/", "/about", "/features", "/faq", "/blog",
  "/terms", "/privacy", "/help", "/contact",
]);

/** Signed-in users must never be served another person's rendered page. */
const AUTH_COOKIES = ["readam_auth", "readam_access_token"];

const EDGE_TTL_SECONDS = 300;      // 5 minutes at the edge
const STALE_TTL_SECONDS = 86_400;  // serve stale for a day if the origin is down

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    // Only GET is ever cacheable.
    if (request.method !== "GET") return fetch(request);

    const cookies = request.headers.get("Cookie") || "";
    const isAuthed = AUTH_COOKIES.some((c) => cookies.includes(`${c}=`));

    if (isAuthed || !CACHEABLE_PATHS.has(url.pathname)) {
      return fetch(request);
    }

    // The locale is part of the identity of the response, so it is part of the
    // key. Anything other than "fr" is treated as the default.
    const locale = /(?:^|;\s*)readam_locale=fr(?:;|$)/.test(cookies) ? "fr" : "en";

    const cacheKey = new Request(`${url.origin}${url.pathname}__${locale}`, {
      method: "GET",
    });
    const cache = caches.default;

    let response = await cache.match(cacheKey);
    if (response) {
      response = new Response(response.body, response);
      response.headers.set("x-readam-cache", "HIT");
      return response;
    }

    response = await fetch(request);

    // Only store a good response. Caching a 500 would pin the outage in place.
    if (response.status === 200) {
      const toStore = new Response(response.body, response);
      // Next sends no-store; that instruction is for the browser, not for us.
      toStore.headers.set(
        "Cache-Control",
        `public, max-age=0, s-maxage=${EDGE_TTL_SECONDS}, stale-while-revalidate=${STALE_TTL_SECONDS}`
      );
      // Never let a shared cache key be reused across languages by accident.
      toStore.headers.set("Vary", "Cookie");
      toStore.headers.set("x-readam-cache", "MISS");

      // Clone before returning: the body can only be read once.
      ctx.waitUntil(cache.put(cacheKey, toStore.clone()));
      return toStore;
    }

    return response;
  },
};
