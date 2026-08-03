import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/constants";

/**
 * Only public, indexable routes belong here. Everything behind auth
 * (/dashboard, /tutor, /admin, /settings, /checkout, /payment) is excluded and
 * additionally disallowed in robots.ts.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const routes: { path: string; priority: number; changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"] }[] = [
    { path: "/",         priority: 1.0, changeFrequency: "weekly" },
    { path: "/courses",  priority: 0.9, changeFrequency: "daily" },
    { path: "/features", priority: 0.8, changeFrequency: "monthly" },
    { path: "/tutors",   priority: 0.8, changeFrequency: "weekly" },
    { path: "/about",    priority: 0.6, changeFrequency: "monthly" },
    { path: "/help",     priority: 0.6, changeFrequency: "monthly" },
    { path: "/faq",      priority: 0.6, changeFrequency: "monthly" },
    { path: "/contact",  priority: 0.5, changeFrequency: "yearly" },
    { path: "/blog",     priority: 0.5, changeFrequency: "weekly" },
    { path: "/terms",    priority: 0.3, changeFrequency: "yearly" },
    { path: "/privacy",  priority: 0.3, changeFrequency: "yearly" },
  ];

  return routes.map(({ path, priority, changeFrequency }) => ({
    url: `${SITE_URL}${path}`,
    lastModified: now,
    changeFrequency,
    priority,
  }));
}
