import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { BookOpen, Lock, PlayCircle, FileText, ArrowLeft, Check } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { getPublicCourse } from "@/lib/public-api";
import { initialsOf } from "@/hooks/useStoredUser";
import { getTranslations } from "next-intl/server";

/**
 * Public course detail. The catalogue used to link here from /courses even
 * though this route did not exist, so every card 404'd.
 *
 * The API exposes course metadata (modules, lesson titles, durations) publicly
 * but keeps lesson *content* behind enrolment, so this page can show what a
 * course covers without giving the material away.
 */

export async function generateMetadata({
  params,
}: {
  params: Promise<{ courseId: string }>;
}): Promise<Metadata> {
  const { courseId } = await params;
  const course = await getPublicCourse(courseId);
  if (!course) return { title: "Course not found" };

  return {
    title: course.title,
    description:
      course.description?.slice(0, 160) ??
      `${course.title} on ReadAM — study with video lessons, PDFs and an AI tutor.`,
    alternates: { canonical: `/courses/${courseId}` },
    openGraph: {
      title: course.title,
      description: course.description ?? undefined,
      images: course.thumbnail_url ? [course.thumbnail_url] : undefined,
    },
  };
}

function formatDuration(seconds: number | null): string | null {
  if (!seconds) return null;
  const mins = Math.round(seconds / 60);
  return mins < 60 ? `${mins} min` : `${Math.floor(mins / 60)}h ${mins % 60}m`;
}

