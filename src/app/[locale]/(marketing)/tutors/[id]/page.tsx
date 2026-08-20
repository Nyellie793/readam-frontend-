import { notFound } from "next/navigation";
import { getPublicTutor, isUuid } from "@/lib/public-api";
import Image from "next/image";
import Link from "next/link";
import { Star, BookOpen, BadgeCheck, ArrowLeft } from "lucide-react";
import Footer from "@/components/layout/Footer";
import { getTranslations } from "next-intl/server";

const ALL_TUTORS = [
    {
        id: "sarah-jenkins",
        name: "Sarah Jenkins",
        title: "English & Literature Tutor",
        rating: 4.9,
        reviews: 248,
        courseCount: 18,
        image: "/Tutor.png",
        verified: true,
        bio: "Sarah is an English and Literature tutor who enjoys helping students build confidence in reading, writing, and exam preparation. Her lessons are designed to be practical, engaging, and easy to follow for learners of all levels.",
        expertise: ["English", "Literature", "Grammar", "Essay Writing", "WAEC", "JAMB"],
        courses: [
            { id: "english-grammar", title: "English Grammar Essentials", type: "PDF" as const, lessons: 24, rating: 4.9, level: "Beginner", image: "/Rectangle 14.png" },
            { id: "essay-writing", title: "Essay Writing Masterclass", type: "VIDEO" as const, lessons: 18, rating: 4.8, level: "Intermediate", image: "/Rectangle 12.png" },
            { id: "waec-english", title: "WAEC English Prep", type: "VIDEO" as const, lessons: 32, rating: 5.0, level: "Advanced", image: "/Rectangle 13.png" },
        ],
    },
    {
        id: "mike-davis",
        name: "Mike Davis",
        title: "Physics & Mathematics Tutor",
        rating: 4.9,
        reviews: 190,
        courseCount: 22,
        image: "/Tutor 2.png",
        verified: true,
        bio: "Mike is a Physics and Mathematics specialist with over 8 years helping students master complex concepts. He breaks down difficult topics into simple, logical steps that stick — especially for GCE A Level and Baccalauréat candidates.",
        expertise: ["Physics", "Mathematics", "Mechanics", "Statistics", "GCE A Level", "Bac"],
        courses: [
            { id: "intro-mechanics", title: "Introduction to Mechanics", type: "VIDEO" as const, lessons: 20, rating: 4.9, level: "Beginner", image: "/Rectangle 12.png" },
            { id: "further-maths", title: "Further Mathematics", type: "PDF" as const, lessons: 28, rating: 4.8, level: "Advanced", image: "/Rectangle 13.png" },
            { id: "waec-physics", title: "WAEC Physics Prep", type: "VIDEO" as const, lessons: 30, rating: 5.0, level: "Intermediate", image: "/Rectangle 14.png" },
        ],
    },
    {
        id: "linda-carter",
        name: "Linda Carter",
        title: "Biology & Life Sciences Tutor",
        rating: 4.8,
        reviews: 312,
        courseCount: 15,
        image: "/Tutor 3.png",
        verified: true,
        bio: "Linda has 12+ years of experience teaching Biology and Life Sciences. She focuses on helping students understand concepts at a cellular and systemic level, making exam revision both effective and enjoyable.",
        expertise: ["Biology", "Life Sciences", "Ecology", "Genetics", "GCE O Level", "Bac"],
        courses: [
            { id: "cell-biology", title: "Cell Biology Fundamentals", type: "VIDEO" as const, lessons: 22, rating: 4.8, level: "Beginner", image: "/Rectangle 13.png" },
            { id: "genetics", title: "Genetics & Heredity", type: "PDF" as const, lessons: 16, rating: 4.7, level: "Intermediate", image: "/Rectangle 14.png" },
            { id: "ecology", title: "Ecology & Environment", type: "VIDEO" as const, lessons: 14, rating: 4.9, level: "Beginner", image: "/Rectangle 12.png" },
        ],
    },
    {
        id: "david-kim",
        name: "David Kim",
        title: "Software Engineering Tutor",
        rating: 5.0,
        reviews: 85,
        courseCount: 12,
        image: "/pic(1).png",
        verified: true,
        bio: "David is a software engineer turned educator. He teaches practical programming and computer science concepts to students preparing for technology-related careers and exams.",
        expertise: ["Programming", "Web Dev", "Python", "JavaScript", "Algorithms", "Data Structures"],
        courses: [
            { id: "python-basics", title: "Python for Beginners", type: "VIDEO" as const, lessons: 30, rating: 5.0, level: "Beginner", image: "/Rectangle 12.png" },
            { id: "web-dev", title: "Web Development Bootcamp", type: "VIDEO" as const, lessons: 55, rating: 4.9, level: "Intermediate", image: "/Rectangle 13.png" },
            { id: "algorithms", title: "Algorithms & Problem Solving", type: "PDF" as const, lessons: 20, rating: 5.0, level: "Advanced", image: "/Rectangle 14.png" },
        ],
    },
    {
        id: "grace-lee",
        name: "Grace Lee",
        title: "Modern History Tutor",
        rating: 4.7,
        reviews: 210,
        courseCount: 14,
        image: "/pic 2.png",
        verified: true,
        bio: "Grace makes history come alive through storytelling and primary sources. She specialises in 20th-century African and world history, tailored to the Cameroonian curriculum.",
        expertise: ["History", "African History", "World Wars", "Colonialism", "GCE", "Bac"],
        courses: [
            { id: "african-history", title: "African History: 1900–Present", type: "PDF" as const, lessons: 18, rating: 4.7, level: "Intermediate", image: "/Rectangle 14.png" },
            { id: "world-wars", title: "The World Wars Explained", type: "VIDEO" as const, lessons: 22, rating: 4.8, level: "Beginner", image: "/Rectangle 12.png" },
            { id: "history-essays", title: "Writing History Essays", type: "PDF" as const, lessons: 10, rating: 4.6, level: "Beginner", image: "/Rectangle 13.png" },
        ],
    },
    {
        id: "robert-chen",
        name: "Robert Chen",
        title: "Advanced Chemistry Tutor",
        rating: 4.9,
        reviews: 156,
        courseCount: 16,
        image: "/Tutor 2.png",
        verified: true,
        bio: "Robert is a chemistry expert who transforms intimidating topics like organic chemistry and electrochemistry into clear, manageable lessons. His students consistently outperform expectations in GCE exams.",
        expertise: ["Chemistry", "Organic Chemistry", "Electrochemistry", "WAEC", "GCE A Level"],
        courses: [
            { id: "organic-chem", title: "Organic Chemistry Essentials", type: "VIDEO" as const, lessons: 26, rating: 4.9, level: "Intermediate", image: "/Rectangle 12.png" },
            { id: "electrochemistry", title: "Electrochemistry Deep Dive", type: "PDF" as const, lessons: 14, rating: 4.8, level: "Advanced", image: "/Rectangle 13.png" },
            { id: "chem-practicals", title: "Chemistry Practicals Guide", type: "VIDEO" as const, lessons: 20, rating: 5.0, level: "Intermediate", image: "/Rectangle 14.png" },
        ],
    },
    {
        id: "alice-parker",
        name: "Alice Parker",
        title: "Sociology Tutor",
        rating: 5.0,
        reviews: 12,
        courseCount: 6,
        image: "/Tutor 3.png",
        verified: false,
        bio: "Alice is a new but highly rated tutor specialising in Sociology and Social Sciences. Her interactive approach makes complex social theories accessible to all levels of learners.",
        expertise: ["Sociology", "Social Theory", "Culture", "GCE", "Research Methods"],
        courses: [
            { id: "intro-sociology", title: "Introduction to Sociology", type: "VIDEO" as const, lessons: 18, rating: 5.0, level: "Beginner", image: "/Rectangle 12.png" },
            { id: "social-theory", title: "Social Theory & Thinkers", type: "PDF" as const, lessons: 12, rating: 4.9, level: "Intermediate", image: "/Rectangle 13.png" },
            { id: "research-methods", title: "Research Methods in Sociology", type: "VIDEO" as const, lessons: 10, rating: 5.0, level: "Intermediate", image: "/Rectangle 14.png" },
        ],
    },
    {
        id: "marcus-thorne",
        name: "Marcus Thorne",
        title: "Data Science Tutor",
        rating: 4.9,
        reviews: 56,
        courseCount: 10,
        image: "/Tutor.png",
        verified: true,
        bio: "Marcus bridges the gap between mathematics and modern data science. He guides students from zero to confident data analysis using real-world datasets and projects.",
        expertise: ["Data Science", "Statistics", "Python", "Machine Learning", "Excel", "Visualisation"],
        courses: [
            { id: "data-basics", title: "Data Science Fundamentals", type: "VIDEO" as const, lessons: 24, rating: 4.9, level: "Beginner", image: "/Rectangle 13.png" },
            { id: "stats-for-data", title: "Statistics for Data Science", type: "PDF" as const, lessons: 18, rating: 4.8, level: "Intermediate", image: "/Rectangle 12.png" },
            { id: "ml-intro", title: "Intro to Machine Learning", type: "VIDEO" as const, lessons: 20, rating: 5.0, level: "Advanced", image: "/Rectangle 14.png" },
        ],
    },
];

