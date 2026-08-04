"use client";

import { Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import SubscriptionCheckout from "@/components/payment/SubscriptionCheckout";
import CourseCheckout from "@/components/payment/CourseCheckout";
import PastQuestionsCheckout from "@/components/payment/PastQuestionsCheckout";

/**
 * Every branch here initiates a real payment and polls the API for its status.
 *
 * There used to be a fourth branch (`?plan=`) that simulated a payment with a
 * setTimeout and decided success from the last digit of the phone number, then
 * showed a receipt with a hardcoded order number and transaction ID. It has
 * been removed. An unrecognised checkout URL now says so plainly instead of
 * pretending to take money.
 */
function CheckoutContent() {
  const searchParams = useSearchParams();

  const productCode = searchParams.get("product");
  const courseId = searchParams.get("course");
  const pastQProduct = searchParams.get("pastq");
  const subjectsParam = searchParams.get("subjects");

  if (pastQProduct) {
    return (
      <PastQuestionsCheckout
        productCode={pastQProduct}
        courseIds={subjectsParam ? subjectsParam.split(",") : []}
      />
    );
  }

  if (productCode) return <SubscriptionCheckout productCode={productCode} />;
  if (courseId) return <CourseCheckout courseId={courseId} />;

  return (
    <div className="mx-auto max-w-md space-y-3 px-6 py-20 text-center">
      <p className="text-lg font-bold text-gray-900">Nothing to check out</p>
      <p className="text-sm leading-relaxed text-gray-500">
        This checkout link is missing a product. Pick a plan or a course and try
        again.
      </p>
      <div className="flex flex-col justify-center gap-3 pt-2 sm:flex-row">
        <Link
          href="/payment"
          className="rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700"
        >
          View plans
        </Link>
        <Link
          href="/dashboard/courses"
          className="rounded-xl border border-gray-200 px-5 py-2.5 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-50"
        >
          Browse courses
        </Link>
      </div>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <div className="min-h-screen bg-gray-50/50">
      <Suspense
        fallback={<div className="p-8 text-center text-xs text-gray-400">Loading checkout…</div>}
      >
        <CheckoutContent />
      </Suspense>
    </div>
  );
}
