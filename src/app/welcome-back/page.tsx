"use client";

import { useState } from "react";
import Welcome from "@/components/onboarding/Welcome";
import OnboardingShell from "@/components/onboarding/OnboardingShell";

function getStoredName(): string {
  if (typeof window === "undefined") return "there";
  return localStorage.getItem("user_name") || "there";
}

function getStoredInterests(name: string): string[] {
  if (typeof window === "undefined") return [];
  try {
    const stored = localStorage.getItem(`${name}_interests`);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

export default function WelcomeBack() {
  const [name] = useState<string>(getStoredName);
  const [interests] = useState<string[]>(() => getStoredInterests(name));

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