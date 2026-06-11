import { Globe, FlaskConical, Zap, Calculator } from "lucide-react";
import { Card, CardContent } from "@/components/ui/Card";

const subjects = [
  {
    icon: Globe,
    iconBg: "bg-blue-100",
    iconColor: "text-blue-500",
    borderColor: "border-blue-300",
    title: "Geography",
    description: "Make a lesson on the different landscapes in the world.",
  },
  {
    icon: FlaskConical,
    iconBg: "bg-orange-100",
    iconColor: "text-orange-400",
    borderColor: "border-orange-300",
    title: "Biology",
    description: "How does DNA divide? Explain Meiosis and Mitosis.",
  },
  {
    icon: Zap,
    iconBg: "bg-gray-700",
    iconColor: "text-white",
    borderColor: "border-gray-300",
    title: "Physics",
    description: "Describe the physical properties of matter and how they are influenced.",
  },
  {
    icon: Calculator,
    iconBg: "bg-teal-100",
    iconColor: "text-teal-500",
    borderColor: "border-teal-200",
    title: "Mathematics",
    description: "Mathematical proof of Pythagoras theorem in 1 example.",
  },
];

export default function Subjects() {
  return (
    <section className="mx-auto max-w-7xl px-6 py- pb-10">
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {subjects.map((subject) => {
          const Icon = subject.icon;
          return (
            <Card
              key={subject.title}
              className={`cursor-pointer border-2 ${subject.borderColor} bg-white shadow-none hover:shadow-md transition-shadow rounded-2xl`}
            >
              <CardContent className="flex flex-col gap-4 p-6">
                <div className={`flex h-11 w-11 items-center justify-center rounded-full ${subject.iconBg}`}>
                  <Icon className={`h-5 w-5 ${subject.iconColor}`} />
                </div>
                <div>
                  <h3 className="text-base font-bold text-gray-900">{subject.title}</h3>
                  <p className="mt-1 text-sm leading-relaxed text-gray-500">{subject.description}</p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </section>
  );
}