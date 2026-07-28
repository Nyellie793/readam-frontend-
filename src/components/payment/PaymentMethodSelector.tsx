"use client";

import { CheckCircle2 } from "lucide-react";
import Image from "next/image";

export type PaymentMethod = "mtn" | "orange";

interface PaymentMethodSelectorProps {
  selected: PaymentMethod;
  onChange: (method: PaymentMethod) => void;
}

export default function PaymentMethodSelector({
  selected,
  onChange,
}: PaymentMethodSelectorProps) {
  return (
    <div className="border border-gray-100 bg-white p-6 shadow-sm rounded-2xl">
      <h3 className="text-base font-bold text-gray-900 mb-4">Select Payment Method</h3>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* MTN MoMo Selector */}
        <button
          type="button"
          onClick={() => onChange("mtn")}
          className={`flex items-center justify-between p-4 rounded-xl border text-left transition-all ${
            selected === "mtn"
              ? "border-blue-600 bg-blue-50/20 text-blue-900 ring-2 ring-blue-600/20"
              : "border-gray-200 hover:bg-gray-50 text-gray-700"
          }`}
        >
          <div className="flex items-center gap-3">
            <div className="flex size-11 items-center justify-center rounded-lg bg-[#FFCC00] overflow-hidden p-1.5 shrink-0 border border-yellow-300">
              {/* Fallback stylized text logo if no image */}
              <span className="text-[10px] font-black text-blue-950 tracking-tighter">MTN</span>
            </div>
            <div>
              <p className="text-xs font-bold text-gray-950">MTN MoMo</p>
              <p className="text-[10px] text-gray-400 mt-0.5">Instant confirmation</p>
            </div>
          </div>
          <div className="relative shrink-0">
            {selected === "mtn" ? (
              <CheckCircle2 className="size-5 text-blue-600" />
            ) : (
              <div className="size-5 rounded-full border-2 border-gray-300" />
            )}
          </div>
        </button>

        {/* Orange Money Selector */}
        <button
          type="button"
          onClick={() => onChange("orange")}
          className={`flex items-center justify-between p-4 rounded-xl border text-left transition-all ${
            selected === "orange"
              ? "border-blue-600 bg-blue-50/20 text-blue-900 ring-2 ring-blue-600/20"
              : "border-gray-200 hover:bg-gray-50 text-gray-700"
          }`}
        >
          <div className="flex items-center gap-3">
            <div className="flex size-11 items-center justify-center rounded-lg bg-[#FF6600] overflow-hidden shrink-0 border border-orange-600">
              <span className="text-[16px] font-black text-white">OM</span>
            </div>
            <div>
              <p className="text-xs font-bold text-gray-950">Orange Money</p>
              <p className="text-[10px] text-gray-400 mt-0.5">Pay with OM</p>
            </div>
          </div>
          <div className="relative shrink-0">
            {selected === "orange" ? (
              <CheckCircle2 className="size-5 text-blue-600" />
            ) : (
              <div className="size-5 rounded-full border-2 border-gray-300" />
            )}
          </div>
        </button>
      </div>
    </div>
  );
}
