"use client";

import { AlertCircle } from "lucide-react";

interface PaymentErrorBoxProps {
  errorDetails?: string;
}

export default function PaymentErrorBox({
  errorDetails = "Insufficient balance in your MTN Mobile Money wallet. Please top up and try again.",
}: PaymentErrorBoxProps) {
  return (
    <div className="flex items-start gap-3 rounded-2xl bg-red-50 border border-red-100 p-4 text-xs text-red-700 text-left">
      <AlertCircle className="size-4.5 text-red-500 shrink-0 mt-0.5" />
      <div className="space-y-1">
        <h4 className="font-bold text-red-800">Error Details</h4>
        <p className="leading-relaxed text-red-700">{errorDetails}</p>
      </div>
    </div>
  );
}
