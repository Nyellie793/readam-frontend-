import SkeletonDashboard from "@/components/skeletons/SkeletonDashboard";
import SkeletonStats from "@/components/skeletons/SkeletonStats";
import { Skeleton } from "@/components/ui/skeleton";

export default function AdminLoading() {
  return (
    <div className="animate-in fade-in duration-300">
      {/* Topbar skeleton */}
      <div className="sticky top-0 z-30 flex items-center gap-4 border-b border-gray-100 bg-white/90 px-6 py-4 backdrop-blur-md">
        <div className="flex-1 space-y-2">
          <Skeleton className="h-5 w-40" />
          <Skeleton className="h-3 w-64" />
        </div>
        <Skeleton className="h-9 w-56 rounded-lg" />
        <Skeleton className="h-9 w-9 rounded-xl" />
        <Skeleton className="h-9 w-32 rounded-xl" />
      </div>

      <div className="space-y-6 p-6">
        <SkeletonStats count={4} />
        <SkeletonDashboard />
      </div>
    </div>
  );
}
