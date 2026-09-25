"use client";

import { Suspense, useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { CheckCircle2, Clock, Loader2, XCircle } from "lucide-react";
import { useTranslations } from "next-intl";
import STUDENT from "@/services/student.service";
import { ApiRequestError } from "@/lib/api";
import type { MySubscriptionsResponse, PaymentResponse } from "@/types/api.types";

/**
 * Where Fapshi's hosted checkout returns the payer.
 *
 * Fapshi redirects here with no reliable parameters of its own, so the
 * outcome is read from our side. The backend now puts our payment id on the
 * redirect URL (`?payment=`), and the page polls that exact payment until the
 * webhook resolves it — for a course purchase as much as an AI subscription.
 *
 * Polling rather than trusting the redirect, because arriving here only means
 * the payer finished on Fapshi's page — not that the webhook has landed yet.
 * The two race, and the webhook is the one that actually matters.
 *
 * Links issued before the id was added have no `?payment=`; those fall back
 * to the original behaviour of watching for an AI entitlement to appear.
 */
const POLL_INTERVAL_MS = 2_000;
const GIVE_UP_AFTER_MS = 3 * 60 * 1000;
const LEGACY_GIVE_UP_AFTER_MS = 45_000;

type Outcome = "checking" | "success" | "failed" | "slow" | "not-found";

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#F7F8FC] px-6">
      <div className="w-full max-w-md rounded-2xl border border-gray-100 bg-white p-8 text-center shadow-sm">
        {children}
      </div>
    </main>
  );
}

