"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useState, Suspense } from "react";
import Link from "next/link";
import { ArrowLeft, Lock } from "lucide-react";
import PaymentMethodSelector, { PaymentMethod } from "@/components/payment/PaymentMethodSelector";
import PaymentDetailsForm from "@/components/payment/PaymentDetailsForm";
import OrderSummary from "@/components/payment/OrderSummary";
import { PLAN_DETAILS } from "@/data/plans";

function CheckoutContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const planId = searchParams.get("plan") ?? "gce-a-all";
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>("mtn");
  const [loading, setLoading] = useState(false);
  const currentPlan = PLAN_DETAILS[planId] ?? PLAN_DETAILS["gce-a-all"];

  const handlePayment = async (phone: string) => {
    setLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setLoading(false);
    
    const shouldFail = phone.endsWith("5") || phone.endsWith("0") || phone === "666666666";
    const paymentMethodName = selectedMethod === "orange" ? "Orange Money" : "MTN MoMo";
    
    if (shouldFail) {
      router.push(`/payment/failed?plan=${planId}&method=${encodeURIComponent(paymentMethodName)}&phone=${phone}`);
    } else {
      router.push(`/payment/success?plan=${planId}&method=${encodeURIComponent(paymentMethodName)}`);
    }
  };

  return (
    <div className="mx-auto max-w-6xl space-y-6 px-4 py-8 sm:px-6 lg:px-8">
      <div className="flex items-center justify-between border-b border-gray-100 pb-5">
        <div className="flex items-center gap-3">
          <Link href="/payment" className="text-gray-400 hover:text-gray-600 transition-colors"><ArrowLeft className="size-5" /></Link>
          <span className="text-xl font-black text-blue-600">Read<span className="text-orange-500">Am</span></span>
        </div>
        <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-600">
          <Lock className="size-4 shrink-0" /><span className="uppercase tracking-wider">Secure Checkout</span>
        </div>
      </div>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <PaymentMethodSelector selected={selectedMethod} onChange={setSelectedMethod} />
          <PaymentDetailsForm onPay={handlePayment} loading={loading} />
        </div>
        <div><OrderSummary items={currentPlan.items} tax={currentPlan.tax} total={currentPlan.total} /></div>
      </div>
      {loading && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2.5 rounded-full bg-neutral-900/95 px-5 py-3.5 text-xs font-semibold text-white shadow-xl backdrop-blur">
          <span className="size-3.5 animate-spin rounded-full border-2 border-white border-t-transparent" />
          <span>Processing Payment...</span>
        </div>
      )}
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <div className="min-h-screen bg-gray-50/50">
      <Suspense fallback={<div className="p-8 text-center text-xs">Loading checkout...</div>}><CheckoutContent /></Suspense>
    </div>
  );
}
