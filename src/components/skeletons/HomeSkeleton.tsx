import SkeletonHero from "@/components/skeletons/SkeletonHero";
import BannerSkeleton from "@/components/skeletons/BannerSkeleton";
import FeaturesSkeleton from "@/components/skeletons/FeaturesSkeleton";
import VideosSkeleton from "@/components/skeletons/VideosSkeleton";
import TutorSkeleton from "@/components/skeletons/TutorSkeleton";
import TestimonialSkeleton from "@/components/skeletons/TestimonialSkeleton";
import StatsSkeleton from "@/components/skeletons/StatsSkeleton";
import PricingSkeleton from "@/components/skeletons/PricingSkeleton";
import NewsletterSkeleton from "@/components/skeletons/NewletterSkeleton";

/**
 * Full-page homepage skeleton, composed from the same section-level
 * skeletons used individually (Task 3). Mirrors the section order in
 * src/app/page.tsx so the loading state never "jumps" once real content
 * streams in.
 */
export default function HomeSkeleton() {
  return (
    <div className="animate-in fade-in duration-300">
      <SkeletonHero />
      <BannerSkeleton />
      <FeaturesSkeleton />
      <VideosSkeleton />
      <TutorSkeleton />
      <TestimonialSkeleton />
      <StatsSkeleton />
      <PricingSkeleton />
      <NewsletterSkeleton />
    </div>
  );
}
