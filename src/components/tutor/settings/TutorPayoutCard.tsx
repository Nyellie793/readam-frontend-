"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Save, Loader2, Wallet } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import TUTOR from "@/services/tutor.service";
import { errorMessage } from "@/lib/api";
import { useTranslations } from "next-intl";

export default function TutorPayoutCard() {
  const t = useTranslations("tutor");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [mtnNumber, setMtnNumber] = useState("");
  const [orangeNumber, setOrangeNumber] = useState("");

  useEffect(() => {
    TUTOR.getPayout()
      .then((payout) => {
        setMtnNumber(payout.mtn_number ?? "");
        setOrangeNumber(payout.orange_money_number ?? "");
      })
      .catch(() => null)
      .finally(() => setLoading(false));
  }, []);

  async function handleSave() {
    setSaving(true);
    try {
      await TUTOR.updatePayout({
        mtn_number: mtnNumber || undefined,
        orange_money_number: orangeNumber || undefined,
      });
      toast.success(t("payoutUpdated"));
    } catch (err) {
      toast.error(errorMessage(err, t("errPayoutDetails")));
    } finally {
      setSaving(false);
    }
  }

  return (
    <Card className="border border-gray-100 shadow-sm rounded-2xl overflow-hidden bg-white">
      <CardHeader className="border-b border-gray-50 pb-5">
        <div className="flex items-center gap-2">
          <Wallet className="size-4 text-blue-600" />
          <CardTitle className="text-base font-bold text-gray-900">{t("payoutDetails")}</CardTitle>
        </div>
        <CardDescription className="text-xs text-gray-500">
          Where your earnings are sent when you request a withdrawal.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6 pt-6">
        {loading ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Skeleton className="h-10 rounded-xl" />
            <Skeleton className="h-10 rounded-xl" />
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-700">{t("mtnNumber")}</label>
                <Input
                  value={mtnNumber}
                  onChange={(e) => setMtnNumber(e.target.value)}
                  placeholder={t("phonePh")}
                  className="h-10 rounded-xl"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-700">{t("omNumber")}</label>
                <Input
                  value={orangeNumber}
                  onChange={(e) => setOrangeNumber(e.target.value)}
                  placeholder={t("phonePh")}
                  className="h-10 rounded-xl"
                />
              </div>
            </div>

            <div className="flex justify-end border-t border-gray-50 pt-2">
              <Button
                type="button"
                onClick={handleSave}
                disabled={saving}
                className="flex h-10 items-center gap-2 rounded-xl bg-blue-600 px-5 text-xs font-semibold text-white shadow-sm transition-colors hover:bg-blue-700"
              >
                {saving ? <Loader2 className="size-3.5 animate-spin" /> : <Save className="size-3.5" />}
                {saving ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
