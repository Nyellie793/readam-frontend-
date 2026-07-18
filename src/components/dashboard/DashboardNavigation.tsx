"use client";

import { usePathname } from "next/navigation";
import Sidebar from "./Sidebar";
import CourseFilters from "./courses/CourseFilters";

export default function DashboardNavigation() {
  const pathname = usePathname();

  const isCoursePage =
    pathname === "/dashboard/courses" ||
    pathname.startsWith("/dashboard/courses/");

  return isCoursePage ? (
    <CourseFilters showLogo />
  ) : (
    <Sidebar />
  );
}