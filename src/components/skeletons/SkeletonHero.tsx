import { Skeleton } from "@/components/ui/skeleton";

export default function SkeletonHero() {
  return (
    <section className="py-10">
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid gap-8 lg:grid-cols-2">
          <div>
            <Skeleton className="h-8 w-40 rounded-full" />
            <Skeleton className="mt-5 h-12 w-full" />
            <Skeleton className="mt-3 h-12 w-3/4" />
            <Skeleton className="mt-6 h-5 w-full" />
            <Skeleton className="mt-2 h-5 w-5/6" />
            <div className="mt-8 flex flex-wrap gap-4">
              <Skeleton className="h-12 w-36 rounded-xl" />
              <Skeleton className="h-12 w-36 rounded-xl" />
            </div>
            <div className="mt-8 flex items-center gap-3">
              <div className="flex -space-x-2.5">
                {[0, 1, 2].map((i) => (
                  <Skeleton key={i} className="h-10 w-10 rounded-full border-2 border-white" />
                ))}
              </div>
              <Skeleton className="h-4 w-48" />
            </div>
          </div>
          <Skeleton className="h-[360px] w-full rounded-3xl sm:h-[450px]" />
        </div>

        <Skeleton className="mx-auto mt-10 h-32 w-full max-w-2xl rounded-2xl" />
      </div>
    </section>
  );
}
