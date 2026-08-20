import type { Metadata } from "next";
import Link from "next/link";
import {
    BookOpen,
    Sparkles,
    Clock,
    Video,
    BarChart2,
    Globe,
    Trophy,
    Bell,
    ShieldCheck,
    Users,
    Zap,
    ChevronRight,
} from "lucide-react";
import { getTranslations, setRequestLocale } from "next-intl/server";
import Footer from "@/components/layout/Footer";

// ─── Data ─────────────────────────────────────────────────────────────────────

const HERO_STATS = [
    { labelKey: "statStudents", value: "12,000+" },
    { labelKey: "statCourses", value: "350+" },
    { labelKey: "statSubjects", value: "40+" },
    { labelKey: "statPass", value: "94%" },
];

const CORE_FEATURES = [
    {
        icon: Sparkles,
        color: "bg-orange-100 text-orange-500",
        dark: false,
        id: "ai-tutor",
        titleKey: "f1",
        descKey: "f1d",
        tagKeys: ["tagBilingual", "tagStepByStep", "tagSubject", "tagAligned"], tagNs: "featuresPage",
        span: "lg:col-span-2",
        darkBg: false,
    },
    {
        icon: BookOpen,
        color: "bg-blue-100 text-blue-500",
        dark: false,
        id: "pdf-library",
        titleKey: "f2",
        descKey: "f2d",
        tagKeys: ["physicsTag", "chemistryTag", "philosophyTag", "moreTag"], tagNs: "subjects",
        span: "lg:col-span-1",
        darkBg: false,
    },
    {
        icon: Clock,
        color: "bg-white/20 text-white",
        dark: true,
        id: "past-questions",
        titleKey: "f3",
        descKey: "f3d",
        tagKeys: [], tagNs: "featuresPage",
        span: "lg:col-span-1",
        darkBg: true,
    },
    {
        icon: Video,
        color: "bg-orange-100 text-orange-400",
        dark: false,
        id: "video-courses",
        titleKey: "f4",
        descKey: "f4d",
        tagKeys: [], tagNs: "featuresPage",
        span: "lg:col-span-1",
        darkBg: false,
    },
    {
        icon: BarChart2,
        color: "bg-teal-100 text-teal-500",
        dark: false,
        id: "progress-tracking",
        titleKey: "f5",
        descKey: "f5d",
        tagKeys: [], tagNs: "featuresPage",
        span: "lg:col-span-1",
        darkBg: false,
    },
];

const MORE_FEATURES = [
    {
        icon: Globe,
        color: "text-blue-500 bg-blue-50",
        titleKey: "m2",
        descKey: "m2d",
    },
    {
        icon: Trophy,
        color: "text-yellow-500 bg-yellow-50",
        titleKey: "m3",
        descKey: "m3d",
    },
    {
        icon: Bell,
        color: "text-purple-500 bg-purple-50",
        titleKey: "m5",
        descKey: "m5d",
    },
    {
        icon: ShieldCheck,
        color: "text-green-500 bg-green-50",
        titleKey: "m6",
        descKey: "m6d",
    },
    {
        icon: Users,
        color: "text-indigo-500 bg-indigo-50",
        titleKey: "m4",
        descKey: "m4d",
    },
    {
        icon: Zap,
        color: "text-orange-500 bg-orange-50",
        titleKey: "m1",
        descKey: "m1d",
    },
];

// ─── Page ─────────────────────────────────────────────────────────────────────

export const metadata: Metadata = {
  title: "Features",
  description:
    "An AI tutor available around the clock, a past questions bank, a PDF library, video courses and progress tracking.",
  alternates: { canonical: "/features" },
};

