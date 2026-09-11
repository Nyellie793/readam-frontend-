"use client";

import { usePathname } from "next/navigation";
import Sidebar from "./Sidebar";
import CourseFilters from "./courses/CourseFilters";
import { useSidebarCollapsed } from "@/hooks/useSidebarCollapsed";
import { cn } from "@/lib/utils";

export default function DashboardNavigation() {
  const pathname = usePathname();
  const [collapsed, toggleCollapsed] = useSidebarCollapsed();

  // The course filter rail isn't collapse-aware and doesn't need to be — it's
  // already a narrow, single-purpose panel. Collapsing only applies where
  // Sidebar itself renders.
  const isCoursesPage = pathname === "/dashboard/courses";
  const width = isCoursesPage || !collapsed ? "w-64" : "w-20";

  return (
    <aside className={cn("hidden shrink-0 border-r border-gray-100 lg:block", width)}>
      <div className={cn("fixed h-dvh", width)}>
        {isCoursesPage ? (
          <CourseFilters showLogo />
        ) : (
          <Sidebar collapsed={collapsed} onToggleCollapse={toggleCollapsed} />
        )}
      </div>
    </aside>
  );
}
