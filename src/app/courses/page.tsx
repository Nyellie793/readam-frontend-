import Link from "next/link";
import Image from "next/image";
import { Search, BookOpen, Star, PlayCircle, FileText } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { getPublicCourses } from "@/lib/public-api";
import { COURSE_CATEGORIES } from "@/constants/course-categories";
import { initialsOf } from "@/hooks/useStoredUser";
import type { CourseListItem } from "@/types/api.types";

/**
 * Public course catalogue, rendered from GET /v1/courses. A server component,
 * so crawlers and link-preview scrapers receive the real listings.
 *
 * This page previously rendered a hardcoded array of courses with invented
 * instructors ("Dr. Alan Turing") and ratings, and its cards linked to
 * /courses/{id}, a route that did not exist.
 */

function priceLabel(course: CourseListItem): string {
  return course.price === 0 ? "Free" : `${course.price.toLocaleString()} XAF`;
}

function CourseCard({ course }: { course: CourseListItem }) {
  return (
    <Link
      href={`/courses/${course.id}`}
      className="group flex flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition-all hover:-translate-y-1 hover:shadow-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
    >
      <div className="relative aspect-16/10 w-full overflow-hidden bg-gray-100">
        {course.thumbnail_url ? (
          <Image
            src={course.thumbnail_url}
            alt=""
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-gray-300">
            <BookOpen className="size-8" />
          </div>
        )}
        <span className="absolute left-3 top-3 inline-flex items-center gap-1 rounded-full bg-white/95 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-gray-700 shadow-sm">
          {course.has_video ? <PlayCircle className="size-3" /> : <FileText className="size-3" />}
          {course.has_video ? "Video" : "PDF"}
        </span>
      </div>

      <div className="flex flex-1 flex-col p-4">
        <h3 className="line-clamp-2 text-sm font-bold text-gray-900">{course.title}</h3>
        {course.tutor_name && (
          <div className="mt-2 flex items-center gap-2">
            {course.tutor_avatar_url ? (
              <Image
                src={course.tutor_avatar_url}
                alt=""
                width={20}
                height={20}
                className="size-5 shrink-0 rounded-full object-cover"
              />
            ) : (
              <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-blue-50 text-[9px] font-bold text-blue-600">
                {initialsOf(course.tutor_name)}
              </span>
            )}
            <span className="truncate text-xs text-gray-500">{course.tutor_name}</span>
          </div>
        )}

        <div className="mt-auto flex items-center justify-between gap-2 pt-4">
          <span className="text-sm font-black text-blue-600">{priceLabel(course)}</span>
          <div className="flex items-center gap-2 text-xs text-gray-400">
            {course.avg_rating !== null && course.review_count > 0 && (
              <span className="flex items-center gap-1">
                <Star className="size-3 fill-orange-400 text-orange-400" />
                {course.avg_rating.toFixed(1)}
              </span>
            )}
            <span>{course.total_lessons} lessons</span>
          </div>
        </div>
      </div>
    </Link>
  );
}

export default async function CoursesPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; category?: string }>;
}) {
  const { q, category } = await searchParams;
  const { items, total } = await getPublicCourses({
    search: q,
    category,
    pageSize: 48,
  });

  const filtered = !!(q || category);

  return (
    <div className="relative min-h-screen bg-white">
      <div className="pointer-events-none absolute right-0 top-0 z-0 h-[50vh] w-[55vw] rounded-full bg-blue-100/40 blur-[120px]" />

      <div className="relative z-10">
        <Navbar />

        <main>
          <section className="mx-auto max-w-7xl px-6 pb-8 pt-16 sm:pt-20">
            <span className="inline-block rounded-full border border-orange-200 bg-orange-50 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-orange-500">
              Course Library
            </span>
            <h1 className="mt-5 text-4xl font-black leading-tight text-gray-900 sm:text-5xl">
              Everything you need for <span className="text-blue-600">the GCE and Bac</span>
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-relaxed text-gray-500">
              Video lessons, PDF material and past questions, mapped to the
              Cameroonian syllabus and taught by verified tutors.
            </p>

            {/* Plain GET form, so search works without JavaScript */}
            <form action="/courses" className="mt-8 flex max-w-md items-center gap-2">
              <div className="relative flex-1">
                <Search className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-gray-400" />
                <input
                  name="q"
                  defaultValue={q ?? ""}
                  placeholder="Search courses"
                  aria-label="Search courses"
                  className="h-11 w-full rounded-full border border-gray-200 bg-white pl-10 pr-4 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </div>
              <button
                type="submit"
                className="rounded-full bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700"
              >
                Search
              </button>
            </form>

            <div className="mt-5 flex flex-wrap gap-2">
              <Link
                href="/courses"
                className={`rounded-full border px-4 py-1.5 text-xs font-semibold transition-colors ${
                  !category
                    ? "border-blue-600 bg-blue-600 text-white"
                    : "border-gray-200 bg-white text-gray-600 hover:border-blue-300 hover:text-blue-600"
                }`}
              >
                All
              </Link>
              {COURSE_CATEGORIES.map((c) => (
                <Link
                  key={c.value}
                  href={`/courses?category=${encodeURIComponent(c.value)}`}
                  className={`rounded-full border px-4 py-1.5 text-xs font-semibold transition-colors ${
                    category === c.value
                      ? "border-blue-600 bg-blue-600 text-white"
                      : "border-gray-200 bg-white text-gray-600 hover:border-blue-300 hover:text-blue-600"
                  }`}
                >
                  {c.label}
                </Link>
              ))}
            </div>
          </section>

          <section className="mx-auto max-w-7xl px-6 pb-20">
            {items.length > 0 ? (
              <>
                <p className="mb-6 text-sm text-gray-400">
                  {total} {total === 1 ? "course" : "courses"}
                  {q ? ` matching “${q}”` : ""}
                </p>
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {items.map((course) => (
                    <CourseCard key={course.id} course={course} />
                  ))}
                </div>
              </>
            ) : (
              /* Launch-time empty state, rather than invented placeholder courses */
              <div className="mx-auto max-w-xl rounded-2xl border border-gray-100 bg-white p-10 text-center shadow-sm">
                <span className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
                  <BookOpen className="size-6" />
                </span>
                <h2 className="mt-5 text-xl font-black text-gray-900">
                  {filtered ? "No courses match that search" : "The first courses are on their way"}
                </h2>
                <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-gray-500">
                  {filtered
                    ? "Try a different search or category, or browse the full library."
                    : "Our tutors are building the first set of courses now. The AI tutor is already available and can help you with any subject in the meantime."}
                </p>
                <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
                  {filtered ? (
                    <Link
                      href="/courses"
                      className="inline-flex items-center justify-center rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-blue-700"
                    >
                      Show all courses
                    </Link>
                  ) : (
                    <Link
                      href="/signup"
                      className="inline-flex items-center justify-center rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-blue-700"
                    >
                      Try the AI tutor
                    </Link>
                  )}
                  <Link
                    href="/features"
                    className="inline-flex items-center justify-center rounded-xl border border-gray-200 px-6 py-3 text-sm font-semibold text-gray-700 transition-colors hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700"
                  >
                    See what is included
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
