import Sidebar from "@/components/admin/Sidebar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Desktop sidebar — fixed, hidden on mobile (Topbar provides a Sheet instead) */}
      <aside className="hidden w-64 shrink-0 lg:block">
        <div className="fixed h-screen w-64">
          <Sidebar />
        </div>
      </aside>

      <main className="min-w-0 flex-1">
        {children}
      </main>
    </div>
  );
}
