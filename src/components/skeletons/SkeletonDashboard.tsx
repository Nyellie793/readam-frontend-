import { Skeleton } from "@/components/ui/skeleton";
import SkeletonStats from "@/components/skeletons/SkeletonStats";
import SkeletonTable from "@/components/skeletons/SkeletonTable";

export default function SkeletonDashboard() {
  return (
    <div className="space-y-6">
      <SkeletonStats count={4} />

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="rounded-2xl border border-gray-100 bg-white p-6 lg:col-span-2">
          <Skeleton className="h-4 w-40" />
          <Skeleton className="mt-6 h-56 w-full rounded-xl" />
        </div>

        <div className="rounded-2xl border border-gray-100 bg-white p-6">
          <Skeleton className="h-4 w-32" />
          <div className="mt-6 space-y-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="flex items-center gap-3">
                <Skeleton className="h-9 w-9 shrink-0 rounded-full" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-3 w-3/4" />
                  <Skeleton className="h-2.5 w-1/2" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <SkeletonTable rows={5} columns={5} />
    </div>
  );
}