const LEVEL_STYLES: Record<string, string> = {
    Beginner: "text-blue-600 bg-blue-50",
    Intermediate: "text-orange-500 bg-orange-50",
    Advanced: "text-purple-600 bg-purple-50",
};

const EXPERIENCE_YEARS: Record<string, number> = {
    less_than_1: 0,
    one_to_three: 2,
    three_to_five: 4,
    five_to_ten: 7,
    ten_plus: 10,
};

type Tutor = (typeof ALL_TUTORS)[number];

/**
 * Real tutors are addressed by UUID and come from GET /v1/tutors/{id}. The
 * profiles carried over from the Edugo era keep their existing slugs so their
 * links stay valid.
 */
async function loadTutor(id: string): Promise<Tutor | null> {
    if (!isUuid(id)) {
        return ALL_TUTORS.find((t) => t.id === id) ?? null;
    }

    const profile = await getPublicTutor(id);
    if (!profile) return null;

    const years = profile.experience_years ? EXPERIENCE_YEARS[profile.experience_years] ?? 0 : 0;

    return {
        id: profile.user_id,
        name: profile.display_name ?? "ReadAM Tutor",
        title: profile.title ?? profile.subject ?? "Tutor",
        rating: 0,
        reviews: 0,
        courseCount: 0,
        image: profile.avatar_url || "/Tutor.png",
        verified: profile.is_verified,
        bio: profile.bio ?? "",
        expertise: [profile.subject, profile.teaching_level, years ? `${years}+ years` : null].filter(
            Boolean
        ) as string[],
        courses: [],
    };
}

