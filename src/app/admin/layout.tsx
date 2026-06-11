export default function AdminLayout({
    children,
  }: {
    children: React.ReactNode
  }) {
    return (
      <div className="flex min-h-screen">
        <aside className="w-64 bg-black text-white p-4">
          <h2 className="text-xl font-bold">Admin</h2>
          <nav className="mt-6 space-y-2">
            <a href="/admin">Dashboard</a>
            <a href="/admin/users">Users</a>
            <a href="/admin/courses">Courses</a>
          </nav>
        </aside>
  
        <main className="flex-1 p-6 bg-gray-50">
          {children}
        </main>
      </div>
    )
  }