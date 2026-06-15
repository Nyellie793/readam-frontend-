"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Goal from "@/components/onboarding/Goal";
import OnboardingShell from "@/components/onboarding/OnboardingShell";

function getStoredName(): string {
  if (typeof window === "undefined") return "user";
  return localStorage.getItem("user_name") || "user";
}

export default function OnboardingTwo() {
  const router = useRouter();
  const [goals, setGoals] = useState<string[]>([]);

  return (
    <OnboardingShell currentStep={1}>
      <Goal
        goals={goals}
        setGoals={setGoals}
        onBack={() => router.push("/onboarding-1")}
        onContinue={() => {
          const name = getStoredName();
          localStorage.setItem(`${name}_goals`, JSON.stringify(goals));
          router.push("/welcome-back");
        }}
      />
    </OnboardingShell>
  );
}