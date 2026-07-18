"use client";

import CourseFilters from "./CourseFilters";

export default function CourseSidebar() {
  return (
    <aside className="hidden lg:block w-64 shrink-0 border-r border-gray-100 bg-white">
      <div className="sticky top-[73px] h-[calc(100vh-73px)] overflow-y-auto scroll-smooth">
        <CourseFilters showLogo={false} />
      </div>
    </aside>
  );
}