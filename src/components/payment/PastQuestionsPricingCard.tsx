"use client";

import { Check, Star } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import type { PastQuestionsProductResponse } from "@/types/api.types";

interface PastQuestionsPricingCardProps {
  product: PastQuestionsProductResponse;
  highlight?: boolean;
  onSelect: () => void;
}

export default function PastQuestionsPricingCard({ product, highlight, onSelect }: PastQuestionsPricingCardProps) {
  const Icon = highlight ? Star : Check;
  const feature =
    product.subject_count === null
      ? "Past questions & answers for every subject"
      : `Past questions & answers for ${product.subject_count} subject${product.subject_count > 1 ? "s" : ""}`;

  return (
    <Card
      className={`relative flex flex-col rounded-2xl border bg-white p-6 shadow-sm transition-all hover:shadow-md ${
        highlight ? "border-purple-500 shadow-lg ring-1 ring-purple-500 hover:shadow-purple-100" : "border-blue-200"
      }`}
    >
      {highlight && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2">
          <Badge className="rounded-full border-none bg-purple-600 px-3.5 py-1 text-[10px] font-extrabold uppercase tracking-wider text-white shadow-sm hover:bg-purple-600">
            Most Popular
          </Badge>
        </div>
      )}

      <div className="mt-2 space-y-1">
        <h3 className={`text-sm font-extrabold tracking-wide ${highlight ? "text-purple-600" : "text-blue-600"}`}>
          {product.name}
        </h3>
        <div className="mt-3 flex items-baseline gap-1">
          <span className="text-2xl font-black text-gray-900">{product.price_xaf.toLocaleString()} XAF</span>
          <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">/year</span>
        </div>
      </div>

      <div className="my-6 flex-1 space-y-3.5 border-t border-gray-100 pt-5">
        <div className="flex items-start gap-2.5 text-xs text-gray-600">
          <div
            className={`flex size-4.5 shrink-0 items-center justify-center rounded-full ${
              highlight ? "bg-purple-50 text-purple-600" : "bg-blue-50 text-blue-600"
            }`}
          >
            <Icon className="size-3" />
          </div>
          <span className="leading-tight">{feature}</span>
        </div>
      </div>

      <button
        type="button"
        onClick={onSelect}
        className={`w-full cursor-pointer rounded-xl border py-2.5 text-center text-xs font-bold transition-colors ${
          highlight
            ? "border-purple-600 bg-purple-600 text-white shadow-md shadow-purple-600/20 hover:bg-purple-700"
            : "border-blue-600 text-blue-600 hover:bg-blue-50"
        }`}
      >
        Subscribe
      </button>
    </Card>
  );
}
