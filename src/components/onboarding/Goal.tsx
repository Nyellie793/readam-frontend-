"use client";

import {
  TrendingUp, Brain, Bot, Briefcase, ClipboardList,
  RefreshCw, Timer, Smile, Languages, Wrench, PlusCircle,
} from "lucide-react";
import { ArrowLeft } from "lucide-react";

const goals = [
  { label: "Improve my grades", icon: TrendingUp, color: "text-orange-400" },
  { label: "Learn New skills", icon: Brain, color: "text-blue-400" },
  { label: "Learn AI tools", icon: Bot, color: "text-blue-400" },
  { label: "Get a job", icon: Briefcase, color: "text-orange-400" },
  { label: "Prepare for exams", icon: ClipboardList, color: "text-blue-400" },
  { label: "Change careers", icon: RefreshCw, color: "text-orange-400" },
  { label: "Improve Productivity", icon: Timer, color: "text-gray-500" },
  { label: "Learn for fun", icon: Smile, color: "text-orange-400" },
  { label: "Improve English", icon: Languages, color: "text-blue-400" },
  { label: "Build Projects", icon: Wrench, color: "text-orange-400" },
  { label: "Other", icon: PlusCircle, color: "text-gray-400" },
];

type Props = {
  goals: string[];
  setGoals: (v: string[]) => void;
  onBack: () => void;
  onContinue: () => void;
};

export default function Goal({ goals: selected, setGoals, onBack, onContinue }: Props) {
  const toggle = (label: string) => {
    setGoals(
      selected.includes(label)
        ? selected.filter((s) => s !== label)
        : [...selected, label]
    );
  };

  return (
    <div className="mx-auto max-w-2xl">
      {/* Heading */}
      <div className="mb-10 text-center">
        <h1 className="text-3xl font-black text-gray-900">
          What are you hoping to achieve
          <br />with ReadAm?
        </h1>
        <p className="mt-3 text-sm text-gray-500 max-w-md mx-auto">
          Let us know your specific goals so we can help you to achieve them.
          You can select as many as you like.
        </p>
      </div>

      {/* Pills — centered flex wrap */}
      <div className="flex flex-wrap justify-center gap-3">
        {goals.map(({ label, icon: Icon, color }) => {
          const active = selected.includes(label);
          return (
            <button
              key={label}
              onClick={() => toggle(label)}
              className={`flex items-center gap-2 rounded-full border px-5 py-2.5 text-sm font-medium transition-all duration-200 hover:shadow-md hover:-translate-y-0.5
                ${active
                  ? "border-blue-600 bg-blue-600 text-white shadow-lg shadow-blue-200"
                  : "border-gray-200 bg-white text-gray-700 hover:border-blue-200"
                }`}
            >
              <Icon className={`h-4 w-4 ${active ? "text-white" : color}`} />
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