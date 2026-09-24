"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { CheckCircle2, Loader2, Ticket, X } from "lucide-react";
import { useTranslations } from "next-intl";
import STUDENT from "@/services/student.service";
import { ApiRequestError, errorMessage } from "@/lib/api";
import { cn } from "@/lib/utils";

type Status = "idle" | "checking" | "applied" | "invalid";

interface PromoCodeFieldProps {
  /**
   * A code that arrived in the URL (`/checkout?course=…&promo=JANE10`), so an
   * influencer's own link applies itself. Applied once, on mount; the student
   * can still clear or replace it.
   */
  initialCode?: string | null;
  /** The canonical code to send with the payment, or null when none is applied. */
  onChange: (code: string | null) => void;
  disabled?: boolean;
}

/**
 * Influencer / referral code entry for the course checkout.
 *
 * The code is checked with the API before "Pay" is pressed, so a typo is
 * caught while the student can still fix it rather than failing the payment
 * request. It is attribution only: the price shown never changes.
 */
export default function PromoCodeField({ initialCode, onChange, disabled }: PromoCodeFieldProps) {
  const t = useTranslations("payment");
  const [value, setValue] = useState(initialCode?.trim() ?? "");
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string | null>(null);
  const autoAppliedRef = useRef(false);

  const apply = useCallback(
    async (raw: string) => {
      const trimmed = raw.trim();
      if (!trimmed) return;
      setStatus("checking");
      setError(null);
      try {
        const { code } = await STUDENT.checkPromoCode(trimmed);
        setValue(code);
        setStatus("applied");
        onChange(code);
      } catch (err) {
        setStatus("invalid");
        // The only 400 this endpoint returns is "not recognised", so show it in
        // the student's language rather than the server's English detail.
        setError(
          err instanceof ApiRequestError && err.status === 400
            ? t("promoInvalid")
            : errorMessage(err, t("promoInvalid"))
        );
        onChange(null);
      }
    },
    [onChange, t]
  );

  // Runs once per mount, whatever initialCode is: it must not fire again when
  // the parent echoes an applied code back through this prop.
  useEffect(() => {
    if (autoAppliedRef.current) return;
    autoAppliedRef.current = true;
    if (initialCode && initialCode.trim()) void apply(initialCode);
  }, [initialCode, apply]);

  function clear() {
    setValue("");
    setStatus("idle");
    setError(null);
    onChange(null);
  }

  function handleInput(next: string) {
    setValue(next.toUpperCase());
    if (status !== "idle") {
      // Editing an applied or rejected code un-applies it until re-checked.
      setStatus("idle");
      setError(null);
      onChange(null);
    }
  }

  const applied = status === "applied";
  const checking = status === "checking";

  return (
    <div className="border border-gray-100 bg-white p-6 shadow-sm rounded-2xl">
      <div className="mb-3 flex items-center gap-2">
        <Ticket className="size-4 text-blue-600" />
        <h3 className="text-base font-bold text-gray-900">{t("promoTitle")}</h3>
      </div>
      <p className="mb-4 text-xs leading-relaxed text-gray-500">{t("promoHint")}</p>

      <div className="flex gap-2">
        <div
          className={cn(
            "relative flex h-12 flex-1 items-center overflow-hidden rounded-xl border bg-white shadow-inner transition-colors",
            applied
              ? "border-emerald-300 bg-emerald-50/40"
              : status === "invalid"
                ? "border-red-300"
                : "border-gray-200 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-100"
          )}
        >
          <input
            id="promoCode"
            type="text"
            inputMode="text"
            autoCapitalize="characters"
            autoCorrect="off"
            spellCheck={false}
            value={value}
            onChange={(e) => handleInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                if (!applied && !checking) void apply(value);
              }
            }}
            placeholder={t("promoPlaceholder")}
            maxLength={32}
            disabled={disabled || checking || applied}
            aria-invalid={status === "invalid"}
            aria-describedby="promoCodeStatus"
            className="flex-1 bg-transparent px-4 text-sm font-bold uppercase tracking-widest text-gray-950 outline-none placeholder:font-normal placeholder:normal-case placeholder:tracking-normal placeholder:text-gray-300 disabled:opacity-70"
          />
          {applied && <CheckCircle2 className="mr-3 size-5 shrink-0 text-emerald-600" />}
        </div>

        {applied ? (
          <button
            type="button"
            onClick={clear}
            disabled={disabled}
            className="flex h-12 items-center gap-1.5 rounded-xl border border-gray-200 bg-white px-4 text-xs font-bold text-gray-700 transition-colors hover:bg-gray-50 disabled:opacity-60"
          >
            <X className="size-3.5" />
            {t("promoRemove")}
          </button>
        ) : (
          <button
            type="button"
            onClick={() => void apply(value)}
            disabled={disabled || checking || value.trim().length < 3}
            className="flex h-12 min-w-24 items-center justify-center gap-2 rounded-xl bg-gray-900 px-4 text-xs font-bold text-white transition-colors hover:bg-gray-800 disabled:opacity-50"
          >
            {checking ? (
              <>
                <Loader2 className="size-3.5 animate-spin" />
                {t("promoChecking")}
              </>
            ) : (
              t("promoApply")
            )}
          </button>
        )}
      </div>

      <p
        id="promoCodeStatus"
        role="status"
        className={cn(
          "mt-2 min-h-4 text-xs font-semibold",
          applied ? "text-emerald-600" : "text-red-500"
        )}
      >
        {applied ? `${t("promoApplied")} · ${value}` : error}
      </p>
    </div>
  );
}
