"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/layout/Sidebar";
import Topbar from "@/components/layout/Topbar";
import PastQuestionsPricingCard from "@/components/payment/PastQuestionsPricingCard";
import SubjectPicker from "@/components/payment/SubjectPicker";
import { ShieldCheck } from "lucide-react";
import STUDENT from "@/services/student.service";
import type { PastQuestionsProductResponse } from "@/types/api.types";

export default function PastQuestionsPricingPage() {
  const router = useRouter();
  const [products, setProducts] = useState<PastQuestionsProductResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [pickerFor, setPickerFor] = useState<PastQuestionsProductResponse | null>(null);

  useEffect(() => {
    STUDENT.getPastQuestionsProducts()
      .then(setProducts)
      .catch(() => null)
      .finally(() => setLoading(false));
  }, []);

  function handleSelect(product: PastQuestionsProductResponse) {
    if (product.subject_count === null) {
      router.push(`/checkout?pastq=${product.code}`);
      return;
    }
    setPickerFor(product);
  }

  const highlightCode = "past_q_medium";

  return (
    <div className="flex min-h-screen bg-gray-50/50">
      <aside className="hidden lg:block w-64 shrink-0">
        <div className="fixed h-screen w-64"><Sidebar /></div>
      </aside>
      <div className="flex-1 flex flex-col min-w-0">
        <Topbar />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-6xl space-y-8">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <h1 className="text-3xl font-black text-gray-900">GCE Past Questions & Answers</h1>
            <p className="text-xs text-gray-500 max-w-2xl mx-auto leading-relaxed">
              Official ReadAm-curated past exam papers with full worked solutions. Choose the package that fits your subjects.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 pt-2">
            {loading
              ? Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="h-64 animate-pulse rounded-2xl bg-gray-100" />
                ))
              : products.map((product) => (
                  <PastQuestionsPricingCard
                    key={product.code}
                    product={product}
                    highlight={product.code === highlightCode}
                    onSelect={() => handleSelect(product)}
                  />
                ))}
          </div>

          <div className="flex gap-4 items-center rounded-2xl bg-blue-50/40 border border-blue-100 p-5 text-xs text-blue-900 max-w-5xl mx-auto">
            <ShieldCheck className="size-6 text-blue-600 shrink-0" />
            <div>
              <h4 className="font-bold text-blue-950">Official ReadAm Content</h4>
              <p className="text-[11px] text-gray-500 mt-0.5 leading-relaxed">
                Curated and published directly by ReadAm, not third-party tutors. Payments processed via MTN Mobile Money or Orange Money through Fapshi.
              </p>
            </div>
          </div>
        </main>
      </div>

      {pickerFor && (
        <SubjectPicker
          open={!!pickerFor}
          onOpenChange={(open) => !open && setPickerFor(null)}
          maxCount={pickerFor.subject_count ?? 1}
          onConfirm={(courseIds) =>
            router.push(`/checkout?pastq=${pickerFor.code}&subjects=${courseIds.join(",")}`)
          }
        />
      )}
    </div>
  );
}
