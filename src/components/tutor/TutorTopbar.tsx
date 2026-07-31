"use client";

import { useState } from "react";
import { Menu } from "lucide-react";
import TutorMobileSidebar from "./TutorMobileSidebar";

interface TutorTopbarProps {
  greeting: string;
  isVerified: boolean;
}

export default function TutorTopbar({ greeting, isVerified }: TutorTopbarProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <div className="mb-4 flex items-center gap-2 lg:hidden">
        <button
          onClick={() => setOpen(true)}
          className="flex h-9 w-9 items-center justify-center rounded-xl hover:bg-gray-100"
          aria-label="Open menu"
        >
          <Menu size={22} />
        </button>
        <p className="text-lg font-bold text-gray-900">{greeting}</p>
      </div>

      <TutorMobileSidebar open={open} isVerified={isVerified} onClose={() => setOpen(false)} />
    </>
  );
}