export default async function FeaturesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  // Opts this page into static rendering. next-intl renders per request
  // unless it is told the locale up front.
  setRequestLocale(locale);
    const t = await getTranslations("featuresPage");
    const ts = await getTranslations("subjects");
    return (
        <div className="relative min-h-screen bg-white">
            <div className="pointer-events-none absolute right-0 top-0 z-0 h-[60vh] w-[60vw] rounded-full bg-blue-100/40 blur-[120px]" />

            <div className="relative z-10">

                <main>

                    {/* ── Hero ── */}
                    <section className="mx-auto max-w-7xl px-6 py-20 text-center">
                        <span className="inline-block rounded-full border border-blue-200 bg-blue-50 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-blue-600">
                            {t("eyebrow")}
                        </span>

                        <h1 className="mt-5 text-4xl font-black leading-tight text-gray-900 sm:text-5xl lg:text-6xl">
                            {t("titleLead")}{" "}
                            <span className="text-blue-600">{t("titleAccent")}</span>
                        </h1>

                        <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-gray-500">
                            {t("intro")}
                        </p>

                        <div className="mt-8 flex flex-wrap justify-center gap-4">
                            <Link
                                href="/select-role"
                                className="rounded-xl bg-blue-600 px-7 py-3 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 transition"
                            >
                                {t("getStartedFree")}
                            </Link>
                            <Link
                                href="/courses"
                                className="flex items-center gap-1.5 rounded-xl border border-gray-200 px-7 py-3 text-sm font-semibold text-gray-700 hover:border-blue-300 hover:text-blue-600 transition"
                            >
                                {t("browseCourses")} <ChevronRight className="h-4 w-4" />
                            </Link>
                        </div>

                        {/* Stats strip */}
                        <div className="mt-16 grid grid-cols-2 gap-6 sm:grid-cols-4">
                            {HERO_STATS.map((s) => (
                                <div key={t(s.labelKey)} className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
                                    <p className="text-3xl font-black text-blue-600">{s.value}</p>
                                    <p className="mt-1 text-xs text-gray-500">{t(s.labelKey)}</p>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* ── Core features bento ── */}
                    <section className="bg-[#F8F9FC] py-20">
                        <div className="mx-auto max-w-7xl px-6">
                            <div className="mb-12 text-center">
                                <h2 className="text-3xl font-black text-gray-900">{t("coreTitle")}</h2>
                                <p className="mt-2 text-sm text-gray-500">
                                    Built specifically for the Cameroonian educational landscape.
                                </p>
                            </div>

                            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                                {CORE_FEATURES.map((f) => {
                                    const Icon = f.icon;
                                    return (
                                        <div
                                            key={t(f.titleKey)}
                                            id={f.id}
                                            className={`group relative scroll-mt-24 overflow-hidden rounded-2xl p-6 transition-all duration-300 hover:-translate-y-0.5 ${f.span} ${f.darkBg
                                                    ? "bg-[#0f1b35] hover:shadow-xl hover:shadow-blue-900/30"
                                                    : "border border-gray-200 bg-white hover:shadow-lg"
                                                }`}
                                        >
                                            <div
                                                className={`flex h-10 w-10 items-center justify-center rounded-xl transition-all duration-300 group-hover:scale-110 ${f.color}`}
                                            >
                                                <Icon className="h-5 w-5" />
                                            </div>

                                            <h3 className={`mt-4 text-lg font-bold ${f.darkBg ? "text-white" : "text-gray-900"}`}>
                                                {t(f.titleKey)}
                                            </h3>

                                            <p className={`mt-2 text-sm leading-relaxed ${f.darkBg ? "text-gray-400" : "text-gray-500"}`}>
                                                {t(f.descKey)}
                                            </p>

                                            {f.tagKeys.length > 0 && (
                                                <div className="mt-5 flex flex-wrap gap-2">
                                                    {f.tagKeys.map((tag) => (
                                                        <span
                                                            key={tag}
                                                            className="rounded-full border border-gray-200 px-3 py-1 text-xs text-gray-500 hover:border-blue-300 hover:text-blue-500 hover:bg-blue-50 transition-colors cursor-pointer"
                                                        >
                                                            {f.tagNs === "subjects" ? ts(tag) : t(tag)}
                                                        </span>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </section>

                    {/* ── More features grid ── */}
                    <section className="mx-auto max-w-7xl px-6 py-20">
                        <div className="mb-12 text-center">
                            <h2 className="text-3xl font-black text-gray-900">{t("moreTitle")}</h2>
                            <p className="mt-2 text-sm text-gray-500">
                                Thoughtful extras that make the daily study experience seamless.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                            {MORE_FEATURES.map((f) => {
                                const Icon = f.icon;
                                return (
                                    <div
                                        key={t(f.titleKey)}
                                        className="group rounded-2xl border border-gray-100 bg-white p-6 shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300"
                                    >
                                        <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${f.color} group-hover:scale-110 transition-transform duration-300`}>
                                            <Icon className="h-5 w-5" />
                                        </div>
                                        <h3 className="mt-4 text-base font-bold text-gray-900">{t(f.titleKey)}</h3>
                                        <p className="mt-2 text-sm leading-relaxed text-gray-500">{t(f.descKey)}</p>
                                    </div>
                                );
                            })}
                        </div>
                    </section>

                    {/* ── CTA Banner ── */}
                    <section className="bg-[#071B4D] py-20">
                        <div className="mx-auto max-w-3xl px-6 text-center">
                            <h2 className="text-3xl font-black text-white sm:text-4xl">
                                {t("ctaTitle")}
                            </h2>
                            <p className="mt-4 text-gray-400">
                                Join over 12,000 Cameroonian students already using ReadAM to prepare for GCE and Bac exams.
                            </p>
                            <div className="mt-8 flex flex-wrap justify-center gap-4">
                                <Link
                                    href="/select-role"
                                    className="rounded-xl bg-orange-500 px-8 py-3 text-sm font-semibold text-white hover:bg-orange-600 transition shadow-lg shadow-orange-500/30"
                                >
                                    {t("signUpFree")}
                                </Link>
                                <Link
                                    href="/courses"
                                    className="rounded-xl border border-white/20 px-8 py-3 text-sm font-semibold text-white hover:border-white/40 hover:bg-white/5 transition"
                                >
                                    {t("exploreCourses")}
                                </Link>
                            </div>
                        </div>
                    </section>

                </main>

                <Footer />
            </div>
        </div>
    );
}