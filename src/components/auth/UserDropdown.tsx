"use client";

import { useState } from "react";
import Link from "next/link";
import { User, Settings, LayoutDashboard } from "lucide-react";
import LogoutButton from "./LogoutButton";

interface UserDropdownProps {
  email?: string;
}

export default function UserDropdown({
  email = "Student",
}: UserDropdownProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">

      <button
        onClick={() => setOpen(!open)}
        className="
          flex size-10 items-center justify-center
          rounded-full bg-blue-600 text-white
          hover:bg-blue-700 transition
        "
      >
        <User size={20} />
      </button>


      {open && (
        <div
          className="
            absolute right-0 mt-3 w-64
            rounded-xl border bg-white
            p-3 shadow-lg
          "
        >

          <div className="mb-3 border-b pb-3">
            <p className="text-sm font-semibold">
              Account
            </p>

            <p className="truncate text-xs text-gray-500">
              {email}
            </p>
          </div>


          <Link
            href="/dashboard"
            className="
              flex items-center gap-3 rounded-lg
              px-3 py-2 text-sm
              hover:bg-gray-100
            "
          >
            <LayoutDashboard size={17}/>
            Dashboard
          </Link>


          <Link
            href="/settings/profile"
            className="
              flex items-center gap-3 rounded-lg
              px-3 py-2 text-sm
              hover:bg-gray-100
            "
          >
            <Settings size={17}/>
            Profile Settings
          </Link>


          <div className="mt-2 border-t pt-2">
            <LogoutButton />
          </div>

        </div>
      )}

    </div>
  );
}