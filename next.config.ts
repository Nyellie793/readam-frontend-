import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

// Locale is resolved per request from a cookie — see src/i18n/request.ts.
const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

const nextConfig: NextConfig = {
  turbopack: {
    root: __dirname,
  },
  images: {
    /**
     * next/image refuses to load any host that is not listed here, and fails
     * silently — a broken image with no console error in production.
     *
     * Only picsum.photos was allowlisted, which is placeholder imagery. Every
     * genuinely uploaded asset (course thumbnails, tutor and student avatars,
     * lesson attachments) is served from the R2 public bucket, so none of them
     * rendered. The wildcard covers the bucket's pub-<id>.r2.dev host without
     * hardcoding the account id.
     */
    remotePatterns: [
      { protocol: "https", hostname: "**.r2.dev" },
      { protocol: "https", hostname: "**.r2.cloudflarestorage.com" },
      // Google account photos, for users who signed in with Google.
      { protocol: "https", hostname: "lh3.googleusercontent.com" },
      { protocol: "https", hostname: "picsum.photos" },
    ],
  },

  // Baseline security headers (Next.js's own PWA guide). Deliberately no
  // site-wide Content-Security-Policy here — Google OAuth and the payment
  // provider flows aren't audited against one yet, so a blanket CSP risks
  // silently breaking them. /sw.js gets a narrow same-origin-script CSP
  // since a service worker script has no legitimate reason to load anything
  // else, plus no-cache so clients always fetch the latest version.
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
        ],
      },
      {
        source: "/sw.js",
        headers: [
          { key: "Content-Type", value: "application/javascript; charset=utf-8" },
          { key: "Cache-Control", value: "no-cache, no-store, must-revalidate" },
          { key: "Content-Security-Policy", value: "default-src 'self'; script-src 'self'" },
        ],
      },
    ];
  },
};

export default withNextIntl(nextConfig);
