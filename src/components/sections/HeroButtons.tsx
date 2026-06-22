import { PlayCircle } from "lucide-react";

export default function HeroButtons() {
  return (
    <div className="mt-6 flex flex-wrap items-center gap-3">
      <button className="rounded-xl bg-orange-500 px-7 py-3.5 text-sm font-bold text-white shadow-sm hover:bg-orange-600 transition">
        Book a Lesson
      </button>
      <button className="flex items-center gap-2 rounded-xl border border-blue-400 bg-white px-7 py-3.5 text-sm font-semibold text-gray-700 hover:shadow-md transition">
        <PlayCircle className="h-4 w-4 text-gray-500" />
        Browse Videos
      </button>
    </div>
  );
}