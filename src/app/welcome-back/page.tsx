"use client";

import { useState, useEffect } from "react";
import Welcome from "@/components/onboarding/Welcome";
import OnboardingShell from "@/components/onboarding/OnboardingShell";

export default function WelcomeBack() {
  // Start with safe SSR defaults — both server and client render the same
  // thing on first pass, eliminating the hydration mismatch.
  const [name, setName] = useState<string>("there");
  const [interests, setInterests] = useState<string[]>([]);

  // After mount (client only), pull the real values from localStorage.
  useEffect(() => {
    const storedName = localStorage.getItem("user_name") || "there";

    const storedInterests = (() => {
      try {
        const raw = localStorage.getItem(`${storedName}_interests`);
        return raw ? (JSON.parse(raw) as string[]) : [];
      } catch {
        return [];
      }
    })();

    setName(storedName);
    setInterests(storedInterests);
  }, []);

  return (
    <OnboardingShell currentStep={2}>
      <Welcome
        interests={interests}
        userName={name}
        onBack={() => window.history.back()}
      />
    </OnboardingShell>
  );
}
