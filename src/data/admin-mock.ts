import {
  Users,
  GraduationCap,
  Wallet,
  BookOpen,
  CheckCircle2,
  ShieldAlert,
} from "lucide-react";
import type { StatCardData, ActivityItem } from "@/types/dashboard.types";

/**
 * NOTE: everything in this file is placeholder data (Task 8 — "do NOT
 * implement backend logic"). Each section is shaped so it can later be
 * swapped for a real fetch with minimal refactoring, e.g.:
 *
 *   const stats = await getDashboardStats(); // replaces OVERVIEW_STATS
 */

export const OVERVIEW_STATS: StatCardData[] = [
  {
    id: "students",
    label: "Total Students",
    value: "24,592",
    delta: "+8%",
    trend: "up",
    icon: Users,
  },
  {
    id: "tutors",
    label: "Total Tutors",
    value: "1,204",
    delta: "+14%",
    trend: "up",
    icon: GraduationCap,
  },
  {
    id: "revenue",
    label: "Revenue (MTD)",
    value: "42.8M",
    delta: "+22%",
    trend: "up",
    icon: Wallet,
  },
  {
    id: "courses",
    label: "Active Courses",
    value: "842",
    delta: "3 Suspended",
    trend: "down",
    icon: BookOpen,
  },
];

export const COURSES_STATS: StatCardData[] = [
  { id: "total", label: "Total Courses", value: "1,284", icon: BookOpen },
  { id: "published", label: "Published", value: "942", delta: "+5%", trend: "up", icon: CheckCircle2 },
  { id: "pending", label: "Pending Approval", value: "28", icon: ShieldAlert, tone: "accent" },
  { id: "rejected", label: "Rejected", value: "12", icon: ShieldAlert, tone: "dark" },
];

export const STUDENTS_STATS: StatCardData[] = [
  { id: "total", label: "Total Students", value: "1,248", icon: Users },
  { id: "active", label: "Active Enrollments", value: "982", icon: CheckCircle2 },
  { id: "premium", label: "Premium Ratio", value: "68%", delta: "+4%", trend: "up", icon: GraduationCap },
  { id: "flagged", label: "Flagged Accounts", value: "14", icon: ShieldAlert, tone: "dark" },
];

export const RECENT_ACTIVITY: ActivityItem[] = [
  {
    id: "1",
    title: "New tutor applied",
    meta: "Emmanuel T. submitted profile for Mathematics.",
    time: "2 mins ago",
    tone: "info",
  },
  {
    id: "2",
    title: "Course submitted",
    meta: '"Advanced Python" awaiting review.',
    time: "40 mins ago",
    tone: "warning",
  },
  {
    id: "3",
    title: "Payment verified",
    meta: "Monthly payout for 14 tutors processed.",
    time: "3 hours ago",
    tone: "success",
  },
  {
    id: "4",
    title: "Security alert",
    meta: "Multiple failed login attempts from IP 192.168.1.1.",
    time: "5 hours ago",
    tone: "destructive",
  },
];

export interface CourseRow {
  id: string;
  title: string;
  category: string;
  tutor: string;
  updated: string;
  status: "Published" | "Pending" | "Rejected";
}

export const COURSES: CourseRow[] = [
  { id: "c1", title: "Advanced UI Design Mastery", category: "Design", tutor: "Sarah Jenkins", updated: "Oct 24, 2025", status: "Published" },
  { id: "c2", title: "Full-Stack Web Engineering 2024", category: "Development", tutor: "Marcus Chen", updated: "Oct 21, 2025", status: "Pending" },
  { id: "c3", title: "Financial Modeling for Startups", category: "Business", tutor: "Eric Zhao", updated: "Oct 21, 2025", status: "Rejected" },
  { id: "c4", title: "Leadership & Team Psychology", category: "Business", tutor: "Dr. Robert Miller", updated: "Sep 18, 2025", status: "Published" },
  { id: "c5", title: "Modern Cybersecurity Foundations", category: "Technology", tutor: "Tabi Samuel", updated: "Sep 12, 2025", status: "Published" },
];

