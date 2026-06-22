import { Skeleton } from "@/components/ui/skeleton";

interface SkeletonStatsProps {
  count?: number;
}

export default function SkeletonStats({ count = 4 }: SkeletonStatsProps) {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="rounded-2xl border border-gray-100 bg-white p-5">
          <Skeleton className="h-3 w-1/2" />
          <Skeleton className="mt-3 h-7 w-2/3" />
          <Skeleton className="mt-2 h-2.5 w-1/3" />
        </div>
      ))}
    </div>
  );
}
