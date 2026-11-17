"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useTranslations } from "next-intl";
import ReferralCodeBox from "@/components/referrals/ReferralCodeBox";
import REFERRAL from "@/services/referral.service";
import type { ReferralOverview } from "@/types/api.types";

/**
 * The settings-page summary of a user's referral code. It is a doorway: the
 * code, the three headline numbers, and a link to the full page.
 */
export default function ReferralSettingsCard() {
  const t = useTranslations("referrals");
  const [data, setData] = useState<ReferralOverview | null>(null);
  const [failed, setFailed] = useState(false);
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    REFERRAL.getMine()
      .then((d) => {
        setData(d);
        setFailed(false);
      })
      .catch(() => setFailed(true));
  }, [attempt]);

  return (
    <div className="space-y-5 rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
      {failed ? (
        <div className="flex items-center justify-between gap-3">
          <p className="text-sm text-red-500">{t("loadFailed")}</p>
          <button
            type="button"
            onClick={() => setAttempt((n) => n + 1)}
            className="rounded-xl border border-gray-200 bg-white px-3 py-1.5 text-xs font-semibold text-gray-700 hover:bg-gray-50"
          >
            {t("tryAgain")}
          </button>
        </div>
      ) : !data ? (
        <div className="h-24 animate-pulse rounded-xl bg-gray-100" />
      ) : (
        <>
          <p className="text-xs text-gray-500">{t("settingsBody")}</p>
          <ReferralCodeBox code={data.code} />
          <dl className="grid grid-cols-3 gap-3 border-t border-gray-50 pt-4 text-center">
            <div>
              <dd className="text-xl font-black tabular-nums text-gray-900">{data.signups}</dd>
              <dt className="text-[11px] text-gray-500">{t("signups")}</dt>
            </div>
            <div>
              <dd className="text-xl font-black tabular-nums text-gray-900">{data.buyers}</dd>
              <dt className="text-[11px] text-gray-500">{t("buyers")}</dt>
            </div>
            <div>
              <dd className="text-xl font-black tabular-nums text-gray-900">{data.purchases}</dd>
              <dt className="text-[11px] text-gray-500">{t("purchases")}</dt>
            </div>
          </dl>
          <Link
            href="/referrals"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 hover:underline"
          >
            {t("seeAll")}
            <ArrowRight className="size-3.5" />
          </Link>
        </>
      )}
    </div>
  );
}
