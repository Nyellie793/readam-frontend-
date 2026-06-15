"use client";

import {
  FlaskConical, Banknote, Palette, Globe, HeartPulse,
  BookOpen, Briefcase, Scale, Wrench, Pen, Star, PlusCircle,
} from "lucide-react";
import { ArrowLeft } from "lucide-react";

const interests = [
  { label: "Science & Tech", icon: FlaskConical, color: "text-blue-400 bg-blue-50" },
  { label: "Finance", icon: Banknote, color: "text-orange-400 bg-orange-50" },
  { label: "Arts", icon: Palette, color: "text-purple-400 bg-purple-50" },
  { label: "Languages", icon: Globe, color: "text-blue-400 bg-blue-50" },
  { label: "Health", icon: HeartPulse, color: "text-orange-400 bg-orange-50" },
  { label: "Exams", icon: BookOpen, color: "text-orange-400 bg-orange-50" },
  { label: "Career", icon: Briefcase, color: "text-orange-400 bg-orange-50" },
  { label: "Law", icon: Scale, color: "text-blue-400 bg-blue-50" },
  { label: "Engineering", icon: Wrench, color: "text-orange-400 bg-orange-50" },
  { label: "Design", icon: Pen, color: "text-blue-400 bg-blue-50" },
  { label: "Personal", icon: Star, color: "text-blue-400 bg-blue-50" },
  { label: "Other", icon: PlusCircle, color: "text-gray-400 bg-gray-50", dashed: true },
];

type Props = {
  selected: string[];
  setSelected: (v: string[]) => void;
  onBack: () => void;
  onContinue: () => void;
};

export default function Interests({ selected, setSelected, onBack, onContinue }: Props) {
  const toggle = (label: string) => {
    setSelected(
      selected.includes(label)
        ? selected.filter((s) => s !== label)
        : [...selected, label]
    );
  };

  return (
    <div className="mx-auto max-w-3xl">
      {/* Heading */}
      <div className="mb-10 text-center">
        <h1 className="text-3xl font-black text-gray-900">What are your interests?</h1>
        <p className="mt-3 text-sm text-gray-500 max-w-md mx-auto">
          Select the topics you want to focus on. We&apos;ll prioritize these in your
          dashboard and AI recommendations.
        </p>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {interests.map(({ label, icon: Icon, color, dashed }) => {
          const active = selected.includes(label);
          return (
            <button
              key={label}
              onClick={() => toggle(label)}
              className={`flex items-center gap-3 rounded-xl border px-4 py-4 text-sm font-medium transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md
                ${active
                  ? "border-blue-600 bg-blue-600 text-white shadow-lg shadow-blue-200"
                  : dashed
                  ? "border-dashed border-gray-300 bg-white text-gray-500 hover:border-gray-400"
                  : "border-gray-200 bg-white text-gray-700 hover:border-blue-200"
                }`}
            >
              <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${active ? "bg-white/20" : color}`}>
                <Icon className={`h-4 w-4 ${active ? "text-white" : ""}`} />
              </div>
              {label}
            </button>
          );
        })}
      </div>

      {/* Footer */}
      <div className="mt-16 flex items-center justify-between">
        <button onClick={onBack} className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 transition">
          <ArrowLeft className="h-4 w-4" /> Back
        </button>
        <button
          onClick={onContinue}
          disabled={selected.length === 0}
          className="rounded-xl bg-blue-600 px-10 py-3.5 text-sm font-bold text-white hover:bg-blue-700 transition disabled:opacity-40 disabled:cursor-not-allowed shadow-md shadow-blue-200"
        >
          Continue
        </button>
      </div>
    </div>
  );
}