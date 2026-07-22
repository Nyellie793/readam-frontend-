import {
  Home,
  BookOpen,
  Sparkles,
  CreditCard,
  Settings,
  LayoutGrid,
  MessageCircle,
} from "lucide-react";
import type { NavItem } from "@/types/dashboard.types";

export const STUDENT_NAV: NavItem[] = [
  { label: "Home", href: "/dashboard", icon: Home },
  { label: "Explore Courses", href: "/dashboard/courses", icon: BookOpen },
  { label: "AI Tutor", href: "/dashboard/ai-tutor", icon: Sparkles },
  { label: "Payments", href: "/payments", icon: CreditCard },
  { label: "Settings", href: "/settings", icon: Settings },
];

export const AI_TUTOR_SUB_NAV: NavItem[] = [
  { label: "AI Hub", href: "/dashboard/ai-tutor/ai-hub", icon: LayoutGrid },
  { label: "AI Chat", href: "/dashboard/ai-tutor/ai-chat", icon: MessageCircle },
];
