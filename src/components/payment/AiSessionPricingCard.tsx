"use client";

import { Card, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Check, Star } from "lucide-react";
import Link from "next/link";

export interface AiSessionPlan {
  id: string;
  title: string;
  price: string;
  period?: string;
  description?: string;
  features: string[];
  badge?: string;
  subBadge?: string;
  color: "blue" | "purple" | "pink" | "orange" | "green";
  popular?: boolean;
}

interface AiSessionPricingCardProps {
  plan: AiSessionPlan;
}

export default function AiSessionPricingCard({ plan }: AiSessionPricingCardProps) {
  const { id, title, price, period, description, features, badge, subBadge, color, popular } = plan;

  const colorClasses = {
    blue: {
      border: "border-blue-200 hover:shadow-blue-50/50",
      titleColor: "text-blue-600",
      iconBg: "bg-blue-50 text-blue-600",
      icon: Check,
      btn: "border-blue-600 text-blue-600 hover:bg-blue-50",
    },
    purple: {
      border: "border-purple-200 hover:shadow-purple-50/50",
      titleColor: "text-purple-600",
      iconBg: "bg-purple-50 text-purple-600",
      icon: Check,
      btn: "border-purple-600 text-purple-600 hover:bg-purple-50",
    },
    pink: {
      border: "border-pink-200 hover:shadow-pink-50/50",
      titleColor: "text-pink-600",
      iconBg: "bg-pink-50 text-pink-600",
      icon: Check,
      btn: "border-pink-600 text-pink-600 hover:bg-pink-50",
    },
    orange: {
      border: "border-orange-500 shadow-lg ring-1 ring-orange-500 hover:shadow-orange-100",
      titleColor: "text-orange-600",
      iconBg: "bg-orange-50 text-orange-600",
      icon: Star,
      btn: "bg-orange-600 hover:bg-orange-700 text-white border-orange-600 shadow-md shadow-orange-600/20",
    },
    green: {
      border: "border-emerald-200 hover:shadow-emerald-50/50",
      titleColor: "text-emerald-600",
      iconBg: "bg-emerald-50 text-emerald-600",
      icon: Check,
      btn: "border-emerald-600 text-emerald-600 hover:bg-emerald-50",
    },
  }[color];

  const ActionIcon = colorClasses.icon;

  return (
    <Card
      className={`relative flex flex-col rounded-2xl border bg-white p-6 shadow-sm transition-all hover:shadow-md ${colorClasses.border}`}
    >
      {badge && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2">
          <Badge className="bg-orange-500 text-white hover:bg-orange-500 font-extrabold text-[10px] tracking-wider uppercase px-3.5 py-1 rounded-full border-none shadow-sm">
            {badge}
          </Badge>
        </div>
      )}

      <div className="space-y-1 mt-2">
        <h3 className={`text-sm font-extrabold tracking-wide ${colorClasses.titleColor}`}>
          {title}
        </h3>
        <div className="flex items-baseline gap-1 mt-3">
          <span className="text-2xl font-black text-gray-900">{price}</span>
          {period && <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider"> {period}</span>}
        </div>
        
        {subBadge && (
          <div className="mt-1">
            <span className="inline-block bg-purple-100/70 text-purple-700 text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
              {subBadge}
            </span>
          </div>
        )}

        {description && (
          <p className="text-[11px] font-bold text-orange-500 uppercase tracking-widest mt-2">
            {description}
          </p>
        )}
      </div>

      <div className="flex-1 space-y-3.5 my-6 pt-5 border-t border-gray-100">
        {features.map((feat, idx) => (
          <div key={idx} className="flex items-start gap-2.5 text-xs text-gray-600">
            <div className={`flex size-4.5 shrink-0 items-center justify-center rounded-full ${colorClasses.iconBg}`}>
              <ActionIcon className="size-3" />
            </div>
            <span className="leading-tight">{feat}</span>
          </div>
        ))}
      </div>

      <Link href={`/checkout?plan=${id}`} className="mt-auto block">
        <button
          type="button"
          className={`w-full rounded-xl py-2.5 text-xs font-bold text-center border transition-colors cursor-pointer ${colorClasses.btn}`}
        >
          {color === "orange" ? "Subscribe Now" : "Subscribe"}
        </button>
      </Link>
    </Card>
  );
}
