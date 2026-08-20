import SkeletonCard from "@/components/skeletons/SkeletonCard";
import { Skeleton } from "@/components/ui/skeleton";

export default function CoursesLoading() {
  return (
    <div className="min-h-screen animate-in fade-in bg-white duration-200">
      <div className="mx-auto max-w-7xl px-6 pb-8 pt-16 sm:pt-20">
        <Skeleton className="h-6 w-32 rounded-full" />
        <Skeleton className="mt-5 h-10 w-2/3 max-w-lg" />
        <Skeleton className="mt-4 h-4 w-full max-w-xl" />

        <div className="mt-8 flex max-w-md gap-2">
          <Skeleton className="h-11 flex-1 rounded-xl" />
          <Skeleton className="h-11 w-24 rounded-xl" />
        </div>

        {/* Filter pills */}
        <div className="mt-5 flex flex-wrap gap-2">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-8 w-24 rounded-full" />
          ))}
        </div>

        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      </div>
    </div>
  );
}
