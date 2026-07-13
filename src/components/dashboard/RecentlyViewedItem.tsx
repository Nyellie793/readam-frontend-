import Image from "next/image";
import { Progress } from "@/components/ui/progress";

interface RecentlyViewedItemProps {
  image: string;
  title: string;
  meta: string;
  progress: number;
}

export default function RecentlyViewedItem({ image, title, meta, progress }: RecentlyViewedItemProps) {
  return (
    <div className="flex items-center gap-4 rounded-xl border border-gray-100 bg-white p-3 shadow-sm">
      <div className="relative size-12 shrink-0 overflow-hidden rounded-lg bg-gray-100">
        <Image src={image} alt={title} fill className="object-cover" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold text-gray-900">{title}</p>
        <p className="truncate text-xs text-gray-400">{meta}</p>
      </div>
      <div className="w-28 shrink-0">
        <Progress value={progress} className="h-1.5" />
        <p className="mt-1 text-right text-[11px] font-semibold text-blue-600">
          {progress}% COMPLETE
        </p>
      </div>
    </div>
  );
}
