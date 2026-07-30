import Link from "next/link";
import Image from "next/image";
import { BookOpen } from "lucide-react";
import { Progress } from "@/components/ui/progress";

interface RecentlyViewedItemProps {
  courseId: string;
  image: string | null;
  title: string;
  meta: string;
  progress: number;
}

export default function RecentlyViewedItem({ courseId, image, title, meta, progress }: RecentlyViewedItemProps) {
  return (
    <Link
      href={`/dashboard/courses/${courseId}`}
      className="flex items-center gap-4 rounded-xl border border-gray-100 bg-white p-3 shadow-sm transition-shadow hover:shadow-md"
    >
      <div className="relative flex size-12 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-gray-100">
        {image ? (
          <Image src={image} alt={title} fill className="object-cover" />
        ) : (
          <BookOpen className="size-5 text-gray-300" />
        )}
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
    </Link>
  );
}
