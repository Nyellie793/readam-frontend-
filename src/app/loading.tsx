import HeroSkeleton from "@/components/skeletons/HeroSkeleton";
import LoadingTimeout from "@/components/shared/LoadingTimeout";

export default function Loading() {
  return(
    <>
   <LoadingTimeout />
   <HeroSkeleton />
  </>
  );
}