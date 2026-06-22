import { Skeleton } from "@/components/ui/skeleton";

export default function BannerSkeleton() {
  return (
    <section className="bg-[#071B4D] py-16">
      <div className="mx-auto max-w-3xl px-6 text-center">
        <Skeleton className="mx-auto h-10 w-10 rounded-full bg-white/10" />
        <Skeleton className="mx-auto mt-6 h-7 w-3/4 bg-white/10" />
        <Skeleton className="mx-auto mt-3 h-7 w-1/2 bg-white/10" />
        <Skeleton className="mx-auto mt-6 h-4 w-2/3 bg-white/10" />
      </div>
    </section>
  );
}
