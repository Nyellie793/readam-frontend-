"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Loader2, Send } from "lucide-react";
import { cn } from "@/lib/utils";
import TUTOR from "@/services/tutor.service";
import { errorMessage } from "@/lib/api";
import { useTranslations } from "next-intl";

interface RequestPayoutCardProps {
  pendingBalance: number;
  onPayoutRequested: () => void;
}

export default function RequestPayoutCard({ pendingBalance, onPayoutRequested }: RequestPayoutCardProps) {
  const t = useTranslations("tutor");
  const [method, setMethod] = useState<"mtn" | "orange">("mtn");
  const [phone, setPhone] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const canSubmit = pendingBalance > 0 && phone.trim().length >= 9;

  async function handleRequest() {
    setSubmitting(true);
    try {
      await TUTOR.requestPayout({
        phone: phone.trim(),
        medium: method === "mtn" ? "mobile money" : "orange money",
      });
      toast.success(t("payoutRequested"));
      setPhone("");
      onPayoutRequested();
    } catch (err) {
      toast.error(errorMessage(err, t("errPayout")));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
      <h2 className="text-sm font-bold text-gray-900">{t("withdraw")}</h2>
      <p className="mt-1 text-xs text-gray-500">
        Your full pending balance of{" "}
        <span className="font-semibold text-gray-700">{pendingBalance.toLocaleString()} XAF</span> will be sent.
      </p>

      <div className="mt-4 grid grid-cols-2 gap-3">
        <button
          type="button"
          onClick={() => setMethod("mtn")}
          className={cn(
            "flex h-11 items-center justify-center gap-2 rounded-xl border text-sm font-semibold transition-colors",
            method === "mtn" ? "border-blue-600 bg-blue-50 text-blue-700" : "border-gray-200 text-gray-600"
          )}
        >
          MTN MoMo
        </button>
        <button
          type="button"
          onClick={() => setMethod("orange")}
          className={cn(
            "flex h-11 items-center justify-center gap-2 rounded-xl border text-sm font-semibold transition-colors",
            method === "orange" ? "border-orange-500 bg-orange-50 text-orange-600" : "border-gray-200 text-gray-600"
          )}
        >
          Orange Money
        </button>
      </div>

      <div className="mt-4 space-y-1.5">
        <label className="text-xs font-semibold text-gray-700">{t("phoneNumber")}</label>
        <input
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder={t("phonePh")}
          className="h-11 w-full rounded-xl border border-gray-200 px-3.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
        />
      </div>

      <button
        type="button"
        onClick={handleRequest}
        disabled={!canSubmit || submitting}
        className="mt-4 flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-blue-600 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {submitting ? <Loader2 className="size-4 animate-spin" /> : <Send className="size-4" />}
        {pendingBalance === 0 ? t("noBalance") : "Request Payout"}
      </button>
    </div>
  );
}
