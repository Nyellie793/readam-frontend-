"use client";

import { useEffect, useState } from "react";
import Sidebar from "@/components/layout/Sidebar";
import Topbar from "@/components/layout/Topbar";
import AiSessionPricingCard from "@/components/payment/AiSessionPricingCard";
import { ShieldCheck } from "lucide-react";
import STUDENT from "@/services/student.service";
import type { ProductResponse } from "@/types/api.types";

export default function AiSessionsPricingPage() {
  const [products, setProducts] = useState<ProductResponse[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    STUDENT.getProducts()
      .then(setProducts)
      .catch(() => null)
      .finally(() => setLoading(false));
  }, []);

  // Highlight the unlimited-monthly plan, if present — same "best value" framing as before.
  const highlightCode = "ai_unlimited_monthly";

  return (
    <div className="flex min-h-screen bg-gray-50/50">
      <aside className="hidden lg:block w-64 shrink-0">
        <div className="fixed h-screen w-64"><Sidebar /></div>
      </aside>
      <div className="flex-1 flex flex-col min-w-0">
        <Topbar />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-6xl space-y-8">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <h1 className="text-3xl font-black text-gray-900">AI Study Sessions</h1>
            <p className="text-xs text-gray-500 max-w-2xl mx-auto leading-relaxed">
              Accelerate your learning with personalized AI-driven study sessions. Each session is designed to tackle your specific exam challenges and provide instant mastery over complex subjects.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5 pt-2">
            {loading
              ? Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="h-80 animate-pulse rounded-2xl bg-gray-100" />
                ))
              : products.map((product) => (
                  <AiSessionPricingCard
                    key={product.code}
                    product={product}
                    highlight={product.code === highlightCode}
                  />
                ))}
          </div>

          <div className="flex gap-4 items-center rounded-2xl bg-blue-50/40 border border-blue-100 p-5 text-xs text-blue-900 max-w-5xl mx-auto">
            <ShieldCheck className="size-6 text-blue-600 shrink-0" />
            <div>
              <h4 className="font-bold text-blue-950">Secure Transactions</h4>
              <p className="text-[11px] text-gray-500 mt-0.5 leading-relaxed">All payments are processed via MTN Mobile Money or Orange Money through Fapshi.</p>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
