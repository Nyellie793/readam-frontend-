import TutorDashboardOverview from "@/components/tutor/dashboard/TutorDashboardOverview";
import { useTranslations } from "next-intl";

export default function TutorDashboardPage() {
  const t = useTranslations("tutor");
  return <TutorDashboardOverview />;
}
