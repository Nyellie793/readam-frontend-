import { getTranslations } from "next-intl/server";
import { Globe, FlaskConical, Zap, Calculator } from "lucide-react";
import { Card, CardContent } from "@/components/ui/Card";

const subjects = [
  {
    icon: Globe,
    iconBg: "bg-blue-100",
    iconColor: "text-blue-500",
    borderColor: "border-blue-300",
    titleKey: "geography",
    descKey: "geographyDesc",
  },
  {
    icon: FlaskConical,
    iconBg: "bg-orange-100",
    iconColor: "text-orange-400",
    borderColor: "border-orange-300",
    titleKey: "biology",
    descKey: "biologyDesc",
  },
  {
    icon: Zap,
    iconBg: "bg-gray-700",
    iconColor: "text-white",
    borderColor: "border-gray-300",
    titleKey: "physics",
    descKey: "physicsDesc",
  },
  {
    icon: Calculator,
    iconBg: "bg-teal-100",
    iconColor: "text-teal-500",
    borderColor: "border-teal-200",
    titleKey: "mathematics",
    descKey: "mathematicsDesc",
  },
];

export default async function Subjects() {
  const t = await getTranslations("subjects");
  return (
    <section className="mx-auto max-w-7xl px-6 py-6 pb-10">

      {/* Header */}
      <div className="mb-10 text-center">
        <h2 className="text-3xl font-black text-gray-900"></h2>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {subjects.map((subject) => {
          const Icon = subject.icon;
          return (
            <Card
              key={t(subject.titleKey)}
              className={`cursor-pointer border-2 ${subject.borderColor} bg-white shadow-none hover:shadow-lg hover:-translate-y-1 transition-all duration-300 rounded-2xl`}
            >
              <CardContent className="flex flex-col gap-4 p-6">
                <div className={`flex h-11 w-11 items-center justify-center rounded-full ${subject.iconBg}`}>
                  <Icon className={`h-5 w-5 ${subject.iconColor}`} />
                </div>
                <div>
                  <h3 className="text-base font-bold text-gray-900">{t(subject.titleKey)}</h3>
                  <p className="mt-1 text-sm leading-relaxed text-gray-500">{t(subject.descKey)}</p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </section>
  );
}