import { Skeleton } from "@/components/ui/skeleton";

export default function SkeletonProfile() {
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-gray-100 bg-white p-4">
      <Skeleton className="h-12 w-12 shrink-0 rounded-full" />
      <div className="flex-1 space-y-2">
        <Skeleton className="h-3.5 w-1/3" />
        <Skeleton className="h-3 w-1/2" />
      </div>
      <Skeleton className="h-8 w-20 shrink-0 rounded-lg" />
    </div>
  );
}
