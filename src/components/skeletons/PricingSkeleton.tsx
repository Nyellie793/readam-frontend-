import { Skeleton } from "@/components/ui/skeleton";

export default function PricingSkeleton() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-16">
      <div className="mx-auto mb-10 max-w-md text-center">
        <Skeleton className="mx-auto h-7 w-1/2" />
        <Skeleton className="mx-auto mt-3 h-4 w-2/3" />
      </div>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="rounded-2xl border border-gray-100 bg-white p-6">
            <Skeleton className="h-4 w-1/3" />
            <Skeleton className="mt-4 h-9 w-1/2" />
            <div className="mt-6 space-y-3">
              {Array.from({ length: 4 }).map((_, j) => (
                <Skeleton key={j} className="h-3 w-full" />
              ))}
            </div>
            <Skeleton className="mt-6 h-11 w-full rounded-xl" />
          </div>
        ))}
      </div>
    </section>
  );
}
