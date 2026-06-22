import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

interface SkeletonImageProps {
  className?: string;
}

export default function SkeletonImage({ className }: SkeletonImageProps) {
  return (
    <Skeleton
      className={cn("aspect-video w-full rounded-2xl", className)}
    />
  );
}
