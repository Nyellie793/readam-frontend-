import CourseEditorContent from "@/components/tutor/courses/CourseEditorContent";
import { useTranslations } from "next-intl";

export default async function TutorCourseEditorPage({
  params,
}: {
  params: Promise<{ courseId: string }>;
}) {
  const { courseId } = await params;
  return <CourseEditorContent courseId={courseId} />;
}
