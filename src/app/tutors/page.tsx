"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Search, Star, BookOpen, ChevronDown } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

type BadgeType = "TOP RATED" | "POPULAR" | "NEW";

interface Tutor {
    id: string;
    name: string;
    specialty: string;
    rating: number;
    reviews: number;
    courses: number;
    image: string;
    badge: BadgeType;
    category: string;
}

const FEATURED_TUTORS: Tutor[] = [
    {
        id: "sarah-jenkins",
        name: "Sarah Jenkins",
        specialty: "English & Literature",
        rating: 4.9,
        reviews: 248,
        courses: 124,
        image: "/Tutor.png",
        badge: "TOP RATED",
        category: "English",
    },
    {
        id: "mike-davis",
        name: "Mike Davis",
        specialty: "Physics & Mathematics",
        rating: 4.9,
        reviews: 190,
        courses: 156,
        image: "/Tutor 2.png",
        badge: "TOP RATED",
        category: "Mathematics",
    },
    {
        id: "linda-carter",
        name: "Linda Carter",
        specialty: "Biology & Life Sciences",
        rating: 4.8,
        reviews: 312,
        courses: 98,
        image: "/Tutor 3.png",
        badge: "TOP RATED",
        category: "Science",
    },
];

const POPULAR_TUTORS: Tutor[] = [
    {
        id: "david-kim",
        name: "David Kim",
        specialty: "Software Engineering",
        rating: 5.0,
        reviews: 85,
        courses: 62,
        image: "/pic(1).png",
        badge: "POPULAR",
        category: "Technology",
    },
    {
        id: "grace-lee",
        name: "Grace Lee",
        specialty: "Modern History",
        rating: 4.7,
        reviews: 210,
        courses: 112,
        image: "/pic 2.png",
        badge: "POPULAR",
        category: "English",
    },
    {
        id: "robert-chen",
        name: "Robert Chen",
        specialty: "Advanced Chemistry",
        rating: 4.9,
        reviews: 156,
        courses: 78,
        image: "/Tutor 2.png",
        badge: "POPULAR",
        category: "Science",
    },
];

const BROWSE_TUTORS: Tutor[] = [
    {
        id: "alice-parker",
        name: "Alice Parker",
        specialty: "Sociology",
        rating: 5.0,
        reviews: 12,
        courses: 24,
        image: "/Tutor 3.png",
        badge: "NEW",
        category: "English",
    },
    {
        id: "marcus-thorne",
        name: "Marcus Thorne",
        specialty: "Data Science",
        rating: 4.9,
        reviews: 56,
        courses: 42,
        image: "/Tutor.png",
        badge: "NEW",
        category: "Technology",
    },
    {
        id: "alice-parker-2",
        name: "Alice Parker",
        specialty: "Sociology",
        rating: 5.0,
        reviews: 12,
        courses: 24,
        image: "/pic(1).png",
        badge: "NEW",
        category: "Design",
    },
];

const CATEGORIES = ["All", "Mathematics", "English", "Science", "Design", "Technology"];
const SORT_OPTIONS = ["Top Rated", "Most Popular", "Newest", "Most Courses"];

