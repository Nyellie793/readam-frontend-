/**
 * Minimal hand-rolled service worker — not a full offline app, just enough
 * to (a) satisfy PWA/Lighthouse expectations with a real, useful worker
 * rather than an empty stub, and (b) show a branded offline page instead of
 * the browser's dinosaur when navigation fails with no network.
 *
 * Deliberately does not touch API requests or cross-origin requests: this
 * app is data-driven (live course/dashboard content from the API), so
 * caching those responses would show stale or wrong data offline. Only the
 * static Next.js build output and same-origin images are cached.
 */
const CACHE_NAME = "readam-cache-v1";
const OFFLINE_URL = "/offline";
const PRECACHE_URLS = [OFFLINE_URL, "/icons/icon-192.png"];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(PRECACHE_URLS))
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key)))
      )
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  const { request } = event;
  if (request.method !== "GET") return;

  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;
  if (url.pathname.startsWith("/api/")) return;

  // Page navigations: try the network first (content changes constantly),
  // fall back to the offline page only when the network genuinely fails.
  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request).catch(() => caches.match(OFFLINE_URL))
    );
    return;
  }

  // Static assets (Next.js build output, images, fonts): cache-first, since
  // these are content-hashed and safe to serve stale-then-never-changes.
  if (
    url.pathname.startsWith("/_next/static/") ||
    url.pathname.startsWith("/icons/") ||
    /\.(png|jpg|jpeg|svg|webp|ico|woff2?)$/.test(url.pathname)
  ) {
    event.respondWith(
      caches.match(request).then((cached) => {
        if (cached) return cached;
        return fetch(request).then((response) => {
          if (response.ok) {
            const clone = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
          }
          return response;
        });
      })
    );
  }
});
