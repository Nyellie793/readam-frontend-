"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { ArrowLeft, Lock, CheckCircle2, XCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import PaymentMethodSelector, { PaymentMethod } from "@/components/payment/PaymentMethodSelector";
import PaymentDetailsForm from "@/components/payment/PaymentDetailsForm";
import OrderSummary from "@/components/payment/OrderSummary";
import STUDENT from "@/services/student.service";
import { errorMessage } from "@/lib/api";
import type { ProductResponse, PaymentResponse } from "@/types/api.types";
import { useTranslations } from "next-intl";

const POLL_INTERVAL_MS = 4000;
const POLL_TIMEOUT_MS = 3 * 60 * 1000;

type Stage = "loading" | "not-found" | "form" | "pending" | "still-pending" | "success" | "failed";

export default function SubscriptionCheckout({ productCode }: { productCode: string }) {
  const t = useTranslations("payment");
  const [product, setProduct] = useState<ProductResponse | null>(null);
  const [stage, setStage] = useState<Stage>("loading");
  const [method, setMethod] = useState<PaymentMethod>("mtn");
  const [submitting, setSubmitting] = useState(false);
  const [errorText, setErrorText] = useState<string | null>(null);
  const [paymentId, setPaymentId] = useState<string | null>(null);
  const [resolvedPayment, setResolvedPayment] = useState<PaymentResponse | null>(null);

  useEffect(() => {
    STUDENT.getProducts()
      .then((products) => {
        const found = products.find((p) => p.code === productCode) ?? null;
        setProduct(found);
        setStage(found ? "form" : "not-found");
      })
      .catch(() => setStage("not-found"));
  }, [productCode]);

  const checkOnce = useCallback(async (): Promise<boolean> => {
    if (!paymentId) return false;
    try {
      const payment = await STUDENT.getPayment(paymentId);
      if (payment.status === "successful" || payment.status === "failed" || payment.status === "expired") {
        setResolvedPayment(payment);
        setStage(payment.status === "successful" ? "success" : "failed");
        return true;
      }
    } catch {
      /* transient network error — keep polling */
    }
    return false;
  }, [paymentId]);

  useEffect(() => {
    if (stage !== "pending" || !paymentId) return;
    const startedAt = Date.now();
    let cancelled = false;

    async function loop() {
      const done = await checkOnce();
      if (cancelled || done) return;
      if (Date.now() - startedAt > POLL_TIMEOUT_MS) {
        setStage("still-pending");
        return;
      }
      setTimeout(loop, POLL_INTERVAL_MS);
    }
    loop();
    return () => {
      cancelled = true;
    };
  }, [stage, paymentId, checkOnce]);

  async function handlePay(phone: string) {
    if (!product) return;
    setSubmitting(true);
    setErrorText(null);
    try {
      const payment = await STUDENT.purchaseSubscription({
        product_code: product.code,
        phone,
        medium: method === "mtn" ? "mobile money" : "orange money",
      });
      setPaymentId(payment.id);

      /**
       * Direct pay pushes a USSD prompt to the handset and returns no link.
       * The hosted flow returns one, and the payment cannot complete unless
       * the student actually opens it, so send them straight there. The
       * webhook still confirms the payment either way, and the pending screen
       * is waiting when they come back.
       */
      if (payment.payment_link) {
        window.location.href = payment.payment_link;
        return;
      }
      setStage("pending");
    } catch (err) {
      setErrorText(errorMessage(err, t("couldNotStart")));
    } finally {
      setSubmitting(false);
    }
  }

  if (stage === "loading") {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="size-6 animate-spin text-blue-600" />
      </div>
    );
  }

  if (stage === "not-found" || !product) {
    return (
      <div className="mx-auto max-w-md space-y-3 py-16 text-center">
        <p className="text-lg font-bold text-gray-900">{t("unknownProduct")}</p>
        <p className="text-sm text-gray-500">This plan doesn&apos;t exist or is no longer available.</p>
        <Link href="/payment/ai-sessions" className="text-sm font-semibold text-blue-600 hover:underline">
          Back to AI Study Sessions
        </Link>
      </div>
    );
  }

  const orderItems = [{ name: product.name, subtitle: product.description, price: `${product.price_xaf.toLocaleString()} XAF` }];

  if (stage === "success" || stage === "failed") {
    const isSuccess = stage === "success";
    return (
      <div className="mx-auto max-w-xl space-y-6 rounded-3xl border border-gray-100 bg-white p-6 text-center shadow-md sm:p-8">
        <div className="flex justify-center">
          <div
            className={`flex size-16 items-center justify-center rounded-full border-4 ${
              isSuccess ? "border-emerald-100/50 bg-emerald-50 text-emerald-600" : "border-red-100/50 bg-red-50 text-red-600"
            }`}
          >
            {isSuccess ? <CheckCircle2 className="size-8" /> : <XCircle className="size-8" />}
          </div>
        </div>
        <div className="space-y-2">
          <h2 className="text-xl font-black text-gray-900 sm:text-2xl">
            {isSuccess ? t("success") : t("failed")}
          </h2>
          <p className="mx-auto max-w-sm text-xs leading-relaxed text-gray-500">
            {isSuccess
              ? t("successSubscription")
              : t("failedBody")}
          </p>
        </div>

        <div className="space-y-3 border-t border-gray-100 pt-5 text-left text-xs font-semibold text-gray-600">
          <div className="flex items-center justify-between">
            <span>{t("product")}</span>
            <span className="font-bold text-gray-900">{product.name}</span>
          </div>
          <div className="flex items-center justify-between">
            <span>{t("amount")}</span>
            <span className="font-bold text-gray-900">{(resolvedPayment?.amount ?? product.price_xaf).toLocaleString()} XAF</span>
          </div>
          {resolvedPayment?.medium && (
            <div className="flex items-center justify-between">
              <span>{t("method")}</span>
              <span className="font-bold text-gray-900">{resolvedPayment.medium}</span>
            </div>
          )}
        </div>

        <div className="flex flex-col gap-3 pt-2 sm:flex-row">
          {isSuccess ? (
            <Link href="/dashboard/ai-tutor/ai-hub" className="flex-1">
              <Button className="w-full rounded-xl bg-blue-600 text-xs font-bold hover:bg-blue-700">
                {t("startStudying")}
              </Button>
            </Link>
          ) : (
            <Button
              onClick={() => {
                setStage("form");
                setPaymentId(null);
                setResolvedPayment(null);
              }}
              className="flex-1 rounded-xl bg-blue-600 text-xs font-bold hover:bg-blue-700"
            >
              {t("tryAgain")}
            </Button>
          )}
          <Link href="/settings" className="flex-1">
            <Button variant="outline" className="w-full rounded-xl border-gray-200 text-xs font-bold text-gray-700">
              View Billing History
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  if (stage === "pending" || stage === "still-pending") {
    return (
      <div className="mx-auto max-w-xl space-y-5 rounded-3xl border border-gray-100 bg-white p-6 text-center shadow-md sm:p-8">
        <div className="flex justify-center">
          <Loader2 className="size-10 animate-spin text-blue-600" />
        </div>
        <h2 className="text-lg font-bold text-gray-900">{t("waiting")}</h2>
        <p className="mx-auto max-w-sm text-xs leading-relaxed text-gray-500">
          {stage === "pending"
            ? t("checkPhone")
            : t("stillPending")}
        </p>
        <Button
          variant="outline"
          onClick={() => checkOnce()}
          className="mx-auto w-fit rounded-xl border-gray-200 text-xs font-bold text-gray-700"
        >
          Check Status Now
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl space-y-6 px-4 py-8 sm:px-6 lg:px-8">
      <div className="flex items-center justify-between border-b border-gray-100 pb-5">
        <div className="flex items-center gap-3">
          <Link href="/payment/ai-sessions" className="text-gray-400 transition-colors hover:text-gray-600">
            <ArrowLeft className="size-5" />
          </Link>
          <span className="text-xl font-black text-blue-600">
            Read<span className="text-orange-500">Am</span>
          </span>
        </div>
        <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-600">
          <Lock className="size-4 shrink-0" />
          <span className="uppercase tracking-wider">{t("secureCheckout")}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <PaymentMethodSelector selected={method} onChange={setMethod} />
          <PaymentDetailsForm onPay={handlePay} loading={submitting} />
          {errorText && <p className="text-sm text-red-500">{errorText}</p>}
        </div>
        <div>
          <OrderSummary
            items={orderItems}
            total={`${product.price_xaf.toLocaleString()} XAF`}
          />
        </div>
      </div>
    </div>
  );
}
