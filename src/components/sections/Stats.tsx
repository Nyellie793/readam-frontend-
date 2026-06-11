const stats = [
    { value: "50k+", label: "Solved Questions" },
    { value: "10k+", label: "Study Notes" },
    { value: "150+", label: "Expert Tutors" },
    { value: "20k+", label: "Active Students" },
  ];
  
  export default function Stats() {
    return (
      <section className="border-y border-gray-100 bg-white py-16">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid grid-cols-2 gap-10 lg:grid-cols-4">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="text-4xl font-black text-blue-600 sm:text-5xl">
                  {stat.value}
                </p>
                <p className="mt-2 text-xs font-semibold uppercase tracking-widest text-gray-400">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }