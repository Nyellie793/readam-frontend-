import { Sparkles } from "lucide-react";

export default function HeroBadge() {
  return (
    <div className="inline-flex items-center gap-1.5 rounded-full border border-orange-200 bg-orange-50 px-4 py-1.5 text-xs font-semibold uppercase tracking-wide text-orange-500">
      <Sparkles className="h-3 w-3" />
      Cameroon&apos;s First AI Study Platform
    </div>
  );
}