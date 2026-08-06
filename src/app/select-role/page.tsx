"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { User, Bot, Loader2 } from "lucide-react";
import Logo from "@/components/shared/Logo";
import { useStoredUser } from "@/hooks/useStoredUser";
import AUTH from "@/services/auth.service";
import { saveSession } from "@/lib/auth";
import { toast } from "sonner";

const ROLES = [
  { id: "student", titleKey: "roleStudent", descKey: "roleStudentDesc", Icon: User },
  { id: "tutor",   titleKey: "roleTutor",   descKey: "roleTutorDesc",  Icon: Bot  },
] as const;
type Role = (typeof ROLES)[number]["id"];

export default function SelectRolePage() {
  const t = useTranslations("auth");
  const router = useRouter();
  const [selected, setSelected] = useState<Role>("student");
  const user = useStoredUser();
  const [loading, setLoading] = useState(false);

  const handleContinue = async () => {
    if (user) {
      setLoading(true);
      try {
        const roleData = await AUTH.setRole({ role: selected });
        saveSession(roleData);
        toast.success(t("profileUpdated") || "Role saved successfully!");
        router.push(selected === "tutor" ? "/tutor/onboarding" : "/onboarding-1");
      } catch (err) {
        toast.error("Failed to save role. Please try again.");
      } finally {
        setLoading(false);
      }
    } else {
      router.push(`/signup?role=${selected}`);
    }
  };

  return (
    <main className="min-h-screen bg-[#F4F6FB]">
      <header className="border-b bg-white px-6 py-4">
        <Logo />
      </header>
      <div className="mx-auto flex min-h-[calc(100vh-65px)] max-w-3xl flex-col items-center justify-center px-6 py-14">
        <h1 className="text-center text-4xl font-black text-gray-900">{t("roleTitle")}</h1>
        <p className="mt-3 max-w-md text-center text-base text-gray-500">
          {t("roleSubtitle")}
        </p>
        <div className="mt-10 grid w-full grid-cols-1 gap-5 sm:grid-cols-2">
          {ROLES.map(({ id, titleKey, descKey, Icon }) => {
            const active = selected === id;
            return (
              <button key={id} type="button" onClick={() => setSelected(id)}
                className={`flex flex-col items-center gap-5 rounded-2xl border-2 bg-white px-6 py-10 text-center shadow-sm transition-all duration-200 ${active ? "border-blue-600 shadow-blue-100 shadow-lg" : "border-gray-200 hover:border-gray-300 hover:shadow-md"}`}>
                <span className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-50">
                  <Icon className="h-8 w-8 text-blue-600" />
                </span>
                <div>
                  <p className="text-xl font-bold text-gray-900">{t(titleKey)}</p>
                  <p className="mt-2 text-sm leading-relaxed text-gray-500">{t(descKey)}</p>
                </div>
                <div className={`flex h-6 w-6 items-center justify-center rounded-full border-2 transition-colors ${active ? "border-blue-600 bg-blue-600" : "border-gray-300 bg-white"}`}>
                  {active && <div className="h-2.5 w-2.5 rounded-full bg-white" />}
                </div>
              </button>
            );
          })}
        </div>
        <button type="button" onClick={handleContinue} disabled={loading}
          className="mt-10 flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-16 py-4 text-base font-bold text-white shadow-md shadow-blue-200 transition hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed">
          {loading && <Loader2 className="h-4 w-4 animate-spin" />}
          {t("continue")}
        </button>
      </div>
    </main>
  );
}
