import { Skeleton } from "@/components/ui/skeleton";

export default function NewsletterSkeleton() {
  return (
    <section className="bg-[#071B4D] py-16">
      <div className="mx-auto max-w-2xl px-6 text-center">
        <Skeleton className="mx-auto h-8 w-2/3 bg-white/10" />
        <Skeleton className="mx-auto mt-3 h-4 w-1/2 bg-white/10" />
        <div className="mx-auto mt-6 flex max-w-md gap-3">
          <Skeleton className="h-12 flex-1 rounded-xl bg-white/10" />
          <Skeleton className="h-12 w-32 rounded-xl bg-white/10" />
        </div>
      </div>
    </section>
  );
}
