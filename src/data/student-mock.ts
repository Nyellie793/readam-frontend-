import { BookOpen, Clock3, Target } from "lucide-react";
import type { StatCardData, ChartPoint } from "@/types/dashboard.types";
import type { CourseModule, ContinueLearningItem } from "@/types/course.types";

/**
 * NOTE: placeholder data for the student dashboard and lesson pages.
 * Shaped so it can later be swapped for a real fetch with minimal
 * refactoring, e.g.:
 *
 *   const stats = await getStudyProgress(); // replaces STUDY_STATS
 */

export const STUDY_STATS: StatCardData[] = [
  {
    id: "courses-completed",
    label: "Courses Completed",
    value: "12",
    delta: "+2 this week",
    trend: "up",
    icon: BookOpen,
  },
  {
    id: "hours-spent",
    label: "Hours Spent",
    value: "48.5 hrs total",
    icon: Clock3,
  },
  {
    id: "avg-quiz-score",
    label: "Average Quiz Score",
    value: "84%",
    delta: "Top 5%",
    trend: "up",
    icon: Target,
  },
];

export const WEEKLY_ACTIVITY: ChartPoint[] = [
  { label: "MON", value: 30 },
  { label: "TUE", value: 42 },
  { label: "WED", value: 100 },
  { label: "THU", value: 38 },
  { label: "FRI", value: 55 },
  { label: "SAT", value: 20 },
  { label: "SUN", value: 46 },
];

export const RECENTLY_VIEWED = [
  {
    id: "business-economics",
    title: "Intro to Business Economics",
    meta: "3 lessons remaining • 2 hrs left",
    progress: 75,
    image: "https://picsum.photos/seed/economics-calc/200/200",
  },
  {
    id: "cybersecurity",
    title: "Cybersecurity Essentials",
    meta: "Last viewed yesterday • 12 videos",
    progress: 15,
    image: "https://picsum.photos/seed/cyberlock/200/200",
  },
];

export const COURSE_OUTLINE: CourseModule[] = [
  {
    id: "module-1",
    title: "01. Fundamentals of Calculus",
    lessons: [
      { id: "l1", title: "Introduction to Limits", duration: "12:00", status: "done" },
      { id: "l2", title: "Derivatives Explained", duration: "15:45", status: "done" },
    ],
  },
  {
    id: "module-2",
    title: "02. Master Integration",
    lessons: [
      { id: "l3", title: "Integration by Parts", duration: "45:00", status: "active" },
      { id: "l4", title: "Trig Substitution", duration: "18:20", status: "locked" },
      { id: "l5", title: "Definite Integrals", duration: "22:15", status: "locked" },
    ],
  },
  {
    id: "module-3",
    title: "03. Final Examination Prep",
    lessons: [],
  },
];

export const CONTINUE_LEARNING: ContinueLearningItem[] = [
  {
    id: "trig-sub",
    title: "Trigonometric Substitution",
    meta: "Next in Series",
    duration: "15:20",
    image: "https://picsum.photos/seed/chalkboard-math1/600/400",
  },
  {
    id: "pitfalls",
    title: "Common Integration Pitfalls",
    meta: "Quick Review",
    duration: "08:45",
    image: "https://picsum.photos/seed/chalkboard-math2/600/400",
  },
  {
    id: "partial-fractions",
    title: "Practice: Partial Fractions",
    meta: "Interactive Quiz",
    duration: "12:10",
    image: "https://picsum.photos/seed/chalkboard-math3/600/400",
  },
];
