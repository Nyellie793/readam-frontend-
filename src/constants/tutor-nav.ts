import { LayoutDashboard, BookOpen, Wallet, Settings } from "lucide-react";
import type { NavItem } from "@/types/dashboard.types";

export const TUTOR_NAV: NavItem[] = [
  { label: "Dashboard", href: "/tutor", icon: LayoutDashboard },
  { label: "My Courses", href: "/tutor/courses", icon: BookOpen },
  { label: "Earnings", href: "/tutor/earnings", icon: Wallet },
  { label: "Settings", href: "/tutor/settings", icon: Settings },
];
