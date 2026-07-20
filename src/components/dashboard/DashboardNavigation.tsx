"use client";

import { usePathname } from "next/navigation";
import Sidebar from "./Sidebar";
import CourseFilters from "./courses/CourseFilters";

export default function DashboardNavigation() {
  const pathname = usePathname();

  return pathname === "/dashboard/courses" ? (
    <CourseFilters showLogo />
  ) : (
    <Sidebar />
  );
}