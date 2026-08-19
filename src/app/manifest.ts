import type { MetadataRoute } from "next";

/**
 * Web app manifest — Next.js auto-detects this file and injects the
 * <link rel="manifest"> tag into every page's <head>. Together with HTTPS
 * (already true in production), this is what makes the app installable from
 * Chrome/Edge/Android; iOS reads the apple-* meta tags in the root layout
 * instead of this file, since Safari doesn't support the manifest icon spec.
 */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "ReadAM - AI-Powered Exam Prep",
    short_name: "ReadAM",
    description:
      "Study for the GCE and Baccalauréat with an AI tutor that explains step by step, thousands of past questions, and video courses from verified Cameroonian teachers.",
    start_url: "/",
    scope: "/",
    display: "standalone",
    orientation: "portrait-primary",
    background_color: "#ffffff",
    theme_color: "#2563EB",
    categories: ["education"],
    icons: [
      {
        src: "/icons/icon-192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icons/icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icons/icon-512-maskable.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
