import type { NextConfig } from "next";

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
};

export default nextConfig;
