"use client";

import { useSyncExternalStore } from "react";
import { ExternalLink, FileText } from "lucide-react";
import { useTranslations } from "next-intl";
import { isIOSDevice } from "@/lib/platform";

// The device never changes while the page is open, so there is nothing to subscribe to.
const subscribeNever = () => () => {};

interface PdfEmbedProps {
  title: string;
  fileUrl: string;
  className?: string;
}

/**
 * Shows a PDF inline where the browser can, and hands it to the browser's own
 * viewer where it cannot. Safari on iOS renders a PDF inside an iframe as a
 * single, non-scrollable first page, so there it gets a button that opens the
 * file in a new tab, where Safari's native viewer scrolls and zooms properly.
 * Desktop browsers keep the inline iframe.
 */
export default function PdfEmbed({ title, fileUrl, className }: PdfEmbedProps) {
  const t = useTranslations("dash");
  // null on the server and during hydration: the device is unknown there, and
  // rendering the iframe first on iOS would download the whole PDF for nothing.
  const ios = useSyncExternalStore(subscribeNever, isIOSDevice, () => null);

  if (ios === null) return <div className={className} aria-hidden />;

  if (ios) {
    return (
      <div className={`flex flex-col items-center justify-center gap-4 px-6 text-center ${className ?? ""}`}>
        <div className="flex size-14 items-center justify-center rounded-2xl bg-blue-50">
          <FileText className="size-7 text-blue-600" />
        </div>
        <p className="max-w-xs text-sm text-gray-600">{t("pdfOpenHint")}</p>
        <a
          href={fileUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
        >
          <ExternalLink className="size-4" />
          {t("pdfOpen")}
        </a>
      </div>
    );
  }

  return <iframe src={fileUrl} title={title} className={`border-0 ${className ?? ""}`} />;
}
