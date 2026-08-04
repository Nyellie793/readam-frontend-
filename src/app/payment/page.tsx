import Link from "next/link";
import { Sparkles, FileText, BookOpen, ArrowRight, ShieldCheck } from "lucide-react";
import Sidebar from "@/components/layout/Sidebar";
import Topbar from "@/components/layout/Topbar";
import { getTranslations } from "next-intl/server";

/**
 * Plans hub.
 *
 * This page previously listed four hardcoded "GCE" packages with invented
 * prices that led to a simulated checkout. Those plans did not exist in the
 * API and no money ever moved. It now points at the two purchase flows that
 * are genuinely wired to the payment provider, plus per-course purchase.
 */
const OPTIONS = [
  {
    href: "/payment/ai-sessions",
    icon: Sparkles,
    tone: "bg-violet-50 text-violet-600",
    titleKey: "optAiTitle",
    bodyKey: "optAiBody",
    ctaKey: "optAiCta",
  },
  {
    href: "/payment/past-questions",
    icon: FileText,
    tone: "bg-orange-50 text-orange-500",
    titleKey: "optPastTitle",
    bodyKey: "optPastBody",
    ctaKey: "optPastCta",
  },
  {
    href: "/dashboard/courses",
    icon: BookOpen,
    tone: "bg-blue-50 text-blue-600",
    titleKey: "optCourseTitle",
    bodyKey: "optCourseBody",
    ctaKey: "optCourseCta",
  },
];

export default async function PlansPage() {
  const t = await getTranslations("payment");
  return (
    <div className="flex min-h-screen bg-gray-50/50">
      <aside className="hidden w-64 shrink-0 lg:block">
        <div className="fixed h-screen w-64">
          <Sidebar />
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar />

        <main className="max-w-6xl flex-1 space-y-8 p-4 sm:p-6 lg:p-8">
          <div className="mx-auto max-w-2xl space-y-2 text-center">
            <h1 className="text-2xl font-black text-gray-900 sm:text-3xl">{t("plansTitle")}</h1>
            <p className="text-xs leading-relaxed text-gray-500">
              {t("plansIntro")}
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 pt-2 sm:grid-cols-2 lg:grid-cols-3">
            {OPTIONS.map((o) => {
              const Icon = o.icon;
              return (
                <div
                  key={o.href}
                  className="flex flex-col rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition-all hover:-translate-y-1 hover:shadow-md"
                >
                  <span className={`flex size-11 items-center justify-center rounded-xl ${o.tone}`}>
                    <Icon className="size-5" />
                  </span>

                  <h2 className="mt-4 text-base font-bold text-gray-900">{t(o.titleKey)}</h2>
                  <p className="mt-2 flex-1 text-xs leading-relaxed text-gray-500">{t(o.bodyKey)}</p>

                  <Link
                    href={o.href}
                    className="group mt-5 inline-flex items-center justify-center gap-1.5 rounded-xl bg-blue-600 px-4 py-2.5 text-xs font-bold text-white transition-colors hover:bg-blue-700"
                  >
                    {t(o.ctaKey)}
                    <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
                  </Link>
                </div>
              );
            })}
          </div>

          <div className="mx-auto flex max-w-2xl items-start gap-3 rounded-2xl border border-blue-100 bg-blue-50/50 p-5">
            <ShieldCheck className="mt-0.5 size-5 shrink-0 text-blue-600" />
            <p className="text-xs leading-relaxed text-blue-900/80">
              {t("pinNotice")}{" "}
              <Link href="/settings" className="font-semibold text-blue-700 hover:underline">
                {t("settings")}
              </Link>
              .
            </p>
          </div>
        </main>
      </div>
    </div>
  );
}
