import TutorCoursesContent from "@/components/tutor/courses/TutorCoursesContent";
import { useTranslations } from "next-intl";

export default function TutorCoursesPage() {
  const t = useTranslations("tutor");
  return <TutorCoursesContent />;
}
