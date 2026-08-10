"use client";

import { X } from "lucide-react";
import TutorSidebar from "./TutorSidebar";
import { useTranslations } from "next-intl";

interface TutorMobileSidebarProps {
  open: boolean;
  isVerified: boolean;
  onClose: () => void;
}

export default function TutorMobileSidebar({ open, isVerified, onClose }: TutorMobileSidebarProps) {
  const t = useTranslations("tutor");
  return (
    <>
      {open && (
        <button
          type="button"
          aria-label="Close menu"
          onClick={onClose}
          className="fixed inset-0 z-40 cursor-pointer bg-black/40 lg:hidden"
        />
      )}

      <aside
        className={`fixed left-0 top-0 z-50 flex h-dvh w-72 transform flex-col bg-white shadow-xl transition-transform duration-300 lg:hidden ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex shrink-0 justify-end p-4">
          <button onClick={onClose} className="rounded-lg p-2 hover:bg-gray-100" aria-label={t("closeMenu")}>
            <X size={22} />
          </button>
        </div>
        <div className="min-h-0 flex-1">
          <TutorSidebar isVerified={isVerified} onNavigate={onClose} />
        </div>
      </aside>
    </>
  );
}
