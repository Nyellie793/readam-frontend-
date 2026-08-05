import type { Metadata } from "next";
import Link from "next/link";
import { PenLine, Mail } from "lucide-react";
import PageShell from "@/components/layout/PageShell";
import { CONTACT } from "@/constants/branding";
import { getTranslations } from "next-intl/server";

export const metadata: Metadata = {
  title: "Blog | ReadAM",
  description:
    "Study guides, exam technique and product updates from the ReadAM team. The first articles are on the way.",
};

/**
 * No posts yet. Rather than shipping invented articles, this is an honest empty
 * state that points readers at the study material that does exist. Replace the
 * empty state with a post list once the first articles are written.
 */

export default async function BlogPage() {
  const t = await getTranslations("blog");
  const PLANNED = [
    t("p1"),
    t("p2"),
    t("p3"),
    t("p4"),
  ];
  return (
    <PageShell
      eyebrow={t("eyebrow")}
      title={<>{t("titleLead")} <span className="text-blue-600">{t("titleAccent")}</span></>}
      intro={t("intro")}
    >
      <div className="rounded-2xl border border-gray-100 bg-white p-8 text-center shadow-sm sm:p-12">
        <span className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
          <PenLine className="size-6" />
        </span>

        <h2 className="mt-5 text-2xl font-black text-gray-900">{t("comingTitle")}</h2>
        <p className="mx-auto mt-3 max-w-lg text-sm leading-relaxed text-gray-500">
          We would rather publish nothing than publish filler. Our teaching team is writing the first
          set of guides now. Here is what is coming:
        </p>

        <ul className="mx-auto mt-7 max-w-lg space-y-3 text-left">
          {PLANNED.map((title) => (
            <li
              key={title}
              className="rounded-xl border border-gray-100 bg-gray-50/60 px-4 py-3 text-sm font-medium text-gray-700"
            >
              {title}
            </li>
          ))}
        </ul>

        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <a
            href={`mailto:${CONTACT.email}?subject=${encodeURIComponent("Tell me when the ReadAM blog launches")}`}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-blue-700"
          >
            <Mail className="size-4" />
            {t("notifyMe")}
          </a>
          <Link
            href="/courses"
            className="inline-flex items-center justify-center rounded-xl border border-gray-200 px-6 py-3 text-sm font-semibold text-gray-700 transition-colors hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700"
          >
            {t("browseInstead")}
          </Link>
        </div>
      </div>

      <div className="mt-8 rounded-2xl border border-orange-200 bg-orange-50 p-6">
        <h3 className="text-sm font-bold text-orange-900">{t("writeTitle")}</h3>
        <p className="mt-1.5 text-sm leading-relaxed text-orange-900/80">
          {t.rich("writeBody", {
            mail: () => (
              <a
                className="font-semibold text-orange-900 hover:underline"
                href={`mailto:${CONTACT.email}`}
              >
                {CONTACT.email}
              </a>
            ),
          })}
        </p>
      </div>
    </PageShell>
  );
}
