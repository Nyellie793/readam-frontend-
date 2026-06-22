"use client";

import { Bell, Search, ChevronDown, Menu } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/Input";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import Sidebar from "@/components/admin/Sidebar";

interface TopbarProps {
  title: string;
  description?: string;
}

export default function Topbar({ title, description }: TopbarProps) {
  return (
    <header className="sticky top-0 z-30 flex items-center gap-3 border-b border-gray-100 bg-white/90 px-4 py-4 backdrop-blur-md sm:px-6">
      {/* Mobile: hamburger opens the same Sidebar in a Sheet */}
      <Sheet>
        <SheetTrigger className="rounded-lg p-2 transition hover:bg-gray-100 lg:hidden">
          <Menu className="h-5 w-5 text-gray-700" />
        </SheetTrigger>
        <SheetContent side="left" className="w-72 p-0">
          <Sidebar />
        </SheetContent>
      </Sheet>

      <div className="min-w-0 flex-1">
        <h1 className="truncate text-lg font-bold text-gray-900 sm:text-xl">{title}</h1>
        {description && (
          <p className="hidden truncate text-xs text-gray-400 sm:block">{description}</p>
        )}
      </div>

      {/* Search — hidden on small screens to avoid crowding */}
      <div className="relative hidden w-64 md:block">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
        <Input placeholder="Search anything..." className="h-9 pl-9" />
      </div>

      <button
        type="button"
        aria-label="Notifications"
        className="relative rounded-xl border border-gray-100 p-2 text-gray-500 transition-colors hover:bg-gray-50"
      >
        <Bell className="h-4.5 w-4.5" />
        <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-orange-500 ring-2 ring-white" />
      </button>

      <DropdownMenu>
        <DropdownMenuTrigger className="flex items-center gap-2 rounded-xl border border-gray-100 py-1.5 pl-1.5 pr-2 transition-colors hover:bg-gray-50">
          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-blue-600 text-xs font-bold text-white">
            AU
          </span>
          <span className="hidden text-left text-xs leading-tight sm:block">
            <span className="block font-semibold text-gray-800">Admin User</span>
            <span className="block text-gray-400">admin@readam.ai</span>
          </span>
          <ChevronDown className="h-3.5 w-3.5 text-gray-400" />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuItem>Profile</DropdownMenuItem>
          <DropdownMenuItem>Account settings</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem className="text-red-600">Log out</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
}
