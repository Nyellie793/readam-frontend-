"use client";

import { useState } from "react";
import { Menu, X } from "lucide-react";
import { usePathname } from "next/navigation";
import Sidebar from "./Sidebar";

export default function DashboardMobileSidebar() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  const hideButton =
    pathname === "/dashboard/courses" ||
    pathname.startsWith("/dashboard/courses/");

  return (
    <>
      {!hideButton && (
        <button
          onClick={() => setOpen(true)}
          className="
            fixed left-4 top-4 z-50
            flex h-10 w-10 items-center justify-center
            rounded-xl bg-white shadow-md
            lg:hidden
          "
        >
          <Menu size={22} />
        </button>
      )}

      {open && (
        <div
          onClick={() => setOpen(false)}
          className="
            fixed inset-0 z-40
            bg-black/40
            lg:hidden
          "
        />
      )}

      <aside
        className={`
          fixed left-0 top-0 z-50
          h-screen w-72
          transform bg-white
          shadow-xl
          transition-transform duration-300
          lg:hidden
          ${open ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        <div className="flex justify-end p-4">
          <button
            onClick={() => setOpen(false)}
            className="rounded-lg p-2 hover:bg-gray-100"
          >
            <X size={22} />
          </button>
        </div>

        <Sidebar onNavigate={() => setOpen(false)} />
      </aside>
    </>
  );
}