"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { CheckCircle2, Clock, Loader2 } from "lucide-react";
import STUDENT from "@/services/student.service";
import type { MySubscriptionsResponse } from "@/types/api.types";

/**
 * Where Fapshi's hosted checkout returns the payer.
 *
 * Fapshi redirects here after payment with no reliable parameters, so the
 * outcome is read from our own side instead: the webhook grants the
 * entitlement, and this polls until it shows up.
 *
 * Polling rather than trusting the redirect, because arriving here only means
 * the payer finished on Fapshi's page — not that the webhook has landed yet.
 * The two race, and the webhook is the one that actually matters.
 */
const POLL_INTERVAL_MS = 2_000;
const GIVE_UP_AFTER_MS = 45_000;

type Outcome = "checking" | "granted" | "slow";

export default function PaymentStatusPage() {
  const [outcome, setOutcome] = useState<Outcome>("checking");
  const [elapsed, setElapsed] = useState(0);

  const check = useCallback(async (): Promise<boolean> => {
    try {
      const subs = (await STUDENT.getSubscriptions()) as MySubscriptionsResponse;
      return subs.can_start_ai_session === true || subs.entitlements.length > 0;
    } catch {
      // Not signed in, or a transient failure. Keep polling; the timeout below
      // stops this running forever.
      return false;
    }
  }, []);

  useEffect(() => {
    let cancelled = false;
    const started = Date.now();

    async function tick() {
      if (cancelled) return;
      if (await check()) {
        if (!cancelled) setOutcome("granted");
        return;
      }
      const waited = Date.now() - started;
      if (!cancelled) setElapsed(waited);
      if (waited >= GIVE_UP_AFTER_MS) {
        if (!cancelled) setOutcome("slow");
        return;
      }
      setTimeout(tick, POLL_INTERVAL_MS);
    }

    void tick();
    return () => {
      cancelled = true;
    };
  }, [check]);

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#F7F8FC] px-6">
      <div className="w-full max-w-md rounded-2xl border border-gray-100 bg-white p-8 text-center shadow-sm">
        {outcome === "checking" && (
          <>
            <div className="mx-auto flex size-14 items-center justify-center rounded-full bg-blue-50">
              <Loader2 className="size-7 animate-spin text-blue-600" />
            </div>
            <h1 className="mt-5 text-xl font-black text-gray-900">Confirming your payment</h1>
            <p className="mt-2 text-sm leading-relaxed text-gray-500">
              This usually takes a few seconds. Do not close this page.
            </p>
            {elapsed > 12_000 && (
              <p className="mt-3 text-xs text-gray-400">
                Still waiting on the mobile money network. Your money is safe.
              </p>
            )}
          </>
        )}

        {outcome === "granted" && (
          <>
            <div className="mx-auto flex size-14 items-center justify-center rounded-full bg-teal-50">
              <CheckCircle2 className="size-7 text-teal-600" />
            </div>
            <h1 className="mt-5 text-xl font-black text-gray-900">Payment received</h1>
            <p className="mt-2 text-sm leading-relaxed text-gray-500">
              Your AI sessions are ready to use.
            </p>
            <Link
              href="/dashboard/ai-tutor/ai-hub"
              className="mt-6 inline-block w-full rounded-xl bg-blue-600 px-6 py-3 text-sm font-bold text-white transition hover:bg-blue-700"
            >
              Start studying
            </Link>
            <Link
              href="/dashboard"
              className="mt-3 inline-block text-sm font-semibold text-gray-500 hover:text-gray-800"
            >
              Back to dashboard
            </Link>
          </>
        )}

        {outcome === "slow" && (
          <>
            <div className="mx-auto flex size-14 items-center justify-center rounded-full bg-orange-50">
              <Clock className="size-7 text-orange-500" />
            </div>
            <h1 className="mt-5 text-xl font-black text-gray-900">Still processing</h1>
            <p className="mt-2 text-sm leading-relaxed text-gray-500">
              Mobile money can take a few minutes to confirm. If you were charged, your
              sessions will appear automatically — there is no need to pay again.
            </p>
            <Link
              href="/payment"
              className="mt-6 inline-block w-full rounded-xl border border-gray-200 px-6 py-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
            >
              Check my payments
            </Link>
            <Link
              href="/dashboard"
              className="mt-3 inline-block text-sm font-semibold text-gray-500 hover:text-gray-800"
            >
              Back to dashboard
            </Link>
          </>
        )}
      </div>
    </main>
  );
}
