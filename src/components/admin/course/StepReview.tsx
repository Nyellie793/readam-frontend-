"use client";

import Image from "next/image";
import {
    Check,
    ImageIcon,
} from "lucide-react";

import type {
    CourseForm,
    CourseStatus,
    Module,
} from "./course.types";

interface StepReviewProps {
    form: CourseForm;
    modules: Module[];
    thumbnail: string;
    status: CourseStatus;
    onStatus: (status: CourseStatus) => void;
}

export default function StepReview({
    form,
    modules,
    thumbnail,
    status,
    onStatus,
}: StepReviewProps) {

    const totalLessons =
        modules.reduce(
            (total, module) =>
                total + module.lessons.length,
            0
        );

    const videoCount =
        modules
            .flatMap(
                (module) => module.lessons
            )
            .filter(
                (lesson) =>
                    lesson.type === "video"
            ).length;

    const pdfCount =
        modules
            .flatMap(
                (module) => module.lessons
            )
            .filter(
                (lesson) =>
                    lesson.type === "pdf"
            ).length;

    return (
        <div className="space-y-6">

            {/* Summary card */}
            <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">

                <div className="flex gap-5 p-5">

                    {thumbnail ? (
                        <div className="relative h-24 w-40 shrink-0 overflow-hidden rounded-xl bg-gray-100">
                            <Image
                                src={thumbnail}
                                alt="Thumbnail"
                                fill
                                className="object-cover"
                            />
                        </div>
                    ) : (
                        <div className="flex h-24 w-40 shrink-0 items-center justify-center rounded-xl bg-gray-100">
                            <ImageIcon className="h-8 w-8 text-gray-300" />
                        </div>
                    )}

                    <div className="min-w-0 flex-1">

                        <h3 className="truncate text-base font-bold text-gray-900">
                            {form.title ||
                                "Untitled Course"}
                        </h3>

                        <p className="mt-1 line-clamp-2 text-sm text-gray-500">
                            {form.description ||
                                "No description."}
                        </p>

                        <div className="mt-3 flex flex-wrap gap-2">

                            {form.category && (
                                <span className="rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-medium text-blue-600">
                                    {form.category}
                                </span>
                            )}

                            <span className="rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium capitalize text-gray-600">
                                {form.level}
                            </span>

                            {form.is_premium && (
                                <span className="rounded-full bg-orange-50 px-2.5 py-0.5 text-xs font-medium text-orange-600">
                                    Premium
                                </span>
                            )}

                            <span className="rounded-full bg-green-50 px-2.5 py-0.5 text-xs font-medium text-green-600">
                                {Number(form.price) === 0
                                    ? "Free"
                                    : `${Number(form.price).toLocaleString()} XAF`}
                            </span>

                        </div>
                    </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 divide-x divide-gray-100 border-t border-gray-100">

                    <div className="py-3 text-center">
                        <p className="text-lg font-black text-gray-900">
                            {modules.length}
                        </p>
                        <p className="text-xs text-gray-400">
                            Modules
                        </p>
                    </div>

                    <div className="py-3 text-center">
                        <p className="text-lg font-black text-gray-900">
                            {totalLessons}
                        </p>
                        <p className="text-xs text-gray-400">
                            Lessons
                        </p>
                    </div>

                    <div className="py-3 text-center">
                        <p className="text-lg font-black text-gray-900">
                            {videoCount} / {pdfCount}
                        </p>
                        <p className="text-xs text-gray-400">
                            Videos / PDFs
                        </p>
                    </div>

                </div>
            </div>

            {/* Tags */}
            {form.tags && (
                <div>
                    <p className="mb-2 text-xs font-semibold text-gray-600">
                        Tags
                    </p>

                    <div className="flex flex-wrap gap-2">
                        {form.tags
                            .split(",")
                            .map((tag) => tag.trim())
                            .filter(Boolean)
                            .map((tag) => (
                                <span
                                    key={tag}
                                    className="rounded-full border border-gray-200 px-3 py-1 text-xs text-gray-600"
                                >
                                    {tag}
                                </span>
                            ))}
                    </div>
                </div>
            )}

            {/* Publish status */}
            <div>
                <p className="mb-3 text-xs font-semibold text-gray-600">
                    Publish Status
                </p>

                <div className="grid grid-cols-2 gap-3">

                    {(
                        ["draft", "published"] as CourseStatus[]
                    ).map((option) => (
                        <button
                            key={option}
                            type="button"
                            onClick={() =>
                                onStatus(option)
                            }
                            className={`rounded-xl border-2 px-4 py-3 text-left transition ${status === option
                                    ? option === "published"
                                        ? "border-blue-600 bg-blue-50"
                                        : "border-gray-400 bg-gray-50"
                                    : "border-gray-100 bg-white hover:border-gray-200"
                                }`}
                        >
                            <p
                                className={`text-sm font-bold ${status === option
                                        ? option === "published"
                                            ? "text-blue-600"
                                            : "text-gray-700"
                                        : "text-gray-500"
                                    }`}
                            >
                                {option === "published"
                                    ? "Publish Now"
                                    : "Save as Draft"}
                            </p>

                            <p className="mt-0.5 text-xs text-gray-400">
                                {option === "published"
                                    ? "Course goes live immediately"
                                    : "Save and publish later"}
                            </p>
                        </button>
                    ))}

                </div>
            </div>

            {/* Checklist */}
            <div className="rounded-2xl border border-gray-100 bg-gray-50 p-4">

                <p className="mb-3 text-xs font-bold text-gray-700">
                    Pre-publish Checklist
                </p>

                <div className="space-y-2">

                    {[
                        {
                            label: "Course title added",
                            ok: !!form.title,
                        },
                        {
                            label: "Description written",
                            ok: !!form.description,
                        },
                        {
                            label: "Category selected",
                            ok: !!form.category,
                        },
                        {
                            label: "Thumbnail uploaded",
                            ok: !!thumbnail,
                        },
                        {
                            label:
                                "At least one module with a lesson",
                            ok:
                                modules.length > 0 &&
                                totalLessons > 0,
                        },
                    ].map((item) => (
                        <div
                            key={item.label}
                            className="flex items-center gap-2.5"
                        >
                            <div
                                className={`flex h-[18px] w-[18px] items-center justify-center rounded-full ${item.ok
                                        ? "bg-green-500"
                                        : "bg-gray-200"
                                    }`}
                            >
                                {item.ok && (
                                    <Check className="h-2.5 w-2.5 text-white" />
                                )}
                            </div>

                            <span
                                className={`text-xs ${item.ok
                                        ? "text-gray-700"
                                        : "text-gray-400"
                                    }`}
                            >
                                {item.label}
                            </span>
                        </div>
                    ))}

                </div>
            </div>

        </div>
    );
}