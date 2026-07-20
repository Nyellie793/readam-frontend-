"use client";

import CourseFilters from "./CourseFilters";

export default function CourseSidebar() {
  return (
    <aside className="hidden lg:block w-64 shrink-0 border-r border-gray-100 bg-white">
      <div
        className="sticky top-0 h-screen overflow-y-auto
          [scrollbar-width:none] hover:[scrollbar-width:thin]
          [&::-webkit-scrollbar]:w-0 hover:[&::-webkit-scrollbar]:w-1.5
          hover:[&::-webkit-scrollbar-thumb]:rounded-full
          hover:[&::-webkit-scrollbar-thumb]:bg-gray-200
          hover:[&::-webkit-scrollbar-track]:bg-transparent"
      >
        <CourseFilters showLogo={false} />
      </div>
    </aside>
  );
}