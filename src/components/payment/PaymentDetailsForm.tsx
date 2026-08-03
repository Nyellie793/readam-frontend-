"use client";

import { useState } from "react";
import { Info, Lock, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PaymentDetailsFormProps {
  onPay: (phone: string) => void;
  loading: boolean;
}

export default function PaymentDetailsForm({
  onPay,
  loading,
}: PaymentDetailsFormProps) {
  const [phoneNumber, setPhoneNumber] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!phoneNumber || phoneNumber.length < 8) return;
    onPay(phoneNumber);
  };

  return (
    <div className="border border-gray-100 bg-white p-6 shadow-sm rounded-2xl">
      <h3 className="text-base font-bold text-gray-900 mb-5">Payment Details</h3>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Phone input */}
        <div className="space-y-2">
          <label htmlFor="phoneNumber" className="text-xs font-semibold text-gray-700">
            Mobile Money Number
          </label>
          <div className="relative flex items-center rounded-xl border border-gray-200 bg-white overflow-hidden shadow-inner h-12 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-100">
            <span className="px-4 text-sm font-bold text-gray-800 border-r border-gray-200 select-none bg-gray-50 h-full flex items-center justify-center">
              +237
            </span>
            <input
              id="phoneNumber"
              type="tel"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, ""))}
              placeholder="6XX XXX XXX"
              maxLength={9}
              className="flex-1 bg-transparent px-4 text-sm font-semibold tracking-wider text-gray-950 outline-none placeholder:text-gray-300"
              required
              disabled={loading}
            />
          </div>
          <p className="text-[10px] text-gray-500">
            A push notification will be sent to this number for authorization.
          </p>
        </div>

        {/* Info box */}
        <div className="flex gap-3 rounded-xl bg-blue-50/50 border border-blue-100/60 p-4 text-xs text-blue-900">
          <Info className="size-4.5 text-blue-600 shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            Please ensure your phone is nearby and your SIM card is active to confirm the transaction.
          </p>
        </div>

        {/* Submit action */}
        <div className="pt-2">
          <Button
            type="submit"
            disabled={loading || phoneNumber.length < 8}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-xl h-12 font-bold text-sm transition-colors flex items-center justify-center gap-2 shadow-lg shadow-blue-500/10 cursor-pointer disabled:opacity-60"
          >
            <ShieldCheck className="size-4.5" />
            {loading ? "Processing..." : "Pay Now"}
          </Button>
        </div>

        {/* Secure SSL text */}
        <div className="flex items-center justify-center gap-1.5 text-[10px] font-semibold text-gray-400 select-none">
          <Lock className="size-3" />
          <span>Encrypted SSL Secure Payment</span>
        </div>
      </form>
    </div>
  );
}
