import DashboardNavigation from "@/components/dashboard/DashboardNavigation";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-blue-50">
      {/* DashboardNavigation owns its own width — it shrinks to an icon rail
          when the sidebar is collapsed, and the course-filter panel doesn't
          collapse at all, so the sizing has to live with whichever of those
          it's actually rendering. */}
      <DashboardNavigation />

      <main className="min-w-0 flex-1">{children}</main>
    </div>
  );
}
