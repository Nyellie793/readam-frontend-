"use client";

import { useRef } from "react";
import {
    BookOpen,
    Check,
    FileText,
    GripVertical,
    Trash2,
    Upload,
    Video,
} from "lucide-react";

import type {
    Lesson,
    LessonType,
} from "./course.types";

interface LessonRowProps {
    lesson: Lesson;
    onUpdate: (updates: Partial<Lesson>) => void;
    onRemove: () => void;
}

const LESSON_TYPES: {
    value: LessonType;
    label: string;
    icon: React.ReactNode;
}[] = [
        {
            value: "video",
            label: "Video",
            icon: <Video className="h-3.5 w-3.5" />,
        },
        {
            value: "pdf",
            label: "PDF",
            icon: <FileText className="h-3.5 w-3.5" />,
        },
        {
            value: "quiz",
            label: "Quiz",
            icon: <BookOpen className="h-3.5 w-3.5" />,
        },
    ];

export default function LessonRow({
    lesson,
    onUpdate,
    onRemove,
}: LessonRowProps) {
    const fileRef =
        useRef<HTMLInputElement>(null);

    return (
        <div className="group rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
            <div className="flex items-start gap-3">

                <GripVertical className="mt-2.5 h-4 w-4 shrink-0 text-gray-300" />

                <div className="flex-1 space-y-3">

                    {/* Type selector */}
                    <div className="flex flex-wrap items-center gap-2">
                        <div className="flex overflow-hidden rounded-lg border border-gray-200">
                            {LESSON_TYPES.map((type) => (
                                <button
                                    key={type.value}
                                    type="button"
                                    onClick={() =>
                                        onUpdate({
                                            type: type.value,
                                            file: null,
                                            fileName: "",
                                        })
                                    }
                                    className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold transition ${lesson.type === type.value
                                            ? "bg-blue-600 text-white"
                                            : "bg-white text-gray-500 hover:bg-gray-50"
                                        }`}
                                >
                                    {type.icon}
                                    {type.label}
                                </button>
                            ))}
                        </div>

                        {/* Preview */}
                        <button
                            type="button"
                            onClick={() =>
                                onUpdate({
                                    isPreview:
                                        !lesson.isPreview,
                                })
                            }
                            className={`rounded-lg border px-3 py-1.5 text-xs font-semibold transition ${lesson.isPreview
                                    ? "border-orange-200 bg-orange-50 text-orange-600"
                                    : "border-gray-200 bg-white text-gray-400 hover:border-gray-300"
                                }`}
                        >
                            {lesson.isPreview
                                ? "Free Preview ✓"
                                : "Set as Preview"}
                        </button>
                    </div>

                    {/* Title.

                        There used to be a duration field beside this, labelled
                        "Duration (e.g. 12:30)" as though it were required. It
                        was never read: video length comes back from Cloudflare
                        once the upload finishes, and PDFs have no duration at
                        all. Asking for a number that is then thrown away only
                        made people think it was why they could not continue. */}
                    <input
                        type="text"
                        placeholder="Lesson title"
                        value={lesson.title}
                        onChange={(e) => onUpdate({ title: e.target.value })}
                        className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none transition placeholder:text-gray-400 focus:border-blue-400"
                    />

                    {/* File upload */}
                    {lesson.type !== "quiz" && (
                        <div>
                            <button
                                type="button"
                                onClick={() =>
                                    fileRef.current?.click()
                                }
                                className="flex items-center gap-2 rounded-lg border border-dashed border-gray-200 bg-gray-50 px-4 py-2 text-xs font-medium text-gray-500 hover:border-blue-300 hover:bg-blue-50 hover:text-blue-600 transition"
                            >
                                <Upload className="h-3.5 w-3.5" />

                                {lesson.fileName
                                    ? lesson.fileName
                                    : `Upload ${lesson.type === "video"
                                        ? "Video (MP4)"
                                        : "PDF File"
                                    }`}
                            </button>

                            <input
                                ref={fileRef}
                                type="file"
                                accept={
                                    lesson.type === "video"
                                        ? "video/*"
                                        : "application/pdf"
                                }
                                className="hidden"
                                onChange={(e) => {
                                    const file =
                                        e.target.files?.[0];

                                    if (file) {
                                        onUpdate({
                                            file,
                                            fileName: file.name,
                                        });
                                    }
                                }}
                            />

                            {lesson.fileName && (
                                <p className="mt-1 flex items-center gap-1 text-xs text-green-600">
                                    <Check className="h-3 w-3" />
                                    {lesson.fileName}
                                </p>
                            )}
                        </div>
                    )}
                </div>

                {/* Delete */}
                <button
                    type="button"
                    onClick={onRemove}
                    className="mt-1 rounded-lg p-1.5 text-gray-300 hover:bg-red-50 hover:text-red-500 transition"
                >
                    <Trash2 className="h-4 w-4" />
                </button>

            </div>
        </div>
    );
}