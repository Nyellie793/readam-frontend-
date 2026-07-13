import Image from "next/image";
import type { ContinueLearningItem } from "@/types/course.types";

export default function ContinueLearningCard({ image, title, meta, duration }: ContinueLearningItem) {
  return (
    <button type="button" className="text-left">
      <div className="relative aspect-video overflow-hidden rounded-xl bg-gray-100">
        <Image src={image} alt={title} fill className="object-cover" />
        <span className="absolute bottom-2 right-2 rounded bg-black/75 px-1.5 py-0.5 text-[11px] font-medium text-white">
          {duration}
        </span>
      </div>
      <p className="mt-2 text-sm font-semibold leading-snug text-gray-900">{title}</p>
      <p className="text-xs text-gray-400">{meta}</p>
    </button>
  );
}
