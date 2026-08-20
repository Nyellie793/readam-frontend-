import SkeletonStats from "@/components/skeletons/SkeletonStats";
import SkeletonCard from "@/components/skeletons/SkeletonCard";
import { Skeleton } from "@/components/ui/skeleton";

/**
 * Shown the instant a navigation starts, while the server renders.
 *
 * Every page here is server-rendered per request, so tapping a link left the
 * screen unchanged for the better part of a second — indistinguishable from
 * the app having ignored the tap. This does not make anything faster; it makes
 * the wait legible.
 *
 * Shaped like the real page so nothing jumps when the content arrives.
 */
export default function DashboardLoading() {
  return (
    <div className="min-h-screen animate-in fade-in bg-blue-50 duration-200">
      <div className="mx-auto max-w-6xl space-y-6 px-4 py-6 sm:px-6 lg:px-10">
        <div className="space-y-2">
          <Skeleton className="h-6 w-52" />
          <Skeleton className="h-3 w-72" />
        </div>
        <SkeletonStats count={3} />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      </div>
    </div>
  );
}
