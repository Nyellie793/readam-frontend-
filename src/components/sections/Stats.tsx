import { HelpCircle, BookOpen, Users, GraduationCap } from "lucide-react";

const stats = [
  { value: "50k+", label: "Solved Questions", icon: HelpCircle },
  { value: "10k+", label: "Study Notes", icon: BookOpen },
  { value: "150+", label: "Expert Tutors", icon: GraduationCap },
  { value: "20k+", label: "Active Students", icon: Users },
];

export default function Stats() {
  return (
    <section className="border-y border-gray-100 bg-white py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <div
                key={stat.label}
                className="group rounded-2xl border border-transparent p-6 text-center transition-all duration-300 hover:-translate-y-1 hover:border-blue-100 hover:bg-blue-50/50 hover:shadow-md"
              >
                <span className="mx-auto flex h-11 w-11 items-center justify-center rounded-full bg-blue-50 text-blue-600 transition-colors duration-300 group-hover:bg-blue-600 group-hover:text-white">
                  <Icon className="h-5 w-5" />
                </span>
                <p className="mt-4 text-4xl font-black text-blue-600 sm:text-5xl">
                  {stat.value}
                </p>
                <p className="mt-2 text-xs font-semibold uppercase tracking-widest text-gray-400">
                  {stat.label}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
