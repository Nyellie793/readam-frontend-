"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Interests from "@/components/onboarding/Interests";
import OnboardingShell from "@/components/onboarding/OnboardingShell";

function getStoredName(): string {
  if (typeof window === "undefined") return "user";
  return localStorage.getItem("user_name") || "user";
}

export default function OnboardingOne() {
  const router = useRouter();
  const [selected, setSelected] = useState<string[]>([]);

  return (
    <OnboardingShell currentStep={0}>
      <Interests
        selected={selected}
        setSelected={setSelected}
        onBack={() => router.back()}
        onContinue={() => {
          const name = getStoredName();
          localStorage.setItem(`${name}_interests`, JSON.stringify(selected));
          router.push("/onboarding-2");
        }}
      />
    </OnboardingShell>
  );
}