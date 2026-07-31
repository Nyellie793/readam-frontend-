"use client";

import { X } from "lucide-react";
import TutorSidebar from "./TutorSidebar";

interface TutorMobileSidebarProps {
  open: boolean;
  isVerified: boolean;
  onClose: () => void;
}

export default function TutorMobileSidebar({ open, isVerified, onClose }: TutorMobileSidebarProps) {
  return (
    <>
      {open && <div onClick={onClose} className="fixed inset-0 z-40 bg-black/40 lg:hidden" />}

      <aside
        className={`fixed left-0 top-0 z-50 h-screen w-72 transform bg-white shadow-xl transition-transform duration-300 lg:hidden ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex justify-end p-4">
          <button onClick={onClose} className="rounded-lg p-2 hover:bg-gray-100" aria-label="Close menu">
            <X size={22} />
          </button>
        </div>
        <TutorSidebar isVerified={isVerified} onNavigate={onClose} />
      </aside>
    </>
  );
}
