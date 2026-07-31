"use client";

import { Check } from "lucide-react";

const STEPS = [
    "Course Info",
    "Thumbnail",
    "Modules & Lessons",
    "Review & Publish",
];

interface StepIndicatorProps {
    current: number;
}

export default function StepIndicator({
    current,
}: StepIndicatorProps) {
    return (
        <div className="flex items-center gap-0">
            {STEPS.map((label, i) => {
                const done = i < current;
                const active = i === current;

                return (
                    <div
                        key={label}
                        className="flex items-center"
                    >
                        <div className="flex flex-col items-center gap-1.5">
                            <div
                                className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold transition-all ${done
                                        ? "bg-blue-600 text-white"
                                        : active
                                            ? "bg-blue-600 text-white ring-4 ring-blue-100"
                                            : "bg-gray-100 text-gray-400"
                                    }`}
                            >
                                {done ? (
                                    <Check className="h-4 w-4" />
                                ) : (
                                    i + 1
                                )}
                            </div>

                            <span
                                className={`hidden text-[10px] font-semibold sm:block ${active
                                        ? "text-blue-600"
                                        : done
                                            ? "text-gray-500"
                                            : "text-gray-300"
                                    }`}
                            >
                                {label}
                            </span>
                        </div>

                        {i < STEPS.length - 1 && (
                            <div
                                className={`mb-5 h-0.5 w-12 sm:w-20 transition-all ${i < current
                                        ? "bg-blue-600"
                                        : "bg-gray-100"
                                    }`}
                            />
                        )}
                    </div>
                );
            })}
        </div>
    );
}