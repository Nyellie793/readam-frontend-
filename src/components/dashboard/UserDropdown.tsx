"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  LogOut,
  User,
  Settings,
  CreditCard,
  ChevronDown,
} from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";

import { clearSession } from "@/lib/auth";
import { useStoredUser } from "@/hooks/useStoredUser";

export default function UserDropdown() {
  const router = useRouter();
  const user = useStoredUser();

  function handleLogout() {
    clearSession();
    router.push("/login");
  }

  const name =
    user?.full_name ??
    "Student";

  const email =
    user?.email ??
    "student@readam.com";

  const initials = name
    .split(" ")
    .map(n => n[0])
    .join("")
    .slice(0,2)
    .toUpperCase();

  return (

    <DropdownMenu>

      <DropdownMenuTrigger asChild>

        <button className="flex items-center gap-2 rounded-full border bg-white px-2 py-1 shadow-sm hover:bg-gray-50">

          <Avatar className="size-9">

            <AvatarFallback>
              {initials}
            </AvatarFallback>

          </Avatar>

          <ChevronDown className="size-4 text-gray-500"/>

        </button>

      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        className="w-64"
      >

        <DropdownMenuLabel>

          <p className="font-semibold">
            {name}
          </p>

          <p className="text-xs text-gray-500">
            {email}
          </p>

        </DropdownMenuLabel>

        <DropdownMenuSeparator/>

        <DropdownMenuItem asChild>
          <Link href="/settings">
            <User className="mr-2 h-4 w-4" /> Profile
          </Link>
        </DropdownMenuItem>

        <DropdownMenuItem asChild>
          <Link href="/settings">
            <CreditCard className="mr-2 h-4 w-4" /> Subscription
          </Link>
        </DropdownMenuItem>

        <DropdownMenuItem asChild>
          <Link href="/settings">
            <Settings className="mr-2 h-4 w-4" /> Settings
          </Link>
        </DropdownMenuItem>

        <DropdownMenuSeparator/>

        <DropdownMenuItem className="text-red-600" onClick={handleLogout}>

          <LogOut className="mr-2 h-4 w-4"/>

          Logout

        </DropdownMenuItem>

      </DropdownMenuContent>

    </DropdownMenu>

  );

}