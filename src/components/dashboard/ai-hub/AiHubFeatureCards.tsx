import Link from "next/link";
import { BookOpen, BrainCircuit, FileText, CalendarCheck, ArrowRight } from "lucide-react";

const FEATURES = [
  {
    icon: BookOpen,
    color: "text-blue-600",
    bg: "bg-blue-50",
    title: "Quick Revision",
    desc: "Summarize complex chapters and generate key takeaways for a rapid refresh before class.",
    cta: "Start Session",
    href: "/dashboard/ai-chat?mode=revision",
    ctaColor: "text-blue-600",
  },
  {
    icon: BrainCircuit,
    color: "text-teal-600",
    bg: "bg-teal-50",
    title: "Adaptive Quiz",
    desc: "Test your knowledge with dynamic questions that adjust difficulty based on your performance.",
    cta: "Test Knowledge",
    href: "/dashboard/ai-chat?mode=quiz",
    ctaColor: "text-teal-600",
  },
  {
    icon: FileText,
    color: "text-orange-500",
    bg: "bg-orange-50",
    title: "Past Questions",
    desc: "Solve previous GCE and local exam papers with step-by-step AI guidance and marking.",
    cta: "Practice Now",
    href: "/dashboard/ai-chat?mode=past-questions",
    ctaColor: "text-orange-500",
  },
  {
    icon: CalendarCheck,
    color: "text-purple-600",
    bg: "bg-purple-50",
    title: "Study Plan",
    desc: "Generate a tailored schedule based on your exam dates, weak areas, and available time.",
    cta: "Optimize Schedule",
    href: "/dashboard/ai-chat?mode=study-plan",
    ctaColor: "text-purple-600",
  },
];

export default function AiHubFeatureCards() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {FEATURES.map((f) => {
        const Icon = f.icon;
        return (
          <div
            key={f.title}
            className="group flex flex-col rounded-2xl border border-gray-100 bg-white p-5 shadow-sm transition-shadow hover:shadow-md"
          >
            <div className={`mb-4 flex size-10 items-center justify-center rounded-xl ${f.bg}`}>
              <Icon className={`size-5 ${f.color}`} />
            </div>
            <h3 className="font-bold text-gray-900">{f.title}</h3>
            <p className="mt-1.5 flex-1 text-sm leading-relaxed text-gray-500">{f.desc}</p>
            <Link
              href={f.href}
              className={`mt-4 inline-flex items-center gap-1 text-sm font-semibold ${f.ctaColor} group-hover:underline`}
            >
              {f.cta}
              <ArrowRight className="size-3.5" />
            </Link>
          </div>
        );
      })}
    </div>
  );
}