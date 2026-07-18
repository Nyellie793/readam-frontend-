
import CourseSidebar from "@/components/dashboard/courses/CoursesSidebar";

export default function CoursesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-1">
      <CourseSidebar />

      <main className="min-w-0 flex-1">
        {children}
      </main>
    </div>
  );
}