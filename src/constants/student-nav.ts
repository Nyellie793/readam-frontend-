import {
  Home,
  BookOpen,
  Sparkles,
  CreditCard,
  Settings,
} from "lucide-react";
import type { NavItem } from "@/types/dashboard.types";

export const STUDENT_NAV: NavItem[] = [
  { label: "Home", href: "/dashboard", icon: Home },
  { label: "Explore Courses", href: "/dashboard/courses", icon: BookOpen },
  { label: "AI Tutor", href: "/ai-tutor", icon: Sparkles },
  { label: "Payments", href: "/payments", icon: CreditCard },
  { label: "Settings", href: "/settings", icon: Settings },
];
