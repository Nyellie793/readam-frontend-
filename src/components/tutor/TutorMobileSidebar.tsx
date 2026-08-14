"use client";

import { X } from "lucide-react";
import { useTranslations } from "next-intl";
import dynamic from "next/dynamic";

const TutorSidebar = dynamic(() => import("./TutorSidebar"), { ssr: false });

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
          className="fixed inset-0 z-40 cursor-pointer bg-black/25 lg:hidden"
        />
      )}

      <aside
        className={`fixed left-0 top-0 z-50 flex h-dvh w-72 transform flex-col bg-white border-r border-gray-100 will-change-transform transition-transform duration-200 lg:hidden ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex shrink-0 justify-end p-4">
          <button onClick={onClose} className="rounded-lg p-2 hover:bg-gray-100 touch-manipulation" aria-label={t("closeMenu")}>
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
