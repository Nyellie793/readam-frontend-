import Sidebar from "@/components/dashboard/Sidebar";
import DashboardMobileSidebar from "@/components/dashboard/DashboardMobileSidebar";
import DashboardNavigation from "@/components/dashboard/DashboardNavigation";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-blue-50">
      {/* Desktop sidebar — fixed, hidden on mobile */}
      <aside className="hidden w-64 shrink-0 border-r border-gray-100 lg:block">
        <div className="fixed h-screen w-64">
          <DashboardNavigation />
        </div>
      </aside>

      <DashboardMobileSidebar />

      <main className="min-w-0 flex-1 pt-6 lg:pt-0">{children}</main>
    </div>
  );
}
