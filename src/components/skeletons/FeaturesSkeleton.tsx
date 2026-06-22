import { Skeleton } from "@/components/ui/skeleton";
import SkeletonCard from "@/components/skeletons/SkeletonCard";

export default function FeaturesSkeleton() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-16">
      <div className="mx-auto mb-10 max-w-md text-center">
        <Skeleton className="mx-auto h-7 w-2/3" />
        <Skeleton className="mx-auto mt-3 h-4 w-1/2" />
      </div>
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    </section>
  );
}
