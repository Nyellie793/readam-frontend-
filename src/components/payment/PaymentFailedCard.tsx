"use client";

import { RefreshCw, Headphones, Lock } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import PaymentErrorBox from "./PaymentErrorBox";

interface PaymentFailedCardProps {
  errorMessage?: string;
  onRetry?: () => void;
}

export default function PaymentFailedCard({
  errorMessage,
  onRetry,
}: PaymentFailedCardProps) {
  return (
    <div className="mx-auto max-w-xl border border-gray-100 bg-white p-6 sm:p-8 shadow-md rounded-3xl text-center space-y-6">
      {/* Icon */}
      <div className="flex justify-center">
        <div className="flex size-16 items-center justify-center rounded-full bg-red-50 text-red-600 border-4 border-red-100/50">
          <span className="text-2xl font-black select-none">!</span>
        </div>
      </div>

      {/* Header */}
      <div className="space-y-2">
        <h2 className="text-xl sm:text-2xl font-black text-gray-900 font-extrabold">Payment Failed</h2>
        <p className="text-xs text-gray-500 leading-relaxed max-w-sm mx-auto">
          The transaction could not be completed. This may be due to insufficient funds, a bank refusal, or the connection timing out.
        </p>
      </div>

      {/* Error details */}
      <PaymentErrorBox errorDetails={errorMessage} />

      {/* Action buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pt-2">
        <Button
          onClick={onRetry}
          className="flex-1 bg-blue-600 hover:bg-blue-700 text-white rounded-xl h-11 font-bold text-xs flex items-center justify-center gap-2 shadow-md shadow-blue-500/10 transition-colors cursor-pointer"
        >
          <RefreshCw className="size-4" />
          Retry Payment
        </Button>
        <Link href="/dashboard" className="flex-1">
          <Button
            variant="outline"
            className="w-full border-gray-200 hover:bg-gray-100 rounded-xl h-11 text-xs font-bold text-gray-700 flex items-center justify-center gap-2 transition-colors"
          >
            <Headphones className="size-4 text-gray-500" />
            Contact Support
          </Button>
        </Link>
      </div>

      {/* Footer Divider */}
      <div className="border-t border-gray-100 pt-5 flex items-center justify-center gap-4 text-gray-400">
        <div className="flex size-8 items-center justify-center rounded bg-[#FFCC00] text-[7px] font-black text-blue-950 p-1 border border-yellow-300">
          MTN
        </div>
        <div className="flex size-8 items-center justify-center rounded bg-[#FF6600] text-[10px] font-black text-white p-1 border border-orange-600">
          OM
        </div>
        <Lock className="size-4 text-gray-400" />
      </div>
    </div>
  );
}
