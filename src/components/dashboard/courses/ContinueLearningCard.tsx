import Image from "next/image";
import { useTranslations } from "next-intl";

function formatDuration(seconds: number | null): string {
  if (!seconds) return "--:--";
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

interface ContinueLearningCardProps {
  title: string;
  meta: string;
  durationSeconds: number | null;
  image: string | null;
  onClick?: () => void;
}

export default function ContinueLearningCard({
  title,
  meta,
  durationSeconds,
  image,
  onClick,
}: ContinueLearningCardProps) {
  const t = useTranslations("dash");
  return (
    <button type="button" onClick={onClick} className="text-left">
      <div className="relative aspect-video overflow-hidden rounded-xl bg-gray-100">
        {image ? (
          <Image src={image} alt={title} fill className="object-cover" />
        ) : (
          <div className="flex h-full items-center justify-center bg-blue-50 text-blue-300">
            <span className="text-xs font-semibold">{t("noPreview")}</span>
          </div>
        )}
        <span className="absolute bottom-2 right-2 rounded bg-black/75 px-1.5 py-0.5 text-[11px] font-medium text-white">
          {formatDuration(durationSeconds)}
        </span>
      </div>
      <p className="mt-2 text-sm font-semibold leading-snug text-gray-900">{title}</p>
      <p className="text-xs text-gray-400">{meta}</p>
    </button>
  );
}
