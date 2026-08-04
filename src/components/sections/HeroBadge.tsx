import { Sparkles } from "lucide-react";
import { getTranslations } from "next-intl/server";

export default async function HeroBadge() {
  const t = await getTranslations("home");
  return (
    <div className="inline-flex items-center gap-1.5 rounded-full border border-orange-200 bg-orange-50 px-4 py-1.5 text-xs font-semibold uppercase tracking-wide text-orange-500">
      <Sparkles className="h-3 w-3" />
      {t("badge")}
    </div>
  );
}