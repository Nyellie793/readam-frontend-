import { Skeleton } from "@/components/ui/skeleton";

export default function HeroSkeleton() {
  return (
    <section className="py-10">

      <div className="mx-auto max-w-7xl px-6">

        <div className="grid gap-8 lg:grid-cols-2">

          <div>

            <Skeleton className="h-8 w-40" />

            <Skeleton className="mt-5 h-16 w-full" />

            <Skeleton className="mt-3 h-16 w-3/4" />

            <Skeleton className="mt-6 h-5 w-full" />

            <Skeleton className="mt-2 h-5 w-5/6" />

            <div className="mt-8 flex gap-4">

              <Skeleton className="h-12 w-36" />

              <Skeleton className="h-12 w-36" />

            </div>

          </div>

          <div>

            <Skeleton className="h-[450px] rounded-3xl" />

          </div>

        </div>

      </div>

    </section>
  );
}