export default async function PublicCoursePage({
  params,
}: {
  params: Promise<{ courseId: string }>;
}) {
  const t = await getTranslations("courses");
  const { courseId } = await params;
  const course = await getPublicCourse(courseId);
  if (!course) notFound();

  const modules = [...(course.modules ?? [])].sort((a, b) => a.order - b.order);
  const lessonCount = modules.reduce((n, m) => n + (m.lessons?.length ?? 0), 0);
  const isFree = course.price === 0;

  return (
    <div className="relative min-h-screen bg-white">
      <div className="pointer-events-none absolute right-0 top-0 z-0 h-[45vh] w-[50vw] rounded-full bg-blue-100/40 blur-[120px]" />

      <div className="relative z-10">
        <Navbar />

        <main className="mx-auto max-w-6xl px-6 pb-20 pt-10">
          <Link
            href="/courses"
            className="inline-flex items-center gap-2 text-sm font-medium text-gray-500 transition-colors hover:text-blue-600"
          >
            <ArrowLeft className="size-4" />
            All courses
          </Link>

          <div className="mt-8 grid gap-10 lg:grid-cols-[1fr_320px] lg:items-start">
            {/* Main */}
            <div className="min-w-0">
              <h1 className="text-3xl font-black leading-tight text-gray-900 sm:text-4xl">
                {course.title}
              </h1>

              {course.tutor_name && (
                <Link
                  href={`/tutors/${course.tutor_id}`}
                  className="mt-4 inline-flex items-center gap-2.5 rounded-full border border-gray-100 bg-white py-1.5 pl-1.5 pr-4 shadow-sm transition-colors hover:border-blue-200 hover:bg-blue-50/40"
                >
                  {course.tutor_avatar_url ? (
                    <Image
                      src={course.tutor_avatar_url}
                      alt=""
                      width={32}
                      height={32}
                      className="size-8 shrink-0 rounded-full object-cover"
                    />
                  ) : (
                    <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-blue-50 text-xs font-bold text-blue-600">
                      {initialsOf(course.tutor_name)}
                    </span>
                  )}
                  <span className="text-sm">
                    <span className="text-gray-400">{t("taughtBy")} </span>
                    <span className="font-semibold text-gray-900">{course.tutor_name}</span>
                  </span>
                </Link>
              )}

              <div className="mt-5 flex flex-wrap gap-2">
                <span className="rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-medium text-blue-600">
                  {course.category.replace(/_/g, " ")}
                </span>
                <span className="rounded-full bg-gray-100 px-3 py-1 text-xs text-gray-600">
                  {modules.length} {modules.length === 1 ? "module" : "modules"}
                </span>
                <span className="rounded-full bg-gray-100 px-3 py-1 text-xs text-gray-600">
                  {lessonCount} {lessonCount === 1 ? "lesson" : "lessons"}
                </span>
              </div>

              {course.description && (
                <p className="mt-6 text-base leading-relaxed text-gray-600">{course.description}</p>
              )}

              <h2 className="mt-10 text-xl font-bold text-gray-900">{t("covers")}</h2>

              {modules.length > 0 ? (
                <div className="mt-4 space-y-4">
                  {modules.map((m) => (
                    <div
                      key={m.id}
                      className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm"
                    >
                      <div className="border-b border-gray-50 bg-gray-50/60 px-5 py-3">
                        <h3 className="text-sm font-bold text-gray-900">{m.title}</h3>
                      </div>
                      <ul className="divide-y divide-gray-50">
                        {[...(m.lessons ?? [])]
                          .sort((a, b) => a.order - b.order)
                          .map((l) => {
                            const duration = formatDuration(l.duration_seconds);
                            return (
                              <li
                                key={l.id}
                                className="flex items-center gap-3 px-5 py-3 text-sm text-gray-700"
                              >
                                {l.type === "video" ? (
                                  <PlayCircle className="size-4 shrink-0 text-gray-400" />
                                ) : (
                                  <FileText className="size-4 shrink-0 text-gray-400" />
                                )}
                                <span className="min-w-0 flex-1 truncate">{l.title}</span>
                                {l.is_preview ? (
                                  <span className="shrink-0 rounded-full bg-teal-50 px-2.5 py-0.5 text-[11px] font-semibold text-teal-600">
                                    Free preview
                                  </span>
                                ) : (
                                  <Lock className="size-3.5 shrink-0 text-gray-300" />
                                )}
                                {duration && (
                                  <span className="shrink-0 text-xs text-gray-400">{duration}</span>
                                )}
                              </li>
                            );
                          })}
                      </ul>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="mt-4 text-sm text-gray-500">
                  The outline for this course is being finalised.
                </p>
              )}
            </div>

            {/* Purchase panel */}
            <aside className="lg:sticky lg:top-24">
              <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
                <div className="relative aspect-16/10 w-full bg-gray-100">
                  {course.thumbnail_url ? (
                    <Image
                      src={course.thumbnail_url}
                      alt=""
                      fill
                      sizes="320px"
                      className="object-cover"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-gray-300">
                      <BookOpen className="size-8" />
                    </div>
                  )}
                </div>

                <div className="p-5">
                  <p className="text-2xl font-black text-gray-900">
                    {isFree ? "Free" : `${course.price.toLocaleString()} XAF`}
                  </p>

                  <Link
                    href={isFree ? "/signup" : `/checkout?course=${course.id}`}
                    className="mt-4 block rounded-xl bg-blue-600 px-4 py-3 text-center text-sm font-bold text-white transition-colors hover:bg-blue-700"
                  >
                    {isFree ? "Start learning free" : "Get this course"}
                  </Link>

                  <p className="mt-3 text-center text-[11px] text-gray-400">
                    You will be asked to sign in first.
                  </p>

                  <ul className="mt-5 space-y-2.5 border-t border-gray-50 pt-5">
                    {[
                      `${lessonCount} ${lessonCount === 1 ? "lesson" : "lessons"}`,
                      "Study on any phone or laptop",
                      "AI tutor support while you learn",
                    ].map((f) => (
                      <li key={f} className="flex items-start gap-2 text-xs text-gray-600">
                        <Check className="mt-0.5 size-3.5 shrink-0 text-teal-600" />
                        {f}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </aside>
          </div>
        </main>

        <Footer />
      </div>
    </div>
  );
}
