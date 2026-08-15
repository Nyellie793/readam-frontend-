# Edge caching for readamcm.com

## The problem

Every response carries `cache-control: private, no-store`, so nothing caches
anywhere and each navigation is a cold serverless invocation. Measured range
for the same page: **1.1s to 13s**. That variance is the "sometimes it hangs"
complaint.

The cause is next-intl reading the locale cookie during render, which marks all
53 routes dynamic. Confirmed by testing: overriding the header in
`next.config`, dropping `getLocale()` from the root layout, and scoping the
message payload all failed to change it.

## Why a Worker rather than a Cache Rule

The pages vary by the `readam_locale` cookie. Cloudflare cannot include a
cookie in the cache key below Enterprise, and caching without that would serve
one language to every visitor.

## Deploying

1. **Proxy the domain.** Cloudflare DNS → the `readamcm.com` and `www` records
   → switch from grey cloud (DNS only) to orange (Proxied).
2. **SSL/TLS → Overview → Full (strict).** Vercel serves a valid certificate;
   anything less can break the handshake or loop.
3. **Workers & Pages → Create Worker.** Paste `cache-worker.js`, deploy.
4. **Add a route:** `readamcm.com/*` → this worker. Repeat for `www` if that
   host is used directly.

## Verifying

    curl -sI https://readamcm.com/about | grep -i x-readam-cache

First request `MISS`, subsequent `HIT`. To prove the languages stay separate:

    curl -sI -H 'Cookie: readam_locale=fr' https://readamcm.com/about
    curl -s  -H 'Cookie: readam_locale=fr' https://readamcm.com/about | grep -o 'À propos'

The French request must return French content, not a cached English copy.

## Scope, deliberately narrow

Only anonymous GETs to the nine public marketing pages are cached. Anything
carrying an auth cookie, and every route behind sign-in, goes straight to the
origin. Serving one student a page rendered for another would be a far worse
bug than slow loads.

`/courses` and `/tutors` are excluded even though they are public, because they
fetch live catalogue data and a stale list is more confusing than a slow one.
Add them later if the 5-minute window proves acceptable.

## Backing out

Set the DNS records back to grey cloud. Everything returns to the current
behaviour immediately; no code changes are involved.
