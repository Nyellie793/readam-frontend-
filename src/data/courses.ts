import type { Course } from "@/types/course.types";

/**
 * NOTE: placeholder catalog data. Shaped so it can later be swapped for a
 * real fetch with minimal refactoring, e.g.:
 *
 *   const courses = await getCourses({ category, level }); // replaces these arrays
 */

export const RECOMMENDED_COURSES: Course[] = [
  {
    id: "autonomous-robotics",
    title: "Introduction to Autonomous Robotics",
    instructor: "Prof. Alan Turing",
    rating: 4.9,
    reviews: "2.4k",
    price: "25,000 XAF",
    image: "https://picsum.photos/seed/robotics-arm/800/500",
    tags: [
      { label: "Video", tone: "default" },
      { label: "Robotics", tone: "dark" },
    ],
    cta: "View Course",
    format: "Video",
  },
  {
    id: "human-centered-design",
    title: "Human-Centered Design Principles",
    instructor: "Sarah Jenkins",
    rating: 4.8,
    reviews: "1.1k",
    price: "8,500 XAF",
    image: "https://picsum.photos/seed/uiux-app/800/500",
    tags: [
      { label: "PDF", tone: "success" },
      { label: "UI/UX", tone: "dark" },
    ],
    cta: "Download",
    format: "PDF",
  },
  {
    id: "structural-analysis",
    title: "Structural Analysis & Modern Bridges",
    instructor: "Eng. David Kome",
    rating: 4.7,
    reviews: "920",
    price: "30,000 XAF",
    image: "https://picsum.photos/seed/city-towers/800/500",
    tags: [
      { label: "Video", tone: "default" },
      { label: "Civil Eng.", tone: "dark" },
    ],
    cta: "View Course",
    format: "Video",
  },
];

export const POPULAR_COURSES: Course[] = [
  {
    id: "neural-networks",
    title: "Advanced Neural Networks for Engineers",
    instructor: "Dr. Marie Ngo",
    rating: 5.0,
    reviews: "3.2k",
    price: "55,000 XAF",
    image: "https://picsum.photos/seed/ai-face/800/500",
    tags: [
      { label: "Premium", tone: "premium" },
      { label: "AI", tone: "dark" },
    ],
    cta: "Upgrade to Premium",
    format: "Video",
  },
  {
    id: "green-building",
    title: "Green Building & Urban Planning",
    instructor: "Arch. Samuel Taku",
    rating: 4.6,
    reviews: "450",
    price: "18,000 XAF",
    image: "https://picsum.photos/seed/glass-facade/800/500",
    tags: [
      { label: "Interactive", tone: "default" },
      { label: "Architecture", tone: "dark" },
    ],
    cta: "View Course",
    format: "Interactive",
  },
  {
    id: "product-prototyping",
    title: "Product Prototyping & 3D Printing",
    instructor: "Jean Ebolo",
    rating: 4.9,
    reviews: "680",
    price: "12,500 XAF",
    image: "https://picsum.photos/seed/3d-print/800/500",
    tags: [
      { label: "PDF", tone: "success" },
      { label: "Industrial", tone: "dark" },
    ],
    cta: "Download",
    format: "PDF",
  },
];

export const DASHBOARD_RECOMMENDED: Course[] = [
  {
    id: "organic-chemistry",
    title: "Advanced Organic Chemistry",
    instructor: "Dr. Amadou Mvogo",
    instructorRole: "Master Faculty",
    rating: 4.9,
    reviews: "1.2k",
    price: "25,000 XAF",
    image: "https://picsum.photos/seed/molecule-blue/800/500",
    tags: [{ label: "Top Rated", tone: "premium" }],
    cta: "Enroll Now",
    format: "Video",
  },
  {
    id: "quantum-physics",
    title: "Quantum Physics Fundamentals",
    instructor: "Prof. Sarah Ngo",
    instructorRole: "MIT Fellow",
    rating: 4.7,
    reviews: "856",
    price: "30,000 XAF",
    image: "https://picsum.photos/seed/physics-lab/800/500",
    tags: [],
    cta: "Enroll Now",
    format: "Video",
  },
  {
    id: "data-science-python",
    title: "Data Science with Python",
    instructor: "Eng. David Tchiroma",
    instructorRole: "Data Lead",
    rating: 4.8,
    reviews: "2.1k",
    price: "15,000 XAF",
    image: "https://picsum.photos/seed/data-dashboard/800/500",
    tags: [],
    cta: "Enroll Now",
    format: "Video",
  },
];


