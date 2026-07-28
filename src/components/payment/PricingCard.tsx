"use client";

import { Card, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Check } from "lucide-react";
import Link from "next/link";

export interface PricingPlan {
  id: string;
  title: string;
  price: string;
  period: string;
  description: string;
  features: string[];
  badge?: string;
  color: "blue" | "orange" | "purple" | "green";
  popular?: boolean;
}

interface PricingCardProps {
  plan: PricingPlan;
}

export default function PricingCard({ plan }: PricingCardProps) {
  const { id, title, price, period, description, features, badge, color, popular } = plan;

  const colorClasses = {
    blue: {
      border: popular ? "border-blue-500 shadow-md ring-1 ring-blue-500" : "border-gray-100",
      iconBg: "bg-blue-50 text-blue-600",
      btn: "border-blue-600 text-blue-600 hover:bg-blue-50",
      titleColor: "text-blue-600",
    },
    orange: {
      border: popular ? "border-orange-500 shadow-md ring-1 ring-orange-500" : "border-gray-100",
      iconBg: "bg-orange-50 text-orange-600",
      btn: popular ? "bg-orange-600 hover:bg-orange-700 text-white" : "border-orange-600 text-orange-600 hover:bg-orange-50",
      titleColor: "text-orange-600",
    },
    purple: {
      border: popular ? "border-purple-500 shadow-md ring-1 ring-purple-500" : "border-gray-100",
      iconBg: "bg-purple-50 text-purple-600",
      btn: "border-purple-600 text-purple-600 hover:bg-purple-50",
      titleColor: "text-purple-600",
    },
    green: {
      border: popular ? "border-emerald-500 shadow-md ring-1 ring-emerald-500" : "border-gray-100",
      iconBg: "bg-emerald-50 text-emerald-600",
      btn: "border-emerald-600 text-emerald-600 hover:bg-emerald-50",
      titleColor: "text-emerald-600",
    },
  }[color];

  return (
    <Card
      className={`relative flex flex-col rounded-2xl border bg-white p-6 shadow-sm transition-all hover:shadow-md ${colorClasses.border}`}
    >
      {badge && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2">
          <Badge className="bg-orange-500 text-white hover:bg-orange-500 font-extrabold text-[10px] tracking-wider uppercase px-3 py-1 rounded-full border-none">
            {badge}
          </Badge>
        </div>
      )}

      <div className="space-y-1 mt-2">
        <h3 className={`text-sm font-extrabold tracking-wide uppercase ${colorClasses.titleColor}`}>
          {title}
        </h3>
        <div className="flex items-baseline gap-1 mt-3">
          <span className="text-2xl font-black text-gray-900">{price}</span>
          {period && <span className="text-xs text-gray-400"> {period}</span>}
        </div>
        <p className="text-xs text-gray-500 leading-relaxed mt-2 min-h-[36px]">
          {description}
        </p>
      </div>

      <div className="flex-1 space-y-3.5 my-6 pt-5 border-t border-gray-100">
        {features.map((feat, idx) => (
          <div key={idx} className="flex items-start gap-2.5 text-xs text-gray-600">
            <div className={`flex size-4.5 shrink-0 items-center justify-center rounded-full ${colorClasses.iconBg}`}>
              <Check className="size-3" />
            </div>
            <span>{feat}</span>
          </div>
        ))}
      </div>

      <Link href={`/checkout?plan=${id}`} className="mt-auto block">
        <button
          type="button"
          className={`w-full rounded-xl py-2.5 text-xs font-bold text-center border transition-colors cursor-pointer ${colorClasses.btn}`}
        >
          {popular && color === "orange" ? "Subscribe Now" : "Subscribe"}
        </button>
      </Link>
    </Card>
  );
}
