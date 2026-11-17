"use client";

import { useCallback, useEffect, useState } from "react";
import { ShoppingBag, UserPlus, Users } from "lucide-react";
import { useTranslations } from "next-intl";
import ReferralCodeBox from "@/components/referrals/ReferralCodeBox";
import ReferredPeopleList from "@/components/referrals/ReferredPeopleList";
import REFERRAL from "@/services/referral.service";
import { errorMessage } from "@/lib/api";
import { cn } from "@/lib/utils";
import type { ReferralOverview } from "@/types/api.types";

function Stat({
  label,
  sub,
  value,
  icon: Icon,
  tone,
}: {
  label: string;
  sub: string;
  value: number;
  icon: React.ComponentType<{ className?: string }>;
  tone: string;
}) {
  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <p className="text-xs font-semibold text-gray-500">{label}</p>
        <span className={cn("flex size-8 items-center justify-center rounded-lg", tone)}>
          <Icon className="size-4" />
        </span>
      </div>
      <p className="mt-3 text-2xl font-black tabular-nums text-gray-900">{value}</p>
      <p className="mt-1 text-xs text-gray-400">{sub}</p>
    </div>
  );
}

/**
 * The dedicated referral page: the user's code, how it is doing, and who it
 * brought in. Activity only — no money is shown, because how referrers are
 * rewarded has not been decided.
 */
export default function ReferralsContent() {
  const t = useTranslations("referrals");
  const [data, setData] = useState<ReferralOverview | null>(null);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(() => {
    setError(null);
    REFERRAL.getMine()
      .then(setData)
      .catch((e) => setError(errorMessage(e, t("loadFailed"))));
  }, [t]);

  useEffect(() => {
    load();
  }, [load]);

  return (
    <main className="max-w-4xl flex-1 space-y-6 p-4 sm:p-6 lg:p-8">
      <div>
        <h1 className="text-2xl font-black text-gray-900 sm:text-3xl">{t("title")}</h1>
        <p className="mt-1 text-xs text-gray-500">{t("subtitle")}</p>
      </div>

      {error ? (
        <div className="flex items-center justify-between gap-3 rounded-2xl border border-red-100 bg-red-50/60 p-5">
          <p className="text-sm text-red-700">{error}</p>
          <button
            type="button"
            onClick={load}
            className="rounded-xl border border-gray-200 bg-white px-3 py-1.5 text-xs font-semibold text-gray-700 hover:bg-gray-50"
          >
            {t("tryAgain")}
          </button>
        </div>
      ) : !data ? (
        <>
          <div className="h-36 animate-pulse rounded-2xl bg-gray-100" />
          <div className="grid gap-4 sm:grid-cols-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-28 animate-pulse rounded-2xl bg-gray-100" />
            ))}
          </div>
        </>
      ) : (
        <>
          <section className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-wide text-blue-600">
              {t("yourCode")}
            </p>
            <div className="mt-3">
              <ReferralCodeBox code={data.code} />
            </div>
            {!data.is_active && (
              <p className="mt-4 rounded-xl bg-orange-50 px-3 py-2 text-xs text-orange-700">
                {t("inactiveHint")}
              </p>
            )}
          </section>

          <div className="grid gap-4 sm:grid-cols-3">
            <Stat
              label={t("signups")}
              sub={t("signupsSub")}
              value={data.signups}
              icon={UserPlus}
              tone="bg-blue-50 text-blue-600"
            />
            <Stat
              label={t("buyers")}
              sub={t("buyersSub")}
              value={data.buyers}
              icon={Users}
              tone="bg-orange-50 text-orange-500"
            />
            <Stat
              label={t("purchases")}
              sub={t("purchasesSub")}
              value={data.purchases}
              icon={ShoppingBag}
              tone="bg-teal-50 text-teal-600"
            />
          </div>

          <ReferredPeopleList />
        </>
      )}
    </main>
  );
}
