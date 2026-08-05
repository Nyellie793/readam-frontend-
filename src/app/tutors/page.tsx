import Link from "next/link";
import Image from "next/image";
import { Star, BookOpen, GraduationCap, Search } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { getPublicTutors } from "@/lib/public-api";
import { getTranslations } from "next-intl/server";

/**
 * Public tutor directory, rendered from GET /v1/tutors (verified profiles
 * only). A server component, so the content is in the HTML that crawlers and
 * link-preview scrapers receive.
 *
 * This page previously listed eight hardcoded people with invented review
 * counts, ratings and years of experience.
 */

const EXPERIENCE_LABEL: Record<string, string> = {
  less_than_1: "New tutor",
  one_to_three: "1-3 years",
  three_to_five: "3-5 years",
  five_to_ten: "5-10 years",
  ten_plus: "10+ years",
};

function initials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export default async function TutorsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const t = await getTranslations("tutors");
  const { q } = await searchParams;
  const { items, total } = await getPublicTutors({ search: q, pageSize: 48 });

  return (
    <div className="relative min-h-screen bg-white">
      <div className="pointer-events-none absolute right-0 top-0 z-0 h-[50vh] w-[55vw] rounded-full bg-blue-100/40 blur-[120px]" />

      <div className="relative z-10">
        <Navbar />

        <main>
          <section className="mx-auto max-w-7xl px-6 pb-8 pt-16 sm:pt-20">
            <span className="inline-block rounded-full border border-orange-200 bg-orange-50 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-orange-500">
              {t("eyebrow")}
            </span>
            <h1 className="mt-5 text-4xl font-black leading-tight text-gray-900 sm:text-5xl">
              {t("titleLead")} <span className="text-blue-600">{t("titleAccent")}</span>
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-relaxed text-gray-500">
              {t("intro")}
            </p>

            {/* Plain GET form, so search works without JavaScript */}
            <form action="/tutors" className="mt-8 flex max-w-md items-center gap-2">
              <div className="relative flex-1">
                <Search className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-gray-400" />
                <input
                  name="q"
                  defaultValue={q ?? ""}
                  placeholder={t("searchPlaceholder")}
                  aria-label="Search tutors"
                  className="h-11 w-full rounded-full border border-gray-200 bg-white pl-10 pr-4 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </div>
              <button
                type="submit"
                className="rounded-full bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700"
              >
                {t("search")}
              </button>
            </form>
          </section>

          <section className="mx-auto max-w-7xl px-6 pb-20">
            {items.length > 0 ? (
              <>
                <p className="mb-6 text-sm text-gray-400">
                  {total} verified {total === 1 ? "tutor" : "tutors"}
                  {q ? ` matching “${q}”` : ""}
                </p>

                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {items.map((t) => {
                    const name = t.display_name ?? "ReadAM Tutor";
                    return (
                      <Link
                        key={t.user_id}
                        href={`/tutors/${t.user_id}`}
                        className="group flex flex-col rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition-all hover:-translate-y-1 hover:shadow-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
                      >
                        <div className="flex items-center gap-4">
                          {t.avatar_url ? (
                            <Image
                              src={t.avatar_url}
                              alt=""
                              width={56}
                              height={56}
                              className="size-14 rounded-full object-cover"
                            />
                          ) : (
                            <span className="flex size-14 items-center justify-center rounded-full bg-blue-50 text-lg font-bold text-blue-600">
                              {initials(name)}
                            </span>
                          )}
                          <div className="min-w-0">
                            <h2 className="truncate text-base font-bold text-gray-900">{name}</h2>
                            <p className="truncate text-xs text-gray-400">
                              {t.title ?? t.subject ?? "Tutor"}
                            </p>
                          </div>
                        </div>

                        {t.bio && (
                          <p className="mt-4 line-clamp-3 flex-1 text-sm leading-relaxed text-gray-500">
                            {t.bio}
                          </p>
                        )}

                        <div className="mt-5 flex flex-wrap items-center gap-2 border-t border-gray-50 pt-4">
                          {t.subject && (
                            <span className="rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-medium text-blue-600">
                              {t.subject}
                            </span>
                          )}
                          {t.experience_years && EXPERIENCE_LABEL[t.experience_years] && (
                            <span className="rounded-full bg-gray-100 px-3 py-1 text-xs text-gray-500">
                              {EXPERIENCE_LABEL[t.experience_years]}
                            </span>
                          )}
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </>
            ) : (
              /* Launch-time empty state, rather than invented placeholder people */
              <div className="mx-auto max-w-xl rounded-2xl border border-gray-100 bg-white p-10 text-center shadow-sm">
                <span className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
                  <GraduationCap className="size-6" />
                </span>
                <h2 className="mt-5 text-xl font-black text-gray-900">
                  {q ? "No tutors match that search" : "We are onboarding our first tutors"}
                </h2>
                <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-gray-500">
                  {q
                    ? "Try a different name or subject, or browse everyone verified so far."
                    : "Tutor profiles appear here once their identity and teaching background have been verified. In the meantime, the course library and the AI tutor are ready to use."}
                </p>
                <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
                  {q ? (
                    <Link
                      href="/tutors"
                      className="inline-flex items-center justify-center rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-blue-700"
                    >
                      Show all tutors
                    </Link>
                  ) : (
                    <Link
                      href="/signup?role=tutor"
                      className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-blue-700"
                    >
                      <Star className="size-4" />
                      Become a tutor
                    </Link>
                  )}
                  <Link
                    href="/courses"
                    className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-200 px-6 py-3 text-sm font-semibold text-gray-700 transition-colors hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700"
                  >
                    <BookOpen className="size-4" />
                    Browse courses
                  </Link>
                </div>
              </div>
            )}
          </section>
        </main>

        <Footer />
      </div>
    </div>
  );
}
