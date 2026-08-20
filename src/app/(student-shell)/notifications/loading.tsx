import { Skeleton } from "@/components/ui/skeleton";

export default function NotificationsLoading() {
  return (
    <div className="min-h-screen animate-in fade-in bg-gray-50 duration-200">
      <div className="mx-auto max-w-3xl space-y-4 px-4 py-6 sm:px-6 lg:px-10">
        <Skeleton className="h-7 w-44" />
        <Skeleton className="h-11 w-full rounded-xl" />
        {Array.from({ length: 5 }).map((_, i) => (
          <div
            key={i}
            className="flex gap-3 rounded-2xl border border-gray-100 bg-white p-4 shadow-sm"
          >
            <Skeleton className="size-9 shrink-0 rounded-full" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-3.5 w-2/3" />
              <Skeleton className="h-3 w-full" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
