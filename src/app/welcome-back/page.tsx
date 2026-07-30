"use client";

import { useEffect, useState } from "react";
import Welcome from "@/components/onboarding/Welcome";
import OnboardingShell from "@/components/onboarding/OnboardingShell";
import STUDENT from "@/services/student.service";
import { getStoredUser } from "@/lib/auth";

export default function WelcomeBack() {
  const [interests, setInterests] = useState<string[]>([]);

  useEffect(() => {
    if (getStoredUser()?.role === "student") {
      STUDENT.getProfile()
        .then((profile) => setInterests(profile.interests))
        .catch(() => null);
    }
  }, []);

  const name = getStoredUser()?.full_name ?? "there";

  return (
    <OnboardingShell currentStep={2}>
      <Welcome interests={interests} userName={name} onBack={() => window.history.back()} />
    </OnboardingShell>
  );
}