function Badge({ type }: { type: BadgeType }) {
    const styles: Record<BadgeType, string> = {
        "TOP RATED": "bg-blue-600 text-white",
        "POPULAR": "bg-orange-500 text-white",
        "NEW": "bg-green-500 text-white",
    };
    return (
        <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide ${styles[type]}`}>
            {(type === "TOP RATED" || type === "POPULAR") && <Star className="h-2.5 w-2.5 fill-white" />}
            {type}
        </span>
    );
}

function TutorCard({ tutor }: { tutor: Tutor }) {
    return (
        <div className="group overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
            <div className="relative h-52 w-full overflow-hidden bg-gray-100">
                <Image src={tutor.image} alt={tutor.name} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute left-3 top-3">
                    <Badge type={tutor.badge} />
                </div>
            </div>
            <div className="p-5">
                <h3 className="text-lg font-bold text-gray-900">{tutor.name}</h3>
                <p className="mt-0.5 text-sm text-gray-400">{tutor.specialty}</p>
                <div className="mt-3 space-y-1.5">
                    <div className="flex items-center gap-1.5 text-sm text-gray-600">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400 shrink-0" />
                        <span className="font-semibold">{tutor.rating.toFixed(1)}</span>
                        <span className="text-gray-400">({tutor.reviews} reviews)</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-sm text-gray-500">
                        <BookOpen className="h-4 w-4 shrink-0 text-gray-400" />
                        <span>{tutor.courses} Courses</span>
                    </div>
                </div>
                <Link
                    href={`/tutors/${tutor.id}`}
                    className="mt-5 block w-full rounded-xl bg-blue-600 py-2.5 text-center text-sm font-semibold text-white hover:bg-blue-700 active:scale-95 transition-all duration-200"
                >
                    View Profile
                </Link>
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
            <Link href="#" className="whitespace-nowrap text-sm font-semibold text-blue-600 hover:text-blue-700">
                See All →
            </Link>
        </div>
    );
}

export default function TutorsPage() {
    const [activeCategory, setActiveCategory] = useState("All");
    const [query, setQuery] = useState("");
    const [sortOpen, setSortOpen] = useState(false);
    const [sortLabel, setSortLabel] = useState("Top Rated");

    function filterTutors(tutors: Tutor[]) {
        return tutors.filter((t) => {
            const matchCat = activeCategory === "All" || t.category === activeCategory;
            const matchQ = !query || t.name.toLowerCase().includes(query.toLowerCase()) || t.specialty.toLowerCase().includes(query.toLowerCase());
            return matchCat && matchQ;
        });
    }

    return (
        <div className="relative min-h-screen bg-white">
            <div className="pointer-events-none absolute right-0 top-0 z-0 h-[50vh] w-[60vw] rounded-full bg-blue-100/40 blur-[120px]" />
            <div className="relative z-10">
                <Navbar />
                <main className="mx-auto max-w-7xl px-6 py-10">

                    <div className="mx-auto mb-6 max-w-2xl">
                        <div className="flex items-center gap-3 rounded-2xl border border-gray-200 bg-white px-5 py-3.5 shadow-sm focus-within:border-blue-400 focus-within:shadow-md transition-all">
                            <Search className="h-4 w-4 shrink-0 text-gray-400" />
                            <input
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                placeholder="Search tutors or subjects..."
                                className="flex-1 bg-transparent text-sm text-gray-700 placeholder:text-gray-400 outline-none"
                            />
                        </div>
                    </div>

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
                        <div className="relative flex items-center gap-2">
                            <span className="text-sm font-semibold text-gray-500 uppercase tracking-wide">SORT BY:</span>
                            <button
                                onClick={() => setSortOpen((o) => !o)}
                                className="flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-blue-600 hover:border-gray-300 transition"
                            >
                                {sortLabel}
                                <ChevronDown className={`h-4 w-4 transition-transform ${sortOpen ? "rotate-180" : ""}`} />
                            </button>
                            {sortOpen && (
                                <div className="absolute right-0 top-full z-20 mt-2 w-44 overflow-hidden rounded-xl border border-gray-100 bg-white shadow-lg">
                                    {SORT_OPTIONS.map((opt) => (
                                        <button
                                            key={opt}
                                            onClick={() => { setSortLabel(opt); setSortOpen(false); }}
                                            className={`block w-full px-4 py-2.5 text-left text-sm hover:bg-blue-50 hover:text-blue-600 transition-colors ${sortLabel === opt ? "font-semibold text-blue-600" : "text-gray-600"}`}
                                        >
                                            {opt}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    <section className="mb-16">
                        <SectionHeader title="Featured Tutors" subtitle="Meet some of our most experienced educators." />
                        {filterTutors(FEATURED_TUTORS).length > 0 ? (
                            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                                {filterTutors(FEATURED_TUTORS).map((tutor) => <TutorCard key={tutor.id + "-featured"} tutor={tutor} />)}
                            </div>
                        ) : (
                            <p className="text-sm text-gray-400">No tutors match your filters.</p>
                        )}
                    </section>

                    <section className="mb-16">
                        <SectionHeader title="Popular This Week" subtitle="Tutors learners are engaging with most this week." />
                        {filterTutors(POPULAR_TUTORS).length > 0 ? (
                            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                                {filterTutors(POPULAR_TUTORS).map((tutor) => <TutorCard key={tutor.id + "-popular"} tutor={tutor} />)}
                            </div>
                        ) : (
                            <p className="text-sm text-gray-400">No tutors match your filters.</p>
                        )}
                    </section>

                    <section>
                        <SectionHeader title="Browse All Tutors" subtitle="Explore tutors across different subjects." />
                        {filterTutors(BROWSE_TUTORS).length > 0 ? (
                            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                                {filterTutors(BROWSE_TUTORS).map((tutor) => <TutorCard key={tutor.id + "-browse"} tutor={tutor} />)}
                            </div>
                        ) : (
                            <div className="py-20 text-center">
                                <p className="text-gray-400">No tutors match your search.</p>
                                <button onClick={() => { setQuery(""); setActiveCategory("All"); }} className="mt-4 text-sm font-medium text-blue-600 hover:underline">
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