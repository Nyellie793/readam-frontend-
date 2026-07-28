"use client";

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import PaymentSuccessCard from "@/components/payment/PaymentSuccessCard";
import { PLAN_DETAILS } from "@/data/plans";

function SuccessContent() {
  const searchParams = useSearchParams();
  const planId = searchParams.get("plan") ?? "gce-a-all";
  const method = searchParams.get("method") ?? "Orange Money";
  
  const currentPlan = PLAN_DETAILS[planId] ?? PLAN_DETAILS["gce-a-all"];
  const courseTitle = currentPlan.items[0]?.name ?? "Advanced Mathematics for Baccalauréat";

  return (
    <div className="flex flex-col items-center justify-center p-6 md:p-12">
      <PaymentSuccessCard
        paymentMethod={method}
        courseTitle={courseTitle}
        amountPaid={currentPlan.total}
      />
    </div>
  );
}

export default function PaymentSuccessPage() {
  return (
    <div className="min-h-screen bg-gray-50/50 flex flex-col justify-center py-12">
      <Suspense fallback={<div className="text-center text-xs">Loading success details...</div>}>
        <SuccessContent />
      </Suspense>
    </div>
  );
}
