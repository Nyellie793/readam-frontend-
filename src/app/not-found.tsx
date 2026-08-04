import Link from "next/link";
import { Compass, Home, BookOpen, LifeBuoy } from "lucide-react";
import { getTranslations } from "next-intl/server";

export const metadata = {
  title: "Page not found",
  description: "The page you were looking for does not exist.",
};

/** Shown for unmatched routes and for notFound() calls. */
export default async function NotFound() {
  const t = await getTranslations("common");
  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-50 px-6 py-16">
      <div className="w-full max-w-md rounded-2xl border border-gray-100 bg-white p-8 text-center shadow-sm">
        <span className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
          <Compass className="size-6" />
        </span>

        <p className="mt-5 font-mono text-xs font-semibold uppercase tracking-widest text-gray-400">
          404
        </p>
        <h1 className="mt-2 text-xl font-black text-gray-900">{t("notFoundTitle")}</h1>
        <p className="mx-auto mt-3 max-w-sm text-sm leading-relaxed text-gray-500">
          The link may be out of date, or the page may have moved. Here are a
          few places to pick things back up.
        </p>

        <div className="mt-7 flex flex-col gap-3">
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700"
          >
            <Home className="size-4" />
            Go to the homepage
          </Link>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Link
              href="/courses"
              className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl border border-gray-200 px-5 py-2.5 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-50"
            >
              <BookOpen className="size-4" />
              Browse courses
            </Link>
            <Link
              href="/help"
              className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl border border-gray-200 px-5 py-2.5 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-50"
            >
              <LifeBuoy className="size-4" />
              Help Center
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
