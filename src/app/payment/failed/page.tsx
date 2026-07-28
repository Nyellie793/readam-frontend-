"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { Suspense } from "react";
import PaymentFailedCard from "@/components/payment/PaymentFailedCard";
import OrderSummary from "@/components/payment/OrderSummary";
import { HelpCircle } from "lucide-react";

function FailedContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const planId = searchParams.get("plan") ?? "gce-a-all";
  
  // Custom mock values for Failed page Order Summary matching Design 5
  const failedItems = [
    { name: "Advanced Calculus Mastery", subtitle: "Annual Prep Course Pack", price: "25,000 XAF" },
    { name: "AI Tutor Add-on", subtitle: "24/7 Academic Support", price: "0 XAF" }
  ];

  return (
    <div className="mx-auto max-w-5xl space-y-6 px-4 py-8 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3 items-start">
        {/* Left Column: Failed Card */}
        <div className="lg:col-span-2">
          <PaymentFailedCard
            errorMessage="Insufficient balance in your MTN Mobile Money wallet. Please top up and try again."
            onRetry={() => router.push(`/checkout?plan=${planId}`)}
          />
        </div>
        
        {/* Right Column: Order Summary + Support box */}
        <div className="space-y-4">
          <OrderSummary
            items={failedItems}
            subtotal="25,000 XAF"
            fee="500 XAF"
            total="25,500 XAF"
          />
          
          <div className="flex gap-3 rounded-2xl bg-blue-50/40 border border-blue-100 p-4 text-xs text-blue-900 select-none">
            <HelpCircle className="size-5 text-blue-600 shrink-0 mt-0.5" />
            <div>
              <h4 className="font-bold text-blue-950">Having persistent issues?</h4>
              <p className="text-[10px] text-gray-500 mt-0.5">Open a priority support ticket</p>
            </div>
          </div>
        </div>
      </div>

      <div className="text-center pt-8 border-t border-gray-100 text-[10px] text-gray-400">
        © 2026 ReadAM Cameroon. Secure Academic Transactions.
      </div>
    </div>
  );
}

export default function PaymentFailedPage() {
  return (
    <div className="min-h-screen bg-gray-50/50 flex flex-col justify-center py-6">
      <Suspense fallback={<div className="text-center text-xs">Loading failure details...</div>}>
        <FailedContent />
      </Suspense>
    </div>
  );
}
