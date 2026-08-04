"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/Card";
import { toast } from "sonner";
import STUDENT from "@/services/student.service";
import { ApiRequestError } from "@/lib/api";
import { useTranslations } from "next-intl";

// Custom Switch component for clean styling and state management
function Switch({
  checked,
  onCheckedChange,
  id,
}: {
  checked: boolean;
  onCheckedChange: (val: boolean) => void;
  id?: string;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      id={id}
      onClick={() => onCheckedChange(!checked)}
      className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-100 ${
        checked ? "bg-blue-600" : "bg-gray-200"
      }`}
    >
      <span
        aria-hidden="true"
        className={`pointer-events-none inline-block size-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
          checked ? "translate-x-5" : "translate-x-0"
        }`}
      />
    </button>
  );
}

type NotificationKey = "email_alerts" | "study_reminders" | "weekly_digest";

export default function PreferencesToggles() {
  const t = useTranslations("settings");
  const [prefs, setPrefs] = useState<Record<NotificationKey, boolean>>({
    email_alerts: true,
    study_reminders: true,
    weekly_digest: false,
  });
  const [loading, setLoading] = useState(true);
  // Dark mode is intentionally left decorative — see ThemeToggle.tsx for why.
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    STUDENT.getNotificationPrefs()
      .then((data) =>
        setPrefs({
          email_alerts: data.email_alerts,
          study_reminders: data.study_reminders,
          weekly_digest: data.weekly_digest,
        })
      )
      .catch(() => null)
      .finally(() => setLoading(false));
  }, []);

  async function handleToggle(key: NotificationKey) {
    const next = !prefs[key];
    setPrefs((prev) => ({ ...prev, [key]: next }));
    try {
      await STUDENT.updateNotificationPrefs({ [key]: next });
      toast.success(t("prefUpdated"));
    } catch (err) {
      setPrefs((prev) => ({ ...prev, [key]: !next })); // revert on failure
      toast.error(err instanceof ApiRequestError ? err.detail : t("prefFailed"));
    }
  }

  return (
    <Card className="border border-gray-100 shadow-sm rounded-2xl overflow-hidden bg-white">
      <CardContent className="p-6 space-y-6">
        {/* Notifications Group */}
        <div className="space-y-4">
          <div>
            <h3 className="text-sm font-bold text-gray-800">{t("notificationChannels")}</h3>
            <p className="text-xs text-gray-500 mt-1">{t("notificationChannelsDesc")}</p>
          </div>

          <div className="space-y-3.5">
            <div className="flex items-center justify-between py-1">
              <div>
                <p className="text-xs font-bold text-gray-800">{t("emailAlerts")}</p>
                <p className="text-[11px] text-gray-400 mt-0.5">{t("emailAlertsDesc")}</p>
              </div>
              <Switch
                checked={prefs.email_alerts}
                onCheckedChange={() => handleToggle("email_alerts")}
              />
            </div>

            <div className="flex items-center justify-between py-1 border-t border-gray-50 pt-3">
              <div>
                <p className="text-xs font-bold text-gray-800">{t("aiReminders")}</p>
                <p className="text-[11px] text-gray-400 mt-0.5">{t("aiRemindersDesc")}</p>
              </div>
              <Switch
                checked={prefs.study_reminders}
                onCheckedChange={() => handleToggle("study_reminders")}
              />
            </div>

            <div className="flex items-center justify-between py-1 border-t border-gray-50 pt-3">
              <div>
                <p className="text-xs font-bold text-gray-800">{t("weeklyDigest")}</p>
                <p className="text-[11px] text-gray-400 mt-0.5">{t("weeklyDigestDesc")}</p>
              </div>
              <Switch
                checked={prefs.weekly_digest}
                onCheckedChange={() => handleToggle("weekly_digest")}
              />
            </div>
          </div>
          {loading && <p className="text-[11px] text-gray-400">Loading your preferences…</p>}
        </div>

        {/* Theme Settings */}
        <div className="space-y-4 border-t border-gray-100 pt-6">
          <div>
            <h3 className="text-sm font-bold text-gray-800">{t("appearance")}</h3>
            <p className="text-xs text-gray-500 mt-1">{t("appearanceDesc")}</p>
          </div>

          <div className="flex items-center justify-between py-1">
            <div>
              <p className="text-xs font-bold text-gray-800">{t("darkMode")}</p>
              <p className="text-[11px] text-gray-400 mt-0.5">
                Coming soon.
              </p>
            </div>
            <Switch
              checked={darkMode}
              onCheckedChange={setDarkMode}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
