"use client";

import { useRef } from "react";
import { AlertTriangle } from "lucide-react";
import { useTranslations } from "next-intl";
import { useHlsSource } from "@/hooks/useHlsSource";

// `ref` is a plain prop in React 19; a caller passing one would replace the
// ref the hook needs and nothing would load, so it is excluded with `src`.
type HlsVideoProps = Omit<React.ComponentProps<"video">, "src" | "ref"> & { src: string };

/**
 * A <video> that plays HLS everywhere, not only in Safari. Use this instead
 * of a bare <video src="….m3u8"> anywhere a Cloudflare Stream manifest is
 * shown; the course player has its own richer element built on the same hook.
 */
export default function HlsVideo({ src, className, ...rest }: HlsVideoProps) {
  const t = useTranslations("dash");
  const videoRef = useRef<HTMLVideoElement>(null);
  const { failed, retry } = useHlsSource(videoRef, src);
  // Keyed on the source so a new lesson gets a fresh element rather than a
  // reused one with hls.js still attached to the previous stream.
  return (
    <div className="relative">
      <video ref={videoRef} key={src} className={className} {...rest} />
      {failed && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 rounded-xl bg-gray-950/95 px-6 text-center text-white/80">
          <AlertTriangle className="size-7 text-orange-400" />
          <p className="text-sm">{t("lessonFailed")}</p>
          <button
            type="button"
            onClick={retry}
            className="rounded-lg border border-white/20 px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-white/10"
          >
            {t("tryAgain")}
          </button>
        </div>
      )}
    </div>
  );
}
