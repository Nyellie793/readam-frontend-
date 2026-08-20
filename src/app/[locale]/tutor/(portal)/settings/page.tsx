import TutorSettingsContent from "@/components/tutor/settings/TutorSettingsContent";
import { useTranslations } from "next-intl";

export default function TutorSettingsPage() {
  const t = useTranslations("tutor");
  return <TutorSettingsContent />;
}
