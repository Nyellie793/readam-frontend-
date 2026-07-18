export default function DashboardSidebar() {
    return (
  
      <aside className="space-y-5">
  
        <div className="rounded-2xl border bg-white p-5">
  
          <h3 className="font-bold">
            Today&apos;s Goal
          </h3>
  
          <p className="mt-2 text-sm text-gray-500">
            Study for 2 hours
          </p>
  
        </div>
  
        <div className="rounded-2xl border bg-white p-5">
  
          <h3 className="font-bold">
            Upcoming Quiz
          </h3>
  
          <p className="mt-2 text-sm text-gray-500">
            Data Structures
          </p>
  
        </div>
  
        <div className="rounded-2xl border bg-white p-5">
  
          <h3 className="font-bold">
            Motivation
          </h3>
  
          <p className="mt-2 text-sm text-gray-500 italic">
            Every hour you study today saves you days of stress later.
          </p>
  
        </div>
  
      </aside>
  
    );
  }