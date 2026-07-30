"use client";

import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Check, Star } from "lucide-react";
import Link from "next/link";
import type { ProductResponse } from "@/types/api.types";

interface AiSessionPricingCardProps {
  product: ProductResponse;
  highlight?: boolean;
}

function featuresFor(product: ProductResponse): string[] {
  const features: string[] = [];
  if (product.sessions) {
    features.push(`${product.sessions} session${product.sessions > 1 ? "s" : ""} (45 minutes each)`);
  }
  if (product.duration_days) {
    features.push(`Unlimited sessions for ${product.duration_days} days`);
    features.push(
      product.daily_session_cap
        ? `Up to ${product.daily_session_cap} sessions per day`
        : "24/7 AI tutor access, no daily limit"
    );
  }
  return features;
}

export default function AiSessionPricingCard({ product, highlight }: AiSessionPricingCardProps) {
  const features = featuresFor(product);
  const Icon = highlight ? Star : Check;

  return (
    <Card
      className={`relative flex flex-col rounded-2xl border bg-white p-6 shadow-sm transition-all hover:shadow-md ${
        highlight ? "border-orange-500 shadow-lg ring-1 ring-orange-500 hover:shadow-orange-100" : "border-blue-200"
      }`}
    >
      {highlight && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2">
          <Badge className="rounded-full border-none bg-orange-500 px-3.5 py-1 text-[10px] font-extrabold uppercase tracking-wider text-white shadow-sm hover:bg-orange-500">
            Best Value
          </Badge>
        </div>
      )}

      <div className="mt-2 space-y-1">
        <h3 className={`text-sm font-extrabold tracking-wide ${highlight ? "text-orange-600" : "text-blue-600"}`}>
          {product.name}
        </h3>
        <div className="mt-3 flex items-baseline gap-1">
          <span className="text-2xl font-black text-gray-900">{product.price_xaf.toLocaleString()} XAF</span>
        </div>
        <p className="mt-2 text-xs text-gray-500">{product.description}</p>
      </div>

      <div className="my-6 flex-1 space-y-3.5 border-t border-gray-100 pt-5">
        {features.map((feat, idx) => (
          <div key={idx} className="flex items-start gap-2.5 text-xs text-gray-600">
            <div
              className={`flex size-4.5 shrink-0 items-center justify-center rounded-full ${
                highlight ? "bg-orange-50 text-orange-600" : "bg-blue-50 text-blue-600"
              }`}
            >
              <Icon className="size-3" />
            </div>
            <span className="leading-tight">{feat}</span>
          </div>
        ))}
      </div>

      <Link href={`/checkout?product=${product.code}`} className="mt-auto block">
        <button
          type="button"
          className={`w-full cursor-pointer rounded-xl border py-2.5 text-center text-xs font-bold transition-colors ${
            highlight
              ? "border-orange-600 bg-orange-600 text-white shadow-md shadow-orange-600/20 hover:bg-orange-700"
              : "border-blue-600 text-blue-600 hover:bg-blue-50"
          }`}
        >
          {highlight ? "Subscribe Now" : "Buy Now"}
        </button>
      </Link>
    </Card>
  );
}
