"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import Goal from "@/components/onboarding/Goal";
import OnboardingShell from "@/components/onboarding/OnboardingShell";
import STUDENT from "@/services/student.service";
import { getStoredUser } from "@/lib/auth";
import { useTranslations } from "next-intl";

function getStoredInterests(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = sessionStorage.getItem("onboarding_interests");
    return raw ? (JSON.parse(raw) as string[]) : [];
  } catch {
    return [];
  }
}

export default function OnboardingTwo() {
  const t = useTranslations("onboarding");
  const router = useRouter();
  const [goals, setGoals] = useState<string[]>([]);

  async function handleContinue() {
    const interests = getStoredInterests();
    // Only students have a StudentProfile — tutors hit 403 here, which is fine
    // since there's no tutor onboarding flow yet; don't block navigation on it.
    if (getStoredUser()?.role === "student") {
      try {
        await STUDENT.completeOnboarding({ interests, goals });
      } catch {
        toast.error(t("savedFail"));
      }
    }
    router.push("/welcome-back");
  }

  return (
    <OnboardingShell currentStep={1}>
      <Goal
        goals={goals}
        setGoals={setGoals}
        onBack={() => router.push("/onboarding-1")}
        onContinue={handleContinue}
      />
    </OnboardingShell>
  );
}