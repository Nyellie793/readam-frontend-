import { Search } from "lucide-react";
import { Input } from "@/components/ui/Input";

export default function DashboardSearch() {
  return (
    <div className="relative w-full lg:max-w-md sm:block">
      <Search className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-gray-400" />

      <Input
        placeholder="Search courses..."
        className="h-12 w-full rounded-full border-gray-200 bg-white pl-12 shadow-sm"
      />
    </div>
  );
}