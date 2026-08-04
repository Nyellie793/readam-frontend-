"use client";

import { useEffect, useState } from "react";
import { Sparkles } from "lucide-react";
import STUDENT from "@/services/student.service";
import type { BadgeItem } from "@/types/api.types";
import { useTranslations } from "next-intl";

const COLORS = [
  "bg-violet-100 text-violet-600",
  "bg-blue-100 text-blue-600",
  "bg-orange-100 text-orange-500",
];

export default function RecentBadges() {
  const t = useTranslations("dash");
  const [badges, setBadges] = useState<BadgeItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    STUDENT.getBadges()
      .then((data) => setBadges(data.badges.filter((b) => b.achieved)))
      .catch(() => null)
      .finally(() => setLoading(false));
  }, []);

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
        {!loading && badges.length === 0 && (
          <p className="text-xs text-gray-400">{t("firstBadge")}</p>
        )}
        {badges.slice(0, 3).map((badge, i) => (
          <span
            key={badge.id}
            title={`${badge.label} — ${badge.description}`}
            className={`flex size-11 items-center justify-center rounded-full ${COLORS[i % COLORS.length]}`}
          >
            <Sparkles className="size-5" />
          </span>
        ))}
      </div>

    </div>
  );
}
