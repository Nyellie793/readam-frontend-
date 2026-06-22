import { Skeleton } from "@/components/ui/skeleton";
import SkeletonImage from "@/components/skeletons/SkeletonImage";

export default function VideosSkeleton() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-16">
      <Skeleton className="mx-auto h-7 w-64" />
      <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="space-y-4">
            <SkeletonImage />
            <Skeleton className="h-4 w-2/3" />
            <Skeleton className="h-9 w-full rounded-xl" />
          </div>
        ))}
      </div>
    </section>
  );
}