export default async function TutorProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const t = await getTranslations("tutors");
    const { id } = await params;
    const tutor = await loadTutor(id);
    if (!tutor) notFound();

    return (
        <div className="relative min-h-screen bg-[#F8F9FC]">
            <div className="pointer-events-none absolute right-0 top-0 z-0 h-[50vh] w-[60vw] rounded-full bg-blue-100/30 blur-[120px]" />
            <div className="relative z-10">
                <main className="mx-auto max-w-5xl px-6 py-10">

                    <Link href="/tutors" className="mb-8 inline-flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-blue-600 transition-colors">
                        <ArrowLeft className="h-4 w-4" />
                        Back to Tutors
                    </Link>

                    {/* Hero card */}
                    <div className="mb-6 overflow-hidden rounded-2xl bg-white shadow-sm">
                        <div className="grid gap-0 lg:grid-cols-2">
                            <div className="relative h-72 w-full overflow-hidden bg-gray-100 lg:h-auto lg:min-h-[380px]">
                                <Image src={tutor.image} alt={tutor.name} fill sizes="(min-width: 1024px) 50vw, 100vw" className="object-cover" priority />
                            </div>
                            <div className="flex flex-col justify-center p-8 lg:p-10">
                                <div className="flex items-center gap-2">
                                    <h1 className="text-3xl font-black text-gray-900">{tutor.name}</h1>
                                    {tutor.verified && <BadgeCheck className="h-6 w-6 shrink-0 text-blue-600" />}
                                </div>
                                <p className="mt-1 text-base text-gray-500">{tutor.title}</p>
                                {tutor.verified && (
                                    <div className="mt-2 flex items-center gap-1.5">
                                        <BadgeCheck className="h-4 w-4 text-blue-600" />
                                        <span className="text-sm font-medium text-blue-600">{t("verified")}</span>
                                    </div>
                                )}
                                <hr className="my-5 border-gray-100" />
                                <div className="space-y-3">
                                    <div className="flex items-center gap-2 text-sm text-gray-600">
                                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400 shrink-0" />
                                        <span className="font-semibold text-gray-900">{tutor.rating.toFixed(1)} Rating</span>
                                        <span className="text-gray-400">({tutor.reviews} Reviews)</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-gray-600">
                                        <BookOpen className="h-4 w-4 shrink-0 text-gray-400" />
                                        <span className="font-semibold text-gray-900">{tutor.courseCount}</span>
                                        <span className="text-gray-400">Courses</span>
                                    </div>
                                    {tutor.verified && (
                                        <div className="flex items-center gap-2 text-sm text-gray-600">
                                            <BadgeCheck className="h-4 w-4 shrink-0 text-gray-400" />
                                            <span className="font-semibold text-gray-900">{t("verified")}</span>
                                        </div>
                                    )}
                                </div>
                                <hr className="my-5 border-gray-100" />
                                <Link href="/select-role" className="block w-full rounded-xl bg-blue-600 py-3.5 text-center text-sm font-bold text-white hover:bg-blue-700 active:scale-[0.98] transition-all duration-200 shadow-sm">
                                    Enroll Now
                                </Link>
                            </div>
                        </div>
                    </div>

                    {/* About + Expertise */}
                    <div className="mb-6 overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
                        <div className="grid gap-0 lg:grid-cols-[1fr_auto]">
                            <div className="p-8 lg:border-r lg:border-gray-100">
                                <h2 className="text-xl font-black text-gray-900">About {tutor.name.split(" ")[0]}</h2>
                                <p className="mt-3 text-sm leading-relaxed text-gray-500">{tutor.bio}</p>
                            </div>
                            <div className="p-8 lg:min-w-[260px]">
                                <h2 className="text-base font-bold text-gray-900">{t("expertise")}</h2>
                                <div className="mt-4 flex flex-wrap gap-2">
                                    {tutor.expertise.map((tag) => (
                                        <span key={tag} className="rounded-full border border-gray-200 px-3 py-1 text-xs font-medium text-gray-600 hover:border-blue-300 hover:bg-blue-50 hover:text-blue-600 transition-colors cursor-default">
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Courses */}
                    <section>
                        <h2 className="mb-5 text-2xl font-black text-gray-900">Courses by {tutor.name.split(" ")[0]}</h2>
                        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                            {tutor.courses.map((course) => (
                                <div key={course.id} className="group overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300">
                                    <div className="flex items-center justify-between px-4 pt-4 pb-3">
                                        <div className="flex items-center gap-3 text-xs text-gray-500">
                                            <span className="flex items-center gap-1">
                                                <BookOpen className="h-3.5 w-3.5" />
                                                {course.lessons} Lessons
                                            </span>
                                            <span className="flex items-center gap-1 font-semibold text-yellow-500">
                                                <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
                                                {course.rating.toFixed(1)}
                                            </span>
                                        </div>
                                        <span className="rounded-md border border-blue-200 bg-blue-50 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-blue-600">
                                            {course.type}
                                        </span>
                                    </div>
                                    <div className="relative mx-4 h-36 overflow-hidden rounded-xl bg-gray-100">
                                        <Image src={course.image} alt={course.title} fill sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw" className="object-cover group-hover:scale-105 transition-transform duration-500" />
                                    </div>
                                    <div className="px-4 pt-3 pb-4">
                                        <h3 className="text-sm font-bold text-gray-900 leading-snug">{course.title}</h3>
                                        <span className={`mt-2 inline-block rounded-full px-3 py-0.5 text-xs font-medium ${LEVEL_STYLES[course.level] ?? "text-gray-500 bg-gray-50"}`}>
                                            {course.level}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>

                </main>
                <Footer />
            </div>
        </div>
    );
}

// Slug profiles prerender; real UUID profiles are rendered on demand.
export const dynamicParams = true;

export function generateStaticParams() {
    return ALL_TUTORS.map((t) => ({ id: t.id }));
}