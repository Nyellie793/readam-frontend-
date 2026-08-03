"use client";

import { CheckCircle2, Play, FileText } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

interface PaymentSuccessCardProps {
  orderNumber?: string;
  paymentMethod?: string;
  transactionId?: string;
  amountPaid?: string;
  courseTitle?: string;
  instructor?: string;
}

export default function PaymentSuccessCard({
  orderNumber = "EDF-9928-2024",
  paymentMethod = "Orange Money",
  transactionId = "TXN_881293041X",
  amountPaid = "25,000 XAF",
  courseTitle = "Advanced Mathematics for Baccalauréat",
  instructor = "Dr. Amadou Bello",
}: PaymentSuccessCardProps) {
  return (
    <div className="mx-auto max-w-xl border border-gray-100 bg-white p-6 sm:p-8 shadow-md rounded-3xl text-center space-y-6">
      {/* Icon */}
      <div className="flex justify-center">
        <div className="flex size-16 items-center justify-center rounded-full bg-emerald-50 text-emerald-600 border-4 border-emerald-100/50">
          <CheckCircle2 className="size-8" />
        </div>
      </div>

      {/* Header */}
      <div className="space-y-2">
        <h2 className="text-xl sm:text-2xl font-black text-gray-900">Payment Successful</h2>
        <p className="text-xs text-gray-500 leading-relaxed max-w-sm mx-auto">
          Your transaction has been completed successfully. You now have full access to your learning materials.
        </p>
      </div>

      {/* Course Card Box */}
      <div className="rounded-2xl border border-blue-100 bg-blue-50/20 p-4 text-left flex gap-4">
        <div className="size-16 rounded-xl border border-blue-100 bg-blue-50/50 flex items-center justify-center font-bold text-xs shrink-0 select-none text-center">
          📐 Math
        </div>
        <div className="space-y-1">
          <span className="inline-block bg-blue-50 border border-blue-200 text-blue-600 text-[9px] font-bold px-2 py-0.5 rounded-lg uppercase tracking-wider">
            Baccalauréat Series
          </span>
          <h3 className="text-xs font-bold text-gray-950 leading-snug">{courseTitle}</h3>
          <p className="text-[10px] text-gray-500">Instructor: {instructor}</p>
        </div>
      </div>

      {/* Details Table */}
      <div className="border-t border-gray-100 pt-5 space-y-3 text-xs font-semibold text-gray-600">
        <div className="flex justify-between items-center">
          <span>Order Number</span>
          <span className="text-gray-900 font-bold">{orderNumber}</span>
        </div>
        <div className="flex justify-between items-center">
          <span>Payment Method</span>
          <span className="text-gray-900 font-bold flex items-center gap-1.5">
            <span className="size-2 rounded-full bg-orange-500" />
            {paymentMethod}
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span>Transaction ID</span>
          <span className="text-gray-950 font-bold">{transactionId}</span>
        </div>
        <div className="flex justify-between items-baseline border-t border-gray-100 pt-3">
          <span>Amount Paid</span>
          <span className="text-sm font-extrabold text-blue-600">{amountPaid}</span>
        </div>
      </div>

      {/* CTA Actions */}
      <div className="flex flex-col sm:flex-row gap-3 pt-2">
        <Link href="/dashboard" className="flex-1">
          <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-xl h-11 font-bold text-xs flex items-center justify-center gap-2 shadow-md shadow-blue-500/10 transition-colors">
            <Play className="size-4 fill-white text-white" />
            Start Learning Now
          </Button>
        </Link>
        <Button variant="outline" className="flex-1 border-gray-200 hover:bg-gray-100 rounded-xl h-11 text-xs font-bold text-gray-700 flex items-center justify-center gap-2 transition-colors">
          <FileText className="size-4 text-gray-500" />
          View Receipt
        </Button>
      </div>

      {/* Footer Support */}
      <p className="text-[10px] text-gray-400">
        Need help with your purchase?{" "}
        <Link href="/contact" className="text-blue-600 hover:underline font-bold">Contact Support</Link>
        {" "}or visit our{" "}
        <Link href="/help" className="text-blue-600 hover:underline font-bold">Help Center</Link>.
      </p>
    </div>
  );
}
