import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import {
  Target,
  Heart,
  Globe,
  Lightbulb,
  ChevronRight,
  BookOpen,
  Users,
  Trophy,
} from "lucide-react";
import { getTranslations, setRequestLocale } from "next-intl/server";
import Footer from "@/components/layout/Footer";

// ─── Data ─────────────────────────────────────────────────────────────────────

const STATS = [
  { icon: Users, labelKey: "statStudents", value: "12,000+", color: "text-blue-600 bg-blue-50" },
  { icon: BookOpen, labelKey: "statCourses", value: "350+", color: "text-orange-500 bg-orange-50" },
  { icon: Trophy, labelKey: "statPass", value: "94%", color: "text-green-600 bg-green-50" },
  { icon: Globe, labelKey: "statLanguages", value: "EN & FR", color: "text-purple-600 bg-purple-50" },
];

const VALUES = [
  {
    icon: Target,
    color: "bg-blue-100 text-blue-600",
    titleKey: "v1",
    descKey: "v1d",
  },
  {
    icon: Heart,
    color: "bg-orange-100 text-orange-500",
    titleKey: "v2",
    descKey: "v2d",
  },
  {
    icon: Globe,
    color: "bg-purple-100 text-purple-600",
    titleKey: "v3",
    descKey: "v3d",
  },
  {
    icon: Lightbulb,
    color: "bg-teal-100 text-teal-600",
    titleKey: "v4",
    descKey: "v4d",
  },
];

const TEAM = [
  {
    name: "Sarah Jenkins",
    roleKey: "role1",
    image: "/Tutor.png",
    bioKey: "role1bio",
  },
  {
    name: "Mike Davis",
    roleKey: "role2",
    image: "/Tutor 2.png",
    bioKey: "role2bio",
  },
  {
    name: "Linda Carter",
    roleKey: "role3",
    image: "/Tutor 3.png",
    bioKey: "role3bio",
  },
];

// ─── Page ─────────────────────────────────────────────────────────────────────

