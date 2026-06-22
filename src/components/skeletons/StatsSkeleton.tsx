import SkeletonStats from "@/components/skeletons/SkeletonStats";

export default function StatsSkeleton() {
  return (
    <section className="border-y border-gray-100 bg-white py-16">
      <div className="mx-auto max-w-7xl px-6">
        <SkeletonStats count={4} />
      </div>
    </section>
  );
}
