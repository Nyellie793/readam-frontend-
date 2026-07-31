import CourseEditorContent from "@/components/tutor/courses/CourseEditorContent";

export default async function TutorCourseEditorPage({
  params,
}: {
  params: Promise<{ courseId: string }>;
}) {
  const { courseId } = await params;
  return <CourseEditorContent courseId={courseId} />;
}