export const metadata: Metadata = {
  title: "About",
  description:
    "Why ReadAM exists, what we believe about learning in Cameroon, and the team building it.",
  alternates: { canonical: "/about" },
};

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  // Opts this page into static rendering. next-intl renders per request
  // unless it is told the locale up front.
  setRequestLocale(locale);
  const t = await getTranslations("about");
  return (
    <div className="relative min-h-screen bg-white">
      <div className="pointer-events-none absolute right-0 top-0 z-0 h-[60vh] w-[60vw] rounded-full bg-blue-100/40 blur-[120px]" />

      <div className="relative z-10">

        <main>

          {/* ── Hero ── */}
          <section className="mx-auto max-w-7xl px-6 py-20">
            <div className="grid gap-12 lg:grid-cols-2 lg:items-center">

              <div>
                <span className="inline-block rounded-full border border-orange-200 bg-orange-50 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-orange-500">
                  {t("eyebrow")}
                </span>

                <h1 className="mt-5 text-4xl font-black leading-tight text-gray-900 sm:text-5xl">
                  {t("titleLead")}{" "}
                  <span className="text-blue-600">{t("titleAccent")}</span>
                </h1>

                <p className="mt-5 text-base leading-relaxed text-gray-500">
                  {t("p1")}
                </p>

                <p className="mt-4 text-base leading-relaxed text-gray-500">
                  {t("p2")}
                </p>

                <div className="mt-8 flex flex-wrap gap-4">
                  <Link
                    href="/select-role"
                    className="rounded-xl bg-blue-600 px-7 py-3 text-sm font-semibold text-white hover:bg-blue-700 transition shadow-sm"
                  >
                    {t("joinFree")}
                  </Link>
                  <Link
                    href="/features"
                    className="flex items-center gap-1.5 rounded-xl border border-gray-200 px-7 py-3 text-sm font-semibold text-gray-700 hover:border-blue-300 hover:text-blue-600 transition"
                  >
                    {t("seeFeatures")} <ChevronRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>

              {/* Hero image */}
              <div className="relative h-80 overflow-hidden rounded-3xl lg:h-[480px]">
                <Image
                  src="/Students celebrating learning.png"
                  alt="ReadAM students"
                  fill
                  priority
                  sizes="(min-width: 1024px) 50vw, 100vw"
                  className="object-cover"
                />
                {/* Overlay badge */}
                <div className="absolute bottom-6 left-6 rounded-2xl bg-white/90 backdrop-blur-sm px-5 py-3 shadow-lg">
                  <p className="text-2xl font-black text-blue-600">94%</p>
                  <p className="text-xs text-gray-500">of students improved their grades</p>
                </div>
              </div>

            </div>
          </section>

          {/* ── Stats ── */}
          <section className="bg-[#F8F9FC] py-16">
            <div className="mx-auto max-w-7xl px-6">
              <div className="grid grid-cols-2 gap-5 sm:grid-cols-4">
                {STATS.map((s) => {
                  const Icon = s.icon;
                  return (
                    <div
                      key={s.labelKey}
                      className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm text-center"
                    >
                      <div className={`mx-auto flex h-12 w-12 items-center justify-center rounded-xl ${s.color}`}>
                        <Icon className="h-6 w-6" />
                      </div>
                      <p className="mt-4 text-2xl font-black text-gray-900">{s.value}</p>
                      <p className="mt-1 text-xs text-gray-500">{t(s.labelKey)}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>

          {/* ── Mission ── */}
          <section className="mx-auto max-w-7xl px-6 py-20">
            <div className="mx-auto max-w-3xl text-center">
              <h2 className="text-3xl font-black text-gray-900">{t("missionTitle")}</h2>
              <p className="mt-5 text-base leading-relaxed text-gray-500">
                To make high-quality, exam-aligned education accessible to every student in Cameroon —
                regardless of location, school, or economic background. We believe that with the right tools,
                every student can succeed.
              </p>
              <blockquote className="mt-8 rounded-2xl border-l-4 border-blue-600 bg-blue-50 px-8 py-6 text-left">
                <p className="text-base italic text-gray-700">
                  &ldquo;Transforming the future of success and education with an interactive, friend-first approach.
                  Explore the beauty of learning at your full potential — and succeeding with half the effort.&rdquo;
                </p>
                <cite className="mt-3 block text-sm font-semibold text-blue-600">— ReadAM Team</cite>
              </blockquote>
            </div>
          </section>

          {/* ── Values ── */}
          <section className="bg-[#F8F9FC] py-20">
            <div className="mx-auto max-w-7xl px-6">
              <div className="mb-12 text-center">
                <h2 className="text-3xl font-black text-gray-900">{t("valuesTitle")}</h2>
                <p className="mt-2 text-sm text-gray-500">{t("valuesSubtitle")}</p>
              </div>

              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                {VALUES.map((v) => {
                  const Icon = v.icon;
                  return (
                    <div
                      key={t(v.titleKey)}
                      className="group rounded-2xl border border-gray-100 bg-white p-7 shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300"
                    >
                      <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${v.color} group-hover:scale-110 transition-transform duration-300`}>
                        <Icon className="h-5 w-5" />
                      </div>
                      <h3 className="mt-4 text-lg font-bold text-gray-900">{t(v.titleKey)}</h3>
                      <p className="mt-2 text-sm leading-relaxed text-gray-500">{t(v.descKey)}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>

          {/* ── Team ── */}
          <section className="mx-auto max-w-7xl px-6 py-20">
            <div className="mb-12 text-center">
              <h2 className="text-3xl font-black text-gray-900">{t("teamTitle")}</h2>
              <p className="mt-2 text-sm text-gray-500">{t("teamSubtitle")}</p>
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
              {TEAM.map((member) => (
                <div
                  key={member.name}
                  className="group overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                >
                  <div className="relative h-52 w-full overflow-hidden bg-gray-100">
                    <Image
                      src={member.image}
                      alt={member.name}
                      fill
                      sizes="(min-width: 640px) 33vw, 100vw"
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-5">
                    <h3 className="font-bold text-gray-900">{member.name}</h3>
                    <p className="mt-0.5 text-xs font-medium text-blue-600">{t(member.roleKey)}</p>
                    <p className="mt-2 text-sm text-gray-500">{t(member.bioKey)}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* ── CTA ── */}
          <section className="bg-[#071B4D] py-20">
            <div className="mx-auto max-w-3xl px-6 text-center">
              <h2 className="text-3xl font-black text-white sm:text-4xl">
                {t("ctaTitle")}
              </h2>
              <p className="mt-4 text-gray-400">
                {t("ctaBody")}
              </p>
              <div className="mt-8 flex flex-wrap justify-center gap-4">
                <Link
                  href="/select-role"
                  className="rounded-xl bg-orange-500 px-8 py-3 text-sm font-semibold text-white hover:bg-orange-600 transition shadow-lg shadow-orange-500/30"
                >
                  {t("ctaPrimary")}
                </Link>
                <Link
                  href="/courses"
                  className="rounded-xl border border-white/20 px-8 py-3 text-sm font-semibold text-white hover:border-white/40 hover:bg-white/5 transition"
                >
                  {t("ctaSecondary")}
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




