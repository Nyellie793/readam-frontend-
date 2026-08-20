import { Skeleton } from "@/components/ui/skeleton";

export default function PaymentLoading() {
  return (
    <div className="min-h-screen animate-in fade-in bg-gray-50 duration-200">
      <div className="mx-auto max-w-5xl space-y-6 px-4 py-6 sm:px-6 lg:px-10">
        <Skeleton className="h-7 w-48" />
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="mt-3 h-8 w-28" />
              <Skeleton className="mt-4 h-3 w-full" />
              <Skeleton className="mt-1 h-3 w-4/5" />
              <Skeleton className="mt-6 h-11 w-full rounded-xl" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
