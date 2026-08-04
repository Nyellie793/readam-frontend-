"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { BookOpen, BrainCircuit, FileText, CalendarCheck, ArrowRight } from "lucide-react";
import LessonPicker from "./LessonPicker";
import { useTranslations } from "next-intl";

type Feature = {
  icon: typeof BookOpen;
  color: string;
  bg: string;
  title: string;
  desc: string;
  cta: string;
  ctaColor: string;
} & (
  | { needsLesson: true; intent: "revision" | "quiz"; pickerTitle: string }
  | { needsLesson: false; href: string }
);


export default function AiHubFeatureCards() {
  const t = useTranslations("dash");
  // Defined inside the component so the copy can be translated.
  const FEATURES: Feature[] = [
    {
      icon: BookOpen,
      color: "text-blue-600",
      bg: "bg-blue-50",
      title: t("quickRevision"),
      desc: t("quickRevisionDesc"),
      cta: "Start Session",
      ctaColor: "text-blue-600",
      needsLesson: true,
      intent: "revision",
      pickerTitle: t("chooseLessonRevise"),
    },
    {
      icon: BrainCircuit,
      color: "text-teal-600",
      bg: "bg-teal-50",
      title: t("adaptiveQuiz"),
      desc: t("adaptiveQuizDesc"),
      cta: t("testKnowledge"),
      ctaColor: "text-teal-600",
      needsLesson: true,
      intent: "quiz",
      pickerTitle: t("chooseLessonQuiz"),
    },
    {
      icon: FileText,
      color: "text-orange-500",
      bg: "bg-orange-50",
      title: t("pastQuestions"),
      desc: t("pastQuestionsDesc"),
      cta: t("practiceNow"),
      ctaColor: "text-orange-500",
      needsLesson: true,
      intent: "quiz",
      pickerTitle: t("chooseLessonPractice"),
    },
    {
      icon: CalendarCheck,
      color: "text-purple-600",
      bg: "bg-purple-50",
      title: t("studyPlan"),
      desc: t("optimizeScheduleDesc"),
      cta: t("optimizeSchedule"),
      ctaColor: "text-purple-600",
      needsLesson: false,
      href: "/dashboard/ai-tutor/ai-chat?intent=study-plan",
    },
  ];
  const router = useRouter();
  const [pickerFor, setPickerFor] = useState<Feature | null>(null);

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
            {f.needsLesson ? (
              <button
                type="button"
                onClick={() => setPickerFor(f)}
                className={`mt-4 inline-flex items-center gap-1 text-sm font-semibold ${f.ctaColor} group-hover:underline`}
              >
                {f.cta}
                <ArrowRight className="size-3.5" />
              </button>
            ) : (
              <Link
                href={f.href}
                className={`mt-4 inline-flex items-center gap-1 text-sm font-semibold ${f.ctaColor} group-hover:underline`}
              >
                {f.cta}
                <ArrowRight className="size-3.5" />
              </Link>
            )}
          </div>
        );
      })}

      {pickerFor && pickerFor.needsLesson && (
        <LessonPicker
          open={!!pickerFor}
          onOpenChange={(open) => !open && setPickerFor(null)}
          title={pickerFor.pickerTitle}
          onSelect={({ lessonId }) =>
            router.push(`/dashboard/ai-tutor/ai-chat?lessonId=${lessonId}&intent=${pickerFor.intent}`)
          }
        />
      )}
    </div>
  );
}
