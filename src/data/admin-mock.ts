import {
  Users,
  GraduationCap,
  Wallet,
  BookOpen,
  CheckCircle2,
  ShieldAlert,
  CreditCard,
} from "lucide-react";
import type { StatCardData, ActivityItem, ChartPoint } from "@/types/dashboard.types";

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

export const PAYMENTS_STATS: StatCardData[] = [
  { id: "monthly", label: "This Month's Payout", value: "4,850,000 FCFA", delta: "+12.5%", trend: "up", icon: Wallet },
  { id: "platform", label: "Platform Revenue", value: "12,400,000 FCFA", icon: CreditCard, tone: "dark" },
  { id: "paid", label: "Tutor Payouts Paid", value: "7,550,000 FCFA", icon: CheckCircle2 },
  { id: "pending", label: "Outstanding", value: "341 Tutors Paid", icon: ShieldAlert, tone: "accent" },
];

export const REVENUE_TRENDS: ChartPoint[] = [
  { label: "Mon", value: 32 },
  { label: "Tue", value: 48 },
  { label: "Wed", value: 40 },
  { label: "Thu", value: 62 },
  { label: "Fri", value: 55 },
  { label: "Sat", value: 78 },
  { label: "Sun", value: 70 },
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

export interface TutorRow {
  id: string;
  name: string;
  subject: string;
  email: string;
  students: number;
  rating: number;
  status: "Verified" | "Pending" | "Suspended" | "Active";
}

export const TUTORS: TutorRow[] = [
  { id: "t1", name: "Dr. Ana Thome", subject: "Quantum Physics", email: "ana.thome@example.com", students: 142, rating: 4.9, status: "Verified" },
  { id: "t2", name: "Sarah Jenkins", subject: "Organic Chemistry", email: "sarah.jenkins@example.com", students: 0, rating: 0, status: "Pending" },
  { id: "t3", name: "Michael Vanhart", subject: "Advanced Calculus", email: "michael.v@example.com", students: 88, rating: 4.2, status: "Suspended" },
  { id: "t4", name: "Matt Tomson", subject: "Programming Pro", email: "matt.tomson@example.com", students: 0, rating: 0, status: "Pending" },
  { id: "t5", name: "Elena Rodriguez", subject: "Literature", email: "elena.r@example.com", students: 215, rating: 4.8, status: "Active" },
];

export interface StudentRow {
  id: string;
  name: string;
  email: string;
  courses: number;
  joined: string;
  status: "Active" | "Suspended";
}

export const STUDENTS: StudentRow[] = [
  { id: "s1", name: "Marcus Holloway", email: "marcus.holloway@example.com", courses: 12, joined: "Jan 14, 2025", status: "Active" },
  { id: "s2", name: "Sarah Jenkins", email: "sarah.jenkins@example.com", courses: 4, joined: "Dec 30, 2025", status: "Active" },
  { id: "s3", name: "Elena Rodriguez", email: "elena.rodriguez@example.com", courses: 7, joined: "Nov 22, 2025", status: "Active" },
  { id: "s4", name: "Sophia Chen", email: "sophia.chen@example.com", courses: 20, joined: "Nov 02, 2025", status: "Active" },
  { id: "s5", name: "Matt Tomson", email: "matt.tomson@example.com", courses: 1, joined: "Oct 19, 2025", status: "Suspended" },
];

export interface TransactionRow {
  id: string;
  party: string;
  type: "Revenue" | "Payout" | "Refund";
  amount: string;
  status: "Completed" | "Pending" | "Failed";
  date: string;
}

export const TRANSACTIONS: TransactionRow[] = [
  { id: "TRX-0621", party: "John Doe", type: "Revenue", amount: "+45,000 FCFA", status: "Completed", date: "Jun 21, 2026" },
  { id: "TRX-2204", party: "Marie Lebrand", type: "Payout", amount: "-120,000 FCFA", status: "Pending", date: "Jun 20, 2026" },
  { id: "TRX-0818", party: "Alain Foka", type: "Revenue", amount: "+72,300 FCFA", status: "Completed", date: "Jun 19, 2026" },
  { id: "TRX-0703", party: "Sara Manzouri", type: "Refund", amount: "-22,000 FCFA", status: "Failed", date: "Jun 18, 2026" },
];

export const TOP_QUESTIONS = [
  { id: "q1", text: "Explain integration by parts step by step", subject: "Mathematics", count: "3,841 asks" },
  { id: "q2", text: "What is Newton's second law with examples?", subject: "Physics", count: "1,702 asks" },
  { id: "q3", text: "Summarize the key causes of the French Revolution", subject: "History", count: "1,130 asks" },
];

export const STRUGGLE_TOPICS = [
  { id: "st1", topic: "Calculus", percent: 78 },
  { id: "st2", topic: "Organic Chemistry", percent: 64 },
  { id: "st3", topic: "Mechanical Physics", percent: 52 },
  { id: "st4", topic: "Macroeconomics", percent: 41 },
];
