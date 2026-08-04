"use client";

import Link from "next/link";
import { PlayCircle } from "lucide-react";
import { useTranslations } from "next-intl";
import { useStoredUser } from "@/hooks/useStoredUser";

/**
 * Both hero CTAs were plain <button> elements with no handler, so neither did
 * anything.
 *
 * "Book a Lesson" is auth-aware: a signed-in user goes straight to the AI
 * tutor, everyone else is sent to sign in first. useStoredUser returns null
 * during SSR and the real session after hydration, so the href settles on the
 * right destination without a hydration mismatch.
 */
export default function HeroButtons() {
  const t = useTranslations("hero");
  const user = useStoredUser();
  const bookHref = user ? "/dashboard/ai-tutor/ai-hub" : "/login";

  return (
    <div className="mt-6 flex flex-wrap items-center gap-3">
      <Link
        href={bookHref}
        className="rounded-xl bg-orange-500 px-7 py-3.5 text-sm font-bold text-white shadow-sm transition hover:bg-orange-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-500"
      >
        {t("bookLesson")}
      </Link>

      <Link
        href="/courses"
        className="flex items-center gap-2 rounded-xl border border-blue-400 bg-white px-7 py-3.5 text-sm font-semibold text-gray-700 transition hover:shadow-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500"
      >
        <PlayCircle className="h-4 w-4 text-gray-500" />
        {t("browseVideos")}
      </Link>
    </div>
  );
}
