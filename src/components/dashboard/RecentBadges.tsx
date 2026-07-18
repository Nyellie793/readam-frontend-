import { Sparkles } from "lucide-react";

const badges = [
  "bg-violet-100 text-violet-600",
  "bg-blue-100 text-blue-600",
  "bg-orange-100 text-orange-500",
];

export default function RecentBadges() {
  return (
    <div className="rounded-2xl border bg-white p-5 shadow-sm">

      <div className="flex justify-between">

        <p className="font-bold">
          Recent Badges
        </p>

        <button className="text-xs text-blue-600">
          View All
        </button>

      </div>

      <div className="mt-4 flex gap-3">

        {badges.map((badge, i) => (
          <span
            key={i}
            className={`flex size-11 items-center justify-center rounded-full ${badge}`}
          >
            <Sparkles className="size-5" />
          </span>
        ))}

      </div>

    </div>
  );
}