import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/constants";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // Authenticated areas hold no public value and should never be indexed.
      disallow: [
        "/dashboard/",
        "/tutor/",
        "/admin/",
        "/settings",
        "/notifications",
        "/checkout",
        "/payment/",
        "/onboarding-1",
        "/onboarding-2",
        "/welcome-back",
        "/select-role",
        "/reset-password",
      ],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
