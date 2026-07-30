"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/Input";

export default function DashboardSearch() {
  const router = useRouter();
  const [value, setValue] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!value.trim()) return;
    router.push(`/dashboard/courses?search=${encodeURIComponent(value.trim())}`);
  }

  return (
    <form onSubmit={handleSubmit} className="relative w-full lg:max-w-md sm:block">
      <Search className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-gray-400" />

      <Input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Search courses..."
        className="h-12 w-full rounded-full border-gray-200 bg-white pl-12 shadow-sm"
      />
    </form>
  );
}
