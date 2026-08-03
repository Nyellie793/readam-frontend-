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
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

// ─── Data ─────────────────────────────────────────────────────────────────────

const HERO_STATS = [
    { label: "Active Students", value: "12,000+" },
    { label: "Courses Available", value: "350+" },
    { label: "Subjects Covered", value: "40+" },
    { label: "Exam Pass Rate", value: "94%" },
];

const CORE_FEATURES = [
    {
        icon: Sparkles,
        color: "bg-orange-100 text-orange-500",
        dark: false,
        id: "ai-tutor",
        title: "AI Tutor — Available 24/7",
        description:
            "Ask anything, get step-by-step explanations in English or French. The AI Tutor adapts to your level and builds personalised study plans around your weak areas.",
        tags: ["Bilingual EN/FR", "Step-by-step", "Subject-specific", "GCE & WAEC aligned"],
        span: "lg:col-span-2",
        darkBg: false,
    },
    {
        icon: BookOpen,
        color: "bg-blue-100 text-blue-500",
        dark: false,
        id: "pdf-library",
        title: "PDF Library",
        description:
            "Thousands of curriculum-aligned notes from top schools across Cameroon. Download and study offline anytime.",
        tags: ["Physics", "Chemistry", "Philosophy", "+12 more"],
        span: "lg:col-span-1",
        darkBg: false,
    },
    {
        icon: Clock,
        color: "bg-white/20 text-white",
        dark: true,
        id: "past-questions",
        title: "Past Questions Bank",
        description:
            "10 years of real GCE Ordinary & Advanced Level and Baccalauréat exam papers with worked solutions.",
        tags: [],
        span: "lg:col-span-1",
        darkBg: true,
    },
    {
        icon: Video,
        color: "bg-orange-100 text-orange-400",
        dark: false,
        id: "video-courses",
        title: "Video Courses",
        description:
            "High-quality lessons from the most requested tutors in Cameroon, on demand.",
        tags: [],
        span: "lg:col-span-1",
        darkBg: false,
    },
    {
        icon: BarChart2,
        color: "bg-teal-100 text-teal-500",
        dark: false,
        id: "progress-tracking",
        title: "Progress Tracking",
        description:
            "Visualise your mastery per subject with XP points, daily streaks, and weekly charts.",
        tags: [],
        span: "lg:col-span-1",
        darkBg: false,
    },
];

const MORE_FEATURES = [
    {
        icon: Globe,
        color: "text-blue-500 bg-blue-50",
        title: "French & English Toggle",
        desc: "Switch interface language instantly. Content is available in both official languages of Cameroon.",
    },
    {
        icon: Trophy,
        color: "text-yellow-500 bg-yellow-50",
        title: "Gamified Learning",
        desc: "Earn badges, maintain streaks, and climb leaderboards to stay motivated throughout your studies.",
    },
    {
        icon: Bell,
        color: "text-purple-500 bg-purple-50",
        title: "Smart Notifications",
        desc: "Get reminders for assignments, streak alerts, AI study suggestions, and payment receipts.",
    },
    {
        icon: ShieldCheck,
        color: "text-green-500 bg-green-50",
        title: "Role-Based Access",
        desc: "Separate, secure portals for students, tutors, and admins — each with tailored tools.",
    },
    {
        icon: Users,
        color: "text-indigo-500 bg-indigo-50",
        title: "Tutor Marketplace",
        desc: "Browse verified tutors, view their ratings, and enrol in their courses directly.",
    },
    {
        icon: Zap,
        color: "text-orange-500 bg-orange-50",
        title: "Offline-Ready PDFs",
        desc: "Download notes and past questions and study even without an internet connection.",
    },
];

// ─── Page ─────────────────────────────────────────────────────────────────────

export const metadata: Metadata = {
  title: "Features",
  description:
    "An AI tutor available around the clock, a past questions bank, a PDF library, video courses and progress tracking.",
  alternates: { canonical: "/features" },
};

