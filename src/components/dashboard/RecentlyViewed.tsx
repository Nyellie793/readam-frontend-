import RecentlyViewedItem from "./RecentlyViewedItem";
import  ReadAmTutorBannerDashboard from "./ReadAmTutorBannerDashboard";
import { RECENTLY_VIEWED } from "@/data/student-mock";

export default function RecentlyViewed() {
  return (
    <section className="grid grid-cols-1 gap-5 lg:grid-cols-[1fr_360px]">

      <div>

        <h2 className="text-lg font-bold">
          Recently Viewed
        </h2>

        <div className="mt-4 flex flex-col gap-3">

          {RECENTLY_VIEWED.map(item => (
            <RecentlyViewedItem
              key={item.id}
              {...item}
            />
          ))}

        </div>

      </div>

      <ReadAmTutorBannerDashboard variant="compact" />

    </section>
  );
}