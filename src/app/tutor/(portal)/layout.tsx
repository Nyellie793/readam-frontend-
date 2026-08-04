"use client";

import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import TutorSidebar from "@/components/tutor/TutorSidebar";
import TutorTopbar from "@/components/tutor/TutorTopbar";
import TUTOR from "@/services/tutor.service";
import { useTranslations } from "next-intl";

export default function TutorPortalLayout({ children }: { children: React.ReactNode }) {
  const t = useTranslations("tutor");
  const [isVerified, setIsVerified] = useState(false);
  const [displayName, setDisplayName] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    TUTOR.getMyProfile()
      .then((profile) => {
        setIsVerified(profile.is_verified);
        setDisplayName(profile.display_name);
      })
      .catch(() => null)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-blue-50">
        <Loader2 className="size-6 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-blue-50">
      <aside className="hidden w-64 shrink-0 border-r border-gray-100 lg:block">
        <div className="fixed h-screen w-64">
          <TutorSidebar isVerified={isVerified} />
        </div>
      </aside>

      <main className="min-w-0 flex-1">
        <div className="mx-auto max-w-6xl space-y-6 px-4 py-6 sm:px-6 lg:px-10">
          <TutorTopbar greeting={displayName ? `Hi, ${displayName.split(" ")[0]}` : t("welcome")} isVerified={isVerified} />
          {children}
        </div>
      </main>
    </div>
  );
}