/** One known payment: poll it until Fapshi's webhook has settled it. */
function PaymentOutcome({ paymentId }: { paymentId: string }) {
  const t = useTranslations("payment");
  const [outcome, setOutcome] = useState<Outcome>("checking");
  const [payment, setPayment] = useState<PaymentResponse | null>(null);
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    let cancelled = false;
    const started = Date.now();

    async function tick() {
      if (cancelled) return;
      try {
        const p = await STUDENT.getPayment(paymentId);
        if (cancelled) return;
        setPayment(p);
        if (p.status === "successful") {
          setOutcome("success");
          return;
        }
        if (p.status === "failed" || p.status === "expired") {
          setOutcome("failed");
          return;
        }
      } catch (e) {
        if (cancelled) return;
        // 404/403: not ours or not there. 400/422: the id itself is malformed,
        // which no amount of polling will fix.
        if (e instanceof ApiRequestError && [400, 403, 404, 422].includes(e.status)) {
          setOutcome("not-found");
          return;
        }
        // Transient: keep polling; the timeout below stops this running forever.
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
  }, [paymentId]);

  // What was bought decides the copy, the destination, and where a retry
  // goes. A Past Questions bundle has no course_id and is not an AI
  // subscription, so it needs its own branch.
  const kind: "course" | "bundle" | "subscription" =
    payment?.payment_type === "course"
      ? "course"
      : payment?.payment_type === "past_questions_bundle"
        ? "bundle"
        : "subscription";
  const successHref =
    kind === "course"
      ? `/dashboard/courses/${payment?.course_id}`
      : kind === "bundle"
        ? "/dashboard/my-learning"
        : "/dashboard/ai-tutor/ai-hub";
  const successBody =
    kind === "course"
      ? t("successCourse")
      : kind === "bundle"
        ? t("successPastQ")
        : t("successSubscription");
  const successCta =
    kind === "course" ? t("startLearning") : kind === "bundle" ? t("goToMyCourses") : t("startStudying");
  const retryHref =
    kind === "course" ? `/checkout?course=${payment?.course_id}` : kind === "bundle" ? "/payment" : "/payment/ai-sessions";

  if (outcome === "checking") {
    return (
      <>
        <div className="mx-auto flex size-14 items-center justify-center rounded-full bg-blue-50">
          <Loader2 className="size-7 animate-spin text-blue-600" />
        </div>
        <h1 className="mt-5 text-xl font-black text-gray-900">{t("confirming")}</h1>
        <p className="mt-2 text-sm leading-relaxed text-gray-500">{t("confirmingBody")}</p>
        {elapsed > 12_000 && (
          <p className="mt-3 text-xs text-gray-400">{t("stillWaitingNetwork")}</p>
        )}
      </>
    );
  }

  if (outcome === "success") {
    return (
      <>
        <div className="mx-auto flex size-14 items-center justify-center rounded-full bg-teal-50">
          <CheckCircle2 className="size-7 text-teal-600" />
        </div>
        <h1 className="mt-5 text-xl font-black text-gray-900">{t("received")}</h1>
        <p className="mt-2 text-sm leading-relaxed text-gray-500">{successBody}</p>
        <Link
          href={successHref}
          className="mt-6 inline-block w-full rounded-xl bg-blue-600 px-6 py-3 text-sm font-bold text-white transition hover:bg-blue-700"
        >
          {successCta}
        </Link>
        <Link
          href="/dashboard"
          className="mt-3 inline-block text-sm font-semibold text-gray-500 hover:text-gray-800"
        >
          {t("backToDashboard")}
        </Link>
      </>
    );
  }

  if (outcome === "failed") {
    return (
      <>
        <div className="mx-auto flex size-14 items-center justify-center rounded-full bg-red-50">
          <XCircle className="size-7 text-red-600" />
        </div>
        <h1 className="mt-5 text-xl font-black text-gray-900">{t("failed")}</h1>
        <p className="mt-2 text-sm leading-relaxed text-gray-500">{t("failedBody")}</p>
        <Link
          href={retryHref}
          className="mt-6 inline-block w-full rounded-xl bg-blue-600 px-6 py-3 text-sm font-bold text-white transition hover:bg-blue-700"
        >
          {t("tryAgain")}
        </Link>
        <Link
          href="/dashboard"
          className="mt-3 inline-block text-sm font-semibold text-gray-500 hover:text-gray-800"
        >
          {t("backToDashboard")}
        </Link>
      </>
    );
  }

  if (outcome === "not-found") {
    return (
      <>
        <div className="mx-auto flex size-14 items-center justify-center rounded-full bg-orange-50">
          <Clock className="size-7 text-orange-500" />
        </div>
        <h1 className="mt-5 text-xl font-black text-gray-900">{t("notFoundPaymentTitle")}</h1>
        <p className="mt-2 text-sm leading-relaxed text-gray-500">{t("notFoundPayment")}</p>
        <Link
          href="/settings"
          className="mt-6 inline-block w-full rounded-xl border border-gray-200 px-6 py-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
        >
          {t("billingHistory")}
        </Link>
      </>
    );
  }

  return (
    <>
      <div className="mx-auto flex size-14 items-center justify-center rounded-full bg-orange-50">
        <Clock className="size-7 text-orange-500" />
      </div>
      <h1 className="mt-5 text-xl font-black text-gray-900">{t("stillProcessing")}</h1>
      <p className="mt-2 text-sm leading-relaxed text-gray-500">{t("stillProcessingBody")}</p>
      <Link
        href="/settings"
        className="mt-6 inline-block w-full rounded-xl border border-gray-200 px-6 py-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
      >
        {t("checkPayments")}
      </Link>
      <Link
        href="/dashboard"
        className="mt-3 inline-block text-sm font-semibold text-gray-500 hover:text-gray-800"
      >
        {t("backToDashboard")}
      </Link>
    </>
  );
}

/** Links issued before the payment id was added: watch for an AI entitlement. */
function LegacySubscriptionOutcome() {
  const [outcome, setOutcome] = useState<"checking" | "granted" | "slow">("checking");
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
      if (waited >= LEGACY_GIVE_UP_AFTER_MS) {
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
    <>
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
    </>
  );
}

const LEADING_UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/i;

function StatusContent() {
  // Fapshi's docs do not say whether it appends its own parameters to the
  // redirect. If it ever does so naively ("?payment=<uuid>?transId=…"), the
  // id is still there at the front, so take that. A value with no id at the
  // front is passed through as-is: the API answers 422 and the page shows
  // "payment not found" rather than silently watching for an AI entitlement.
  const raw = useSearchParams().get("payment");
  const paymentId = raw ? (raw.match(LEADING_UUID_RE)?.[0] ?? raw) : null;
  return (
    <Shell>
      {paymentId ? <PaymentOutcome paymentId={paymentId} /> : <LegacySubscriptionOutcome />}
    </Shell>
  );
}

export default function PaymentStatusPage() {
  return (
    <Suspense
      fallback={
        <Shell>
          <div className="mx-auto flex size-14 items-center justify-center rounded-full bg-blue-50">
            <Loader2 className="size-7 animate-spin text-blue-600" />
          </div>
        </Shell>
      }
    >
      <StatusContent />
    </Suspense>
  );
}
