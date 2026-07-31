"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Search, Star, ChevronDown } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

// ─── Types ────────────────────────────────────────────────────────────────────

type CourseType = "VIDEO" | "PDF";
type Level = "Beginner" | "Intermediate" | "Advanced";
type Category = "Mathematics" | "English" | "Science" | "Design" | "Technology" | "Chemistry";

interface Course {
    id: string;
    title: string;
    instructor: string;
    rating: number;
    lessons: number;
    level: Level;
    type: CourseType;
    image: string;
    category: Category;
}

// ─── Data ─────────────────────────────────────────────────────────────────────

const COURSES: Course[] = [
    {
        id: "intro-data-science",
        title: "Introduction to Data Science",
        instructor: "Dr. Alan Turing",
        rating: 4.8,
        lessons: 28,
        level: "Beginner",
        type: "VIDEO",
        image: "/Rectangle 12.png",
        category: "Technology",
    },
    {
        id: "modern-psychology",
        title: "Exploring Modern Psychology",
        instructor: "Dr. Sofia Reed",
        rating: 4.9,
        lessons: 22,
        level: "Intermediate",
        type: "PDF",
        image: "/Rectangle 13.png",
        category: "Science",
    },
    {
        id: "art-of-storytelling",
        title: "The Art of Storytelling",
        instructor: "Julianne Moore",
        rating: 5.0,
        lessons: 12,
        level: "Beginner",
        type: "VIDEO",
        image: "/Rectangle 14.png",
        category: "English",
    },
    {
        id: "organic-chemistry",
        title: "Fundamentals of Organic Chemistry",
        instructor: "Dr. Aris V.",
        rating: 4.9,
        lessons: 30,
        level: "Intermediate",
        type: "VIDEO",
        image: "/Rectangle 12.png",
        category: "Chemistry",
    },
    {
        id: "advanced-game-dev",
        title: "Advanced Game Development",
        instructor: "Sam Rivers",
        rating: 4.8,
        lessons: 55,
        level: "Advanced",
        type: "VIDEO",
        image: "/Rectangle 13.png",
        category: "Technology",
    },
    {
        id: "macroeconomics",
        title: "Macroeconomics: Global Markets",
        instructor: "Prof. Yanis K.",
        rating: 4.7,
        lessons: 22,
        level: "Intermediate",
        type: "VIDEO",
        image: "/Rectangle 14.png",
        category: "Mathematics",
    },
];

const CATEGORIES = ["All", "Mathematics", "English", "Science", "Design", "Technology"];
const SORT_OPTIONS = ["Most Popular", "Newest", "Highest Rated", "Beginner Friendly"];

// ─── Sub-components ───────────────────────────────────────────────────────────

function TypeBadge({ type }: { type: CourseType }) {
    return (
        <span className="inline-block rounded-md border border-blue-200 bg-blue-50 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-blue-600">
            {type}
        </span>
    );
}

