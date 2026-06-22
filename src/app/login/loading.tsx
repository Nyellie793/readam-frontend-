import { Skeleton } from "@/components/ui/skeleton";

export default function LoginLoading() {
  return (
    <main className="min-h-screen bg-[#F7F8FC]">
      {/* Navbar skeleton */}
      <div className="flex h-16 w-full items-center justify-between border-b bg-white/70 px-6">
        <Skeleton className="h-8 w-28" />
        <Skeleton className="h-9 w-24 rounded-xl" />
      </div>

      {/* Form card skeleton */}
      <div className="flex min-h-[calc(100vh-64px)] items-center justify-center px-6 py-10">
        <div className="w-full max-w-md space-y-5 rounded-2xl border bg-white p-8 shadow-sm">
          <Skeleton className="mx-auto h-8 w-48" />
          <Skeleton className="mx-auto h-4 w-56" />
          <div className="mt-8 space-y-4">
            <Skeleton className="h-12 w-full rounded-xl" />
            <Skeleton className="h-12 w-full rounded-xl" />
            <Skeleton className="h-12 w-full rounded-xl" />
            <Skeleton className="h-12 w-full rounded-xl" />
          </div>
        </div>
      </div>
    </main>
  );
}
