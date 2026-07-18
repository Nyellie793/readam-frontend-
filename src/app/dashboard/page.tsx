import DashboardHeader from "@/components/dashboard/DashboardHeader";
import RecentlyViewed from "@/components/dashboard/RecentlyViewed";
import RecommendedCourses from "@/components/dashboard/RecommendedCourses";
import StudyProgress from "@/components/dashboard/StudyProgress";
import WeeklyActivity from "@/components/dashboard/WeeklyActivity";

export default function DashboardPage() {
  return (
    <div className="mx-auto max-w-6xl space-y-6 px-4 py-6 sm:px-6 lg:px-10">

      <DashboardHeader />

      <StudyProgress />

      <WeeklyActivity />
      
      <RecommendedCourses />

      <RecentlyViewed />

    </div>
  );
}