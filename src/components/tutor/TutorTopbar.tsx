"use client";

import { useEffect, useState } from "react";
import { Menu } from "lucide-react";
import TutorMobileSidebar from "./TutorMobileSidebar";
import { useTranslations } from "next-intl";
import { startMeasure, endMeasure } from "@/lib/performance";

interface TutorTopbarProps {
  greeting: string;
  isVerified: boolean;
}

export default function TutorTopbar({ greeting, isVerified }: TutorTopbarProps) {
  const t = useTranslations("tutor");
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (open) {
      const frame = requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          endMeasure("tutor-sidebar-open", 100);
        });
      });
      return () => cancelAnimationFrame(frame);
    }
  }, [open]);

  return (
    <>
      <div className="mb-4 flex items-center gap-2 lg:hidden">
        <button
          onClick={() => {
            startMeasure("tutor-sidebar-open");
            setOpen(true);
          }}
          className="flex h-9 w-9 items-center justify-center rounded-xl hover:bg-gray-100 touch-manipulation"
          aria-label={t("openMenu")}
        >
          <Menu size={22} />
        </button>
        <p className="text-lg font-bold text-gray-900">{greeting}</p>
      </div>

      <TutorMobileSidebar open={open} isVerified={isVerified} onClose={() => setOpen(false)} />
    </>
  );
}
