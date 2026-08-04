"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Bell } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";
import { Switch } from "@/components/ui/switch";
import { Skeleton } from "@/components/ui/skeleton";
import TUTOR from "@/services/tutor.service";
import { errorMessage } from "@/lib/api";
import type { TutorNotificationPrefsResponse } from "@/types/api.types";
import { useTranslations } from "next-intl";


export default function TutorNotificationsCard() {
  const t = useTranslations("tutor");
  const PREFS: { key: keyof Omit<TutorNotificationPrefsResponse, "user_id">; label: string; description: string }[] = [
    {
      key: "email_notifications",
      label: t("emailNotifications"),
      description: t("emailNotifDesc"),
    },
    {
      key: "push_alerts",
      label: "Push Alerts",
      description: "Real-time alerts for new enrollments and reviews.",
    },
    {
      key: "marketing_tips",
      label: t("marketingTips"),
      description: t("marketingTipsDesc"),
    },
  ];
  const [prefs, setPrefs] = useState<TutorNotificationPrefsResponse | null>(null);
  const [saving, setSaving] = useState<string | null>(null);

  useEffect(() => {
    TUTOR.getNotificationPrefs()
      .then(setPrefs)
      .catch(() => null);
  }, []);

  async function toggle(key: (typeof PREFS)[number]["key"]) {
    if (!prefs) return;
    const nextValue = !prefs[key];
    setPrefs({ ...prefs, [key]: nextValue });
    setSaving(key);
    try {
      const updated = await TUTOR.updateNotificationPrefs({ [key]: nextValue });
      setPrefs(updated);
    } catch (err) {
      setPrefs(prefs);
      toast.error(errorMessage(err, t("errPref")));
    } finally {
      setSaving(null);
    }
  }

  return (
    <Card className="border border-gray-100 shadow-sm rounded-2xl overflow-hidden bg-white">
      <CardHeader className="border-b border-gray-50 pb-5">
        <div className="flex items-center gap-2">
          <Bell className="size-4 text-blue-600" />
          <CardTitle className="text-base font-bold text-gray-900">{t("notifications")}</CardTitle>
        </div>
        <CardDescription className="text-xs text-gray-500">{t("chooseWhat")}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-1 pt-6">
        {!prefs
          ? Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="mb-3 h-14 rounded-xl" />)
          : PREFS.map((item) => (
              <div key={item.key} className="flex items-center justify-between gap-4 py-3">
                <div>
                  <p className="text-sm font-semibold text-gray-800">{item.label}</p>
                  <p className="text-xs text-gray-500">{item.description}</p>
                </div>
                <Switch
                  checked={prefs[item.key]}
                  disabled={saving === item.key}
                  onCheckedChange={() => toggle(item.key)}
                />
              </div>
            ))}
      </CardContent>
    </Card>
  );
}
