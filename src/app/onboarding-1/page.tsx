"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Interests from "@/components/onboarding/Interests";
import OnboardingShell from "@/components/onboarding/OnboardingShell";

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
          sessionStorage.setItem("onboarding_interests", JSON.stringify(selected));
          router.push("/onboarding-2");
        }}
      />
    </OnboardingShell>
  );
}