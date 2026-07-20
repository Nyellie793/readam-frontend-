"use client";

import { useState } from "react";
import { X } from "lucide-react";
import Sidebar from "./Sidebar";
import CourseFilters from "./courses/CourseFilters";
import { usePathname } from "next/navigation";

interface DashboardMobileSidebarProps {
  onOpen?: never;
}

// Exported so DashboardHeader can trigger it
export default function DashboardMobileSidebar({ open, onClose }: { open: boolean; onClose: () => void }) {
  const pathname = usePathname();
  const isCoursePage =
    pathname === "/dashboard/courses" || pathname.startsWith("/dashboard/courses/");

  return (
    <>
      {open && (
        <div onClick={onClose} className="fixed inset-0 z-40 bg-black/40 lg:hidden" />
      )}

      <aside className={`
        fixed left-0 top-0 z-50 h-screen w-72 transform bg-white shadow-xl
        transition-transform duration-300 lg:hidden
        ${open ? "translate-x-0" : "-translate-x-full"}
      `}>
        <div className="flex justify-end p-4">
          <button onClick={onClose} className="rounded-lg p-2 hover:bg-gray-100">
            <X size={22} />
          </button>
        </div>
        {isCoursePage
          ? <CourseFilters showLogo={false} onNavigate={onClose} />
          : <Sidebar onNavigate={onClose} />
        }
      </aside>
    </>
  );
}