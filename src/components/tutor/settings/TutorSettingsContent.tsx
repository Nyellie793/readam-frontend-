"use client";

import { useEffect, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import TUTOR from "@/services/tutor.service";
import { errorMessage } from "@/lib/api";
import TutorProfileSettingsCard from "./TutorProfileSettingsCard";
import TutorPayoutCard from "./TutorPayoutCard";
import TutorNotificationsCard from "./TutorNotificationsCard";
import type { TutorProfileResponse } from "@/types/api.types";
import { useTranslations } from "next-intl";

export default function TutorSettingsContent() {
  const t = useTranslations("tutor");
  const [profile, setProfile] = useState<TutorProfileResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    TUTOR.getMyProfile()
      .then(setProfile)
      .catch((err) => setError(errorMessage(err, t("errLoadSettings"))))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-gray-900">{t("settings")}</h1>
        <p className="text-sm text-gray-500">{t("settingsIntro")}</p>
      </div>

      {loading ? (
        <div className="space-y-6">
          <Skeleton className="h-96 rounded-2xl" />
          <Skeleton className="h-48 rounded-2xl" />
          <Skeleton className="h-40 rounded-2xl" />
        </div>
      ) : error || !profile ? (
        <p className="text-sm text-red-500">{error ?? "Something went wrong."}</p>
      ) : (
        <>
          <TutorProfileSettingsCard profile={profile} onSaved={setProfile} />
          <TutorPayoutCard />
          <TutorNotificationsCard />
        </>
      )}
    </div>
  );
}