export default function FeaturesPage() {
    return (
        <div className="relative min-h-screen bg-white">
            <div className="pointer-events-none absolute right-0 top-0 z-0 h-[60vh] w-[60vw] rounded-full bg-blue-100/40 blur-[120px]" />

            <div className="relative z-10">
                <Navbar />

                <main>

                    {/* ── Hero ── */}
                    <section className="mx-auto max-w-7xl px-6 py-20 text-center">
                        <span className="inline-block rounded-full border border-blue-200 bg-blue-50 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-blue-600">
                            Platform Features
                        </span>

                        <h1 className="mt-5 text-4xl font-black leading-tight text-gray-900 sm:text-5xl lg:text-6xl">
                            Everything you need to{" "}
                            <span className="text-blue-600">ace your exams</span>
                        </h1>

                        <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-gray-500">
                            ReadAM is built from the ground up for Cameroonian students — combining AI-powered tutoring,
                            a curated course library, and gamified progress tracking into one platform.
                        </p>

                        <div className="mt-8 flex flex-wrap justify-center gap-4">
                            <Link
                                href="/signup"
                                className="rounded-xl bg-blue-600 px-7 py-3 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 transition"
                            >
                                Get Started Free
                            </Link>
                            <Link
                                href="/courses"
                                className="flex items-center gap-1.5 rounded-xl border border-gray-200 px-7 py-3 text-sm font-semibold text-gray-700 hover:border-blue-300 hover:text-blue-600 transition"
                            >
                                Browse Courses <ChevronRight className="h-4 w-4" />
                            </Link>
                        </div>

                        {/* Stats strip */}
                        <div className="mt-16 grid grid-cols-2 gap-6 sm:grid-cols-4">
                            {HERO_STATS.map((s) => (
                                <div key={s.label} className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
                                    <p className="text-3xl font-black text-blue-600">{s.value}</p>
                                    <p className="mt-1 text-xs text-gray-500">{s.label}</p>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* ── Core features bento ── */}
                    <section className="bg-[#F8F9FC] py-20">
                        <div className="mx-auto max-w-7xl px-6">
                            <div className="mb-12 text-center">
                                <h2 className="text-3xl font-black text-gray-900">Core Features</h2>
                                <p className="mt-2 text-sm text-gray-500">
                                    Built specifically for the Cameroonian educational landscape.
                                </p>
                            </div>

                            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                                {CORE_FEATURES.map((f) => {
                                    const Icon = f.icon;
                                    return (
                                        <div
                                            key={f.title}
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
                                                {f.title}
                                            </h3>

                                            <p className={`mt-2 text-sm leading-relaxed ${f.darkBg ? "text-gray-400" : "text-gray-500"}`}>
                                                {f.description}
                                            </p>

                                            {f.tags.length > 0 && (
                                                <div className="mt-5 flex flex-wrap gap-2">
                                                    {f.tags.map((tag) => (
                                                        <span
                                                            key={tag}
                                                            className="rounded-full border border-gray-200 px-3 py-1 text-xs text-gray-500 hover:border-blue-300 hover:text-blue-500 hover:bg-blue-50 transition-colors cursor-pointer"
                                                        >
                                                            {tag}
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
                            <h2 className="text-3xl font-black text-gray-900">Even More to Love</h2>
                            <p className="mt-2 text-sm text-gray-500">
                                Thoughtful extras that make the daily study experience seamless.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                            {MORE_FEATURES.map((f) => {
                                const Icon = f.icon;
                                return (
                                    <div
                                        key={f.title}
                                        className="group rounded-2xl border border-gray-100 bg-white p-6 shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300"
                                    >
                                        <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${f.color} group-hover:scale-110 transition-transform duration-300`}>
                                            <Icon className="h-5 w-5" />
                                        </div>
                                        <h3 className="mt-4 text-base font-bold text-gray-900">{f.title}</h3>
                                        <p className="mt-2 text-sm leading-relaxed text-gray-500">{f.desc}</p>
                                    </div>
                                );
                            })}
                        </div>
                    </section>

                    {/* ── CTA Banner ── */}
                    <section className="bg-[#071B4D] py-20">
                        <div className="mx-auto max-w-3xl px-6 text-center">
                            <h2 className="text-3xl font-black text-white sm:text-4xl">
                                Ready to start learning?
                            </h2>
                            <p className="mt-4 text-gray-400">
                                Join over 12,000 Cameroonian students already using ReadAM to prepare for GCE and Bac exams.
                            </p>
                            <div className="mt-8 flex flex-wrap justify-center gap-4">
                                <Link
                                    href="/signup"
                                    className="rounded-xl bg-orange-500 px-8 py-3 text-sm font-semibold text-white hover:bg-orange-600 transition shadow-lg shadow-orange-500/30"
                                >
                                    Sign Up Free
                                </Link>
                                <Link
                                    href="/courses"
                                    className="rounded-xl border border-white/20 px-8 py-3 text-sm font-semibold text-white hover:border-white/40 hover:bg-white/5 transition"
                                >
                                    Explore Courses
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