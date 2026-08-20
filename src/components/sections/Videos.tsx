import Image from "next/image";
import { getTranslations } from "next-intl/server";
import Link from "next/link";
import { Play, Star, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getPublicCourses } from "@/lib/public-api";
import { initialsOf } from "@/lib/initials";

/**
 * Real published courses, three of them.
 *
 * This section used to be three hardcoded entries — invented tutors, invented
 * ratings, invented lesson counts and placeholder thumbnails. It looked like
 * the catalogue while showing nothing that existed, so every card led to a
 * course a visitor could never find.
 *
 * getPublicCourses caches for 5 minutes, so the landing page is not waiting on
 * the API on every request.
 */
export default async function Videos() {
  const t = await getTranslations("home");
  const { items } = await getPublicCourses({ pageSize: 3 });

  // Nothing published yet. An empty grid under a heading reads as broken, so
  // say so plainly and point at the catalogue.
  if (items.length === 0) {
    return (
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-20">
        <div className="mb-8 text-center sm:mb-10">
          <h2 className="text-2xl font-black text-gray-900 sm:text-3xl">{t("videosTitle")}</h2>
        </div>
        <div className="rounded-2xl border border-gray-100 bg-gray-50/60 px-6 py-14 text-center">
          <BookOpen className="mx-auto size-8 text-gray-300" />
          <p className="mt-3 text-sm text-gray-500">{t("noCoursesYet")}</p>
          <Link href="/courses" className="mt-4 inline-block">
            <Button className="rounded-xl bg-blue-600 text-sm text-white hover:bg-blue-700">
              {t("viewCourses")}
            </Button>
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-20">
      <div className="mb-8 text-center sm:mb-10">
        <h2 className="text-2xl font-black text-gray-900 sm:text-3xl">{t("videosTitle")}</h2>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3 lg:gap-6">
        {items.map((course) => (
          <Link
            key={course.id}
            href={`/courses/${course.id}`}
            className="group overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl sm:rounded-2xl"
          >
            {/* Thumbnail */}
            <div className="relative h-36 w-full overflow-hidden bg-gray-900 sm:h-44">
              {course.thumbnail_url ? (
                <Image
                  src={course.thumbnail_url}
                  alt=""
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-cover opacity-80 transition-transform duration-500 group-hover:scale-105"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-blue-700 to-indigo-800">
                  <BookOpen className="size-8 text-white/40" />
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />

              {/* Only a course that actually has video earns the play badge. */}
              {course.has_video && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full border border-white/40 bg-white/20 shadow-lg backdrop-blur-sm transition-transform duration-300 group-hover:scale-110">
                    <Play className="h-4 w-4 fill-white text-white" />
                  </div>
                </div>
              )}
            </div>

            {/* Card body */}
            <div className="p-3 sm:p-4">
              <h3 className="line-clamp-1 text-sm font-bold text-gray-900 sm:text-base">
                {course.title}
              </h3>

              <div className="mt-2 flex items-center justify-between gap-2">
                <div className="flex min-w-0 items-center gap-1.5">
                  {course.tutor_avatar_url ? (
                    <div className="relative size-5 shrink-0 overflow-hidden rounded-full bg-gray-200 ring-1 ring-gray-100 sm:size-6">
                      <Image src={course.tutor_avatar_url} alt="" fill sizes="24px" className="object-cover" />
                    </div>
                  ) : (
                    <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-blue-50 text-[9px] font-bold text-blue-600 sm:size-6">
                      {initialsOf(course.tutor_name)}
                    </span>
                  )}
                  <span className="truncate text-[11px] text-gray-500 sm:text-xs">
                    {course.tutor_name}
                  </span>
                </div>

                <div className="flex shrink-0 items-center gap-1">
                  {/* A course with no reviews has no rating. Printing 0.0 would
                      read as a bad course rather than a new one. */}
                  {course.avg_rating !== null && course.review_count > 0 && (
                    <>
                      <Star className="h-3 w-3 fill-orange-400 text-orange-400" />
                      <span className="text-[11px] font-semibold text-gray-700 sm:text-xs">
                        {course.avg_rating.toFixed(1)}
                      </span>
                    </>
                  )}
                  <span className="text-[11px] text-gray-400 sm:text-xs">
                    {t("videosCount", { count: course.total_lessons })}
                  </span>
                </div>
              </div>

              <div className="mt-3 sm:mt-4">
                <Button className="h-8 w-full rounded-lg bg-blue-600 text-xs text-white hover:bg-blue-700 sm:h-9 sm:rounded-xl sm:text-sm">
                  {t("viewCourses")}
                </Button>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
