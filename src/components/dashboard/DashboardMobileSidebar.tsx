"use client";

import { X } from "lucide-react";
import { usePathname } from "next/navigation";
import Sidebar from "./Sidebar";
import CourseFilters from "./courses/CourseFilters";

interface DashboardMobileSidebarProps {
  open: boolean;
  onClose: () => void;
}

export default function DashboardMobileSidebar({ open, onClose }: DashboardMobileSidebarProps) {
  const pathname = usePathname();

  const isCoursePage =
    pathname === "/dashboard/courses" ||
    pathname.startsWith("/dashboard/courses/");

  return (
    <>
      {open && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 bg-black/40 lg:hidden"
        />
      )}

      <aside
        className={`
          fixed left-0 top-0 z-50 h-screen w-72
          transform bg-white shadow-xl
          transition-transform duration-300 lg:hidden
          ${open ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        <div className="flex justify-end p-4">
          <button onClick={onClose} className="rounded-lg p-2 hover:bg-gray-100">
            <X size={22} />
          </button>
        </div>

        {isCoursePage ? (
          <div className="flex-1 overflow-y-auto">
            <CourseFilters showLogo={false} onNavigate={onClose} />
          </div>
        ) : (
          <Sidebar onNavigate={onClose} />
        )}
      </aside>
    </>
  );
}