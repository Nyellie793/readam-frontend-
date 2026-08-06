import {
  LayoutDashboard,
  BookOpen,
  GraduationCap,
  Users,
  UserCheck,
  CreditCard,
  TrendingUp,
  Settings,
} from "lucide-react";
import type { NavItem } from "@/types/dashboard.types";

export const ADMIN_NAV: NavItem[] = [
  { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { label: "Courses", href: "/admin/courses", icon: BookOpen },
  { label: "Tutors", href: "/admin/tutors", icon: GraduationCap },
  { label: "Students", href: "/admin/students", icon: UserCheck },
  { label: "Users", href: "/admin/users", icon: Users },
  { label: "Payments", href: "/admin/payments", icon: CreditCard },
  { label: "Revenue", href: "/admin/revenue", icon: TrendingUp },
  { label: "Settings", href: "/admin/settings", icon: Settings },
];
