import SkeletonStats from "@/components/skeletons/SkeletonStats";
import SkeletonCard from "@/components/skeletons/SkeletonCard";
import { Skeleton } from "@/components/ui/skeleton";

export default function TutorLoading() {
  return (
    <div className="animate-in fade-in space-y-6 duration-200">
      <div className="space-y-2">
        <Skeleton className="h-6 w-48" />
        <Skeleton className="h-3 w-64" />
      </div>
      <SkeletonStats count={3} />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    </div>
  );
}
