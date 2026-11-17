"use client";

import { Copy, Link2, MessageCircle } from "lucide-react";
import { toast } from "sonner";
import { useTranslations } from "next-intl";
import { SITE_URL } from "@/lib/constants";
import { referralLink } from "@/lib/referral";

async function copy(text: string, ok: string, failed: string) {
  try {
    await navigator.clipboard.writeText(text);
    toast.success(ok);
  } catch {
    toast.error(failed);
  }
}

/**
 * A user's code, big enough to read off a screen, with the three ways people
 * actually hand it on: copy the code, copy the signup link, or send it
 * straight to WhatsApp.
 */
export default function ReferralCodeBox({ code }: { code: string }) {
  const t = useTranslations("referrals");
  const link = referralLink(SITE_URL, code);
  const whatsapp = `https://wa.me/?text=${encodeURIComponent(t("shareMessage", { code, link }))}`;

  const button =
    "inline-flex items-center gap-1.5 rounded-xl border border-gray-200 bg-white px-3 py-2 text-xs font-semibold text-gray-700 transition hover:bg-gray-50";

  return (
    <div className="space-y-3">
      <p className="select-all font-mono text-3xl font-black tracking-[0.25em] text-gray-900 sm:text-4xl">
        {code}
      </p>
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => void copy(code, t("codeCopied"), t("copyFailed"))}
          className={button}
        >
          <Copy className="size-3.5" />
          {t("copyCode")}
        </button>
        <button
          type="button"
          onClick={() => void copy(link, t("linkCopied"), t("copyFailed"))}
          className={button}
        >
          <Link2 className="size-3.5" />
          {t("copyLink")}
        </button>
        <a
          href={whatsapp}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 rounded-xl bg-teal-600 px-3 py-2 text-xs font-semibold text-white transition hover:bg-teal-700"
        >
          <MessageCircle className="size-3.5" />
          {t("shareWhatsapp")}
        </a>
      </div>
    </div>
  );
}
