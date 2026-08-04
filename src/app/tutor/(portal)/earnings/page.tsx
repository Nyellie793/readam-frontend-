import TutorEarningsContent from "@/components/tutor/earnings/TutorEarningsContent";
import { useTranslations } from "next-intl";

export default function TutorEarningsPage() {
  const t = useTranslations("tutor");
  return <TutorEarningsContent />;
}
