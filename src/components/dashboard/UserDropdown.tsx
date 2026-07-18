"use client";

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

import { getStoredUser } from "@/lib/auth";

export default function UserDropdown() {

  const user = getStoredUser();

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

        <DropdownMenuItem>

          <User className="mr-2 h-4 w-4"/>

          Profile

        </DropdownMenuItem>

        <DropdownMenuItem>

          <CreditCard className="mr-2 h-4 w-4"/>

          Subscription

        </DropdownMenuItem>

        <DropdownMenuItem>

          <Settings className="mr-2 h-4 w-4"/>

          Settings

        </DropdownMenuItem>

        <DropdownMenuSeparator/>

        <DropdownMenuItem className="text-red-600">

          <LogOut className="mr-2 h-4 w-4"/>

          Logout

        </DropdownMenuItem>

      </DropdownMenuContent>

    </DropdownMenu>

  );

}