import { Skeleton } from "@/components/ui/skeleton";

export default function TutorSkeleton() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-16">
      <Skeleton className="mx-auto h-7 w-56" />
      <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="overflow-hidden rounded-2xl border border-gray-100 bg-white">
            <Skeleton className="h-56 w-full rounded-none" />
            <div className="space-y-3 p-5">
              <Skeleton className="h-4 w-2/3" />
              <Skeleton className="h-3 w-1/2" />
              <Skeleton className="h-9 w-24 rounded-lg" />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