function CourseCard({ course }: { course: Course }) {
    return (
        <div className="group flex flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
            {/* Thumbnail */}
            <div className="relative h-44 w-full overflow-hidden bg-gray-100">
                <Image
                    src={course.image}
                    alt={course.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
            </div>

            {/* Body */}
            <div className="flex flex-1 flex-col p-5">
                <TypeBadge type={course.type} />

                <h3 className="mt-3 text-base font-bold leading-snug text-gray-900 group-hover:text-blue-600 transition-colors">
                    {course.title}
                </h3>

                <p className="mt-1 text-xs text-gray-400">{course.instructor}</p>

                <div className="mt-2 flex items-center gap-1 text-xs text-gray-500">
                    <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
                    <span className="font-semibold text-gray-700">{course.rating.toFixed(1)}</span>
                    <span>•</span>
                    <span>{course.lessons} Lessons</span>
                </div>

                {course.level && (
                    <p className="mt-1 text-xs text-gray-400">{course.level}</p>
                )}

                <div className="mt-auto pt-4">
                    <Link
                        href={`/courses/${course.id}`}
                        className="block w-full rounded-xl bg-blue-600 py-2.5 text-center text-sm font-semibold text-white hover:bg-blue-700 active:scale-95 transition-all duration-200"
                    >
                        View Course
                    </Link>
                </div>
            </div>
        </div>
    );
}

function SectionHeader({ title, subtitle }: { title: string; subtitle: string }) {
    return (
        <div className="mb-6 flex items-end justify-between">
            <div>
                <h2 className="text-2xl font-black text-gray-900">{title}</h2>
                <p className="mt-0.5 text-sm text-gray-400">{subtitle}</p>
            </div>
            <Link
                href="#"
                className="text-sm font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-0.5 whitespace-nowrap"
            >
                View All →
            </Link>
        </div>
    );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function CoursesPage() {
    const [activeCategory, setActiveCategory] = useState("All");
    const [query, setQuery] = useState("");
    const [sortOpen, setSortOpen] = useState(false);
    const [sortLabel, setSortLabel] = useState("Most Popular");

    const filtered = COURSES.filter((c) => {
        const matchCat = activeCategory === "All" || c.category === activeCategory;
        const matchQ =
            !query ||
            c.title.toLowerCase().includes(query.toLowerCase()) ||
            c.instructor.toLowerCase().includes(query.toLowerCase());
        return matchCat && matchQ;
    });

    const popular = filtered.slice(0, 3);
    const newThisWeek = filtered.slice(0, 3);
    const browseAll = filtered;

    return (
        <div className="relative min-h-screen bg-white">
            {/* Subtle hero glow */}
            <div className="pointer-events-none absolute right-0 top-0 z-0 h-[50vh] w-[60vw] rounded-full bg-blue-100/40 blur-[120px]" />

            <div className="relative z-10">
                <Navbar />

                <main className="mx-auto max-w-7xl px-6 py-12">

                    {/* ── Search bar ── */}
                    <div className="mx-auto mb-8 max-w-2xl">
                        <div className="flex items-center gap-3 rounded-2xl border border-gray-200 bg-white px-5 py-3.5 shadow-sm focus-within:border-blue-400 focus-within:shadow-md transition-all">
                            <Search className="h-4 w-4 shrink-0 text-gray-400" />
                            <input
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                placeholder="Search courses, subjects, or topics..."
                                className="flex-1 bg-transparent text-sm text-gray-700 placeholder:text-gray-400 outline-none"
                            />
                        </div>
                    </div>

                    {/* ── Filters row ── */}
                    <div className="mb-12 flex flex-wrap items-center justify-between gap-4">
                        <div className="flex flex-wrap gap-2">
                            {CATEGORIES.map((cat) => (
                                <button
                                    key={cat}
                                    onClick={() => setActiveCategory(cat)}
                                    className={`rounded-full px-4 py-1.5 text-sm font-medium transition-all ${activeCategory === cat
                                            ? "bg-blue-600 text-white shadow-sm"
                                            : "border border-gray-200 bg-white text-gray-600 hover:border-blue-300 hover:text-blue-600"
                                        }`}
                                >
                                    {cat}
                                </button>
                            ))}
                        </div>

                        {/* Sort dropdown */}
                        <div className="relative">
                            <button
                                onClick={() => setSortOpen((o) => !o)}
                                className="flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-600 hover:border-gray-300 transition"
                            >
                                {sortLabel}
                                <ChevronDown className={`h-4 w-4 transition-transform ${sortOpen ? "rotate-180" : ""}`} />
                            </button>

                            {sortOpen && (
                                <div className="absolute right-0 top-full z-20 mt-2 w-48 overflow-hidden rounded-xl border border-gray-100 bg-white shadow-lg">
                                    {SORT_OPTIONS.map((opt) => (
                                        <button
                                            key={opt}
                                            onClick={() => { setSortLabel(opt); setSortOpen(false); }}
                                            className={`block w-full px-4 py-2.5 text-left text-sm hover:bg-blue-50 hover:text-blue-600 transition-colors ${sortLabel === opt ? "font-semibold text-blue-600" : "text-gray-600"
                                                }`}
                                        >
                                            {opt}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* ── Popular Courses ── */}
                    <section className="mb-16">
                        <SectionHeader
                            title="Popular Courses"
                            subtitle="Trending among ReadAm learners."
                        />
                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                            {popular.map((course) => (
                                <CourseCard key={course.id + "-popular"} course={course} />
                            ))}
                        </div>
                    </section>

                    {/* ── New This Week ── */}
                    <section className="mb-16">
                        <SectionHeader
                            title="New This Week"
                            subtitle="Recently added lessons and courses."
                        />
                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                            {newThisWeek.map((course) => (
                                <CourseCard key={course.id + "-new"} course={course} />
                            ))}
                        </div>
                    </section>

                    {/* ── Browse All Courses ── */}
                    <section>
                        <SectionHeader
                            title="Browse All Courses"
                            subtitle="Explore our complete course library."
                        />
                        {browseAll.length > 0 ? (
                            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                                {browseAll.map((course) => (
                                    <CourseCard key={course.id + "-browse"} course={course} />
                                ))}
                            </div>
                        ) : (
                            <div className="py-20 text-center">
                                <p className="text-gray-400">No courses match your search.</p>
                                <button
                                    onClick={() => { setQuery(""); setActiveCategory("All"); }}
                                    className="mt-4 text-sm font-medium text-blue-600 hover:underline"
                                >
                                    Clear filters
                                </button>
                            </div>
                        )}
                    </section>
                </main>

                <Footer />
            </div>
        </div>
    );
}