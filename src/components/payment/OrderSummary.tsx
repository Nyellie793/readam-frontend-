"use client";

import { CheckCircle2 } from "lucide-react";

export interface OrderItem {
  name: string;
  subtitle?: string;
  price: string;
  image?: string;
}

interface OrderSummaryProps {
  title?: string;
  items?: OrderItem[];
  subtotal?: string;
  tax?: string;
  fee?: string;
  total: string;
}

export default function OrderSummary({
  title = "Order Summary",
  items,
  subtotal,
  tax,
  fee,
  total,
}: OrderSummaryProps) {
  // Fallback defaults if no items are passed
  const displayItems = items || [
    {
      name: "Advanced Mathematics for Baccalauréat (Series C)",
      subtitle: "Full Course Access",
      price: "15,000 XAF",
    },
  ];

  return (
    <div className="border border-gray-100 bg-white shadow-sm rounded-2xl overflow-hidden">
      <div className="border-b border-gray-50 p-5 bg-blue-50/20">
        <h3 className="text-base font-bold text-gray-900">{title}</h3>
      </div>

      <div className="p-5 space-y-5">
        {/* Item List */}
        <div className="space-y-4">
          {displayItems.map((item, idx) => (
            <div key={idx} className="flex gap-3 items-center">
              <div className="size-14 rounded-xl border border-gray-100 bg-gray-50 flex items-center justify-center overflow-hidden shrink-0">
                {/* Visual fallback for drafting compasses or notebook icon */}
                <div className="bg-blue-100 text-blue-700 font-bold text-[10px] w-full h-full flex items-center justify-center p-1.5 select-none text-center">
                  📚 Math
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-xs font-bold text-gray-900 leading-snug truncate">
                  {item.name}
                </h4>
                {item.subtitle && (
                  <p className="text-[10px] text-gray-400 mt-0.5">{item.subtitle}</p>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Breakdowns */}
        <div className="space-y-2.5 pt-4 border-t border-gray-50 text-xs font-semibold text-gray-600">
          {subtotal && (
            <div className="flex justify-between items-center">
              <span>Subtotal</span>
              <span className="text-gray-900">{subtotal}</span>
            </div>
          )}

          {tax && (
            <div className="flex justify-between items-center">
              <span>Tax (VAT 19.25%)</span>
              <span className="text-gray-900">{tax}</span>
            </div>
          )}

          {fee && (
            <div className="flex justify-between items-center">
              <span>Platform Fee</span>
              <span className="text-gray-900">{fee}</span>
            </div>
          )}

          {/* If neither subtotal nor tax is passed, we show course price to match checkout design */}
          {!subtotal && !fee && (
            <div className="flex justify-between items-center">
              <span>Course Price</span>
              <span className="text-gray-900">{displayItems[0]?.price}</span>
            </div>
          )}
          
          {!subtotal && tax && !fee && (
            <div className="flex justify-between items-center">
              <span>Tax (VAT 19.25%)</span>
              <span className="text-gray-900">{tax}</span>
            </div>
          )}
        </div>

        {/* Total Price */}
        <div className="flex justify-between items-baseline pt-4 border-t border-dashed border-gray-200">
          <span className="text-sm font-extrabold text-gray-900">Total</span>
          <span className="text-lg font-black text-blue-600 tracking-wide">{total}</span>
        </div>

        {/* Guarantee Banner */}
        <div className="flex items-center gap-2 rounded-xl bg-emerald-50 border border-emerald-100 p-3.5 text-xs text-emerald-800">
          <CheckCircle2 className="size-4 text-emerald-600 shrink-0" />
          <span className="font-bold">Money Back Guarantee (24h)</span>
        </div>
      </div>
    </div>
  );
}
