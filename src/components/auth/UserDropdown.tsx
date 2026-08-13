"use client";

import Link from "next/link";
import { homePathFor, clearSession } from "@/lib/auth";
import { useStoredUser } from "@/hooks/useStoredUser";
import { User, Settings, LayoutDashboard, LogOut } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { useRouter } from "next/navigation";

interface UserDropdownProps {
  email?: string;
}

export default function UserDropdown({
  email = "Student",
}: UserDropdownProps) {
  const user = useStoredUser();
  const router = useRouter();

  function handleLogout() {
    clearSession();
    router.push("/login");
    router.refresh();
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className="
            flex size-10 items-center justify-center
            rounded-full bg-blue-600 text-white
            hover:bg-blue-700 transition cursor-pointer
          "
          aria-label="User Account Menu"
        >
          <User size={20} />
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        className="w-64"
        align="end"
      >
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-semibold">Account</p>
            <p className="text-xs text-gray-500 truncate">{email}</p>
          </div>
        </DropdownMenuLabel>

        <DropdownMenuSeparator />

        <DropdownMenuItem asChild className="cursor-pointer">
          <Link
            href={homePathFor(user)}
            className="flex w-full items-center gap-3"
          >
            <LayoutDashboard size={17} />
            <span>Dashboard</span>
          </Link>
        </DropdownMenuItem>

        <DropdownMenuItem asChild className="cursor-pointer">
          <Link
            href="/settings"
            className="flex w-full items-center gap-3"
          >
            <Settings size={17} />
            <span>Profile Settings</span>
          </Link>
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem
          className="text-red-600 cursor-pointer flex items-center gap-3"
          onClick={handleLogout}
        >
          <LogOut size={17} />
          <span>Logout</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}