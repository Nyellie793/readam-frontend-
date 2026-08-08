import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import Topbar from "@/components/admin/Topbar";
import CourseEditorContent from "@/components/tutor/courses/CourseEditorContent";

/**
 * Course editing for admins, inside the admin panel.
 *
 * The Edit button used to link into /tutor/courses/[id]. That reused the
 * editor, which was the point, but it dropped an admin into the tutor portal
 * — tutor sidebar, tutor branding, and a GET /v1/tutors/me the portal layout
 * makes on entry. That endpoint is guarded by require_tutor, so an admin got a
 * bare "Forbidden" and had no idea why.
 *
 * Mounting the same component here keeps the single editor while leaving the
 * admin where they already were. The tutor-only profile call never happens
 * because the tutor layout is not involved.
 */
export default async function AdminCourseEditPage({
  params,
}: {
  params: Promise<{ courseId: string }>;
}) {
  const { courseId } = await params;

  return (
    <>
      <Topbar title="Edit Course" description="Changes go live immediately for enrolled students." />
      <div className="space-y-4 p-4 sm:p-6">
        <Link
          href={`/admin/courses/${courseId}`}
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-gray-500 transition hover:text-gray-800"
        >
          <ArrowLeft className="size-4" />
          Back to review
        </Link>
        <CourseEditorContent courseId={courseId} />
      </div>
    </>
  );
}
