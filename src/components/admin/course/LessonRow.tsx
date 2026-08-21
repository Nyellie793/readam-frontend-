"use client";

import { useRef } from "react";
import {
    AlertCircle,
    BookOpen,
    Check,
    FileText,
    GripVertical,
    Loader2,
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

                    {/* Optional blurb. The course editor has always had this
                        field, so a lesson written here and then reopened for
                        editing gained a box that was never offered when the
                        course was first built. */}
                    <textarea
                        rows={2}
                        placeholder="Lesson description (optional)"
                        value={lesson.description}
                        onChange={(e) => onUpdate({ description: e.target.value })}
                        className="w-full resize-y rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none transition placeholder:text-gray-400 focus:border-blue-400"
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
                                        // Reset the upload state too, or a
                                        // lesson that previously failed would
                                        // keep its old status and never retry.
                                        onUpdate({
                                            file,
                                            fileName: file.name,
                                            uploadState: "idle",
                                            uploadProgress: 0,
                                            uploadError: "",
                                            contentUrl: null,
                                            streamUid: null,
                                            durationSeconds: null,
                                        });
                                    }
                                }}
                            />

                            {lesson.fileName && (
                                <div className="mt-1">
                                    {lesson.uploadState === "uploading" && (
                                        <>
                                            <p className="flex items-center gap-1 text-xs text-blue-600">
                                                <Loader2 className="h-3 w-3 animate-spin" />
                                                Uploading {lesson.uploadProgress}%
                                            </p>
                                            <div className="mt-1 h-1 w-full overflow-hidden rounded-full bg-gray-100">
                                                <div
                                                    className="h-full rounded-full bg-blue-600 transition-all"
                                                    style={{ width: `${lesson.uploadProgress}%` }}
                                                />
                                            </div>
                                        </>
                                    )}

                                    {/* Uploaded and playable. Cloudflare is still
                                        working out the duration, which is optional,
                                        so there is no reason to make anyone wait. */}
                                    {lesson.uploadState === "processing" && (
                                        <p className="flex items-center gap-1 text-xs text-gray-500">
                                            <Loader2 className="h-3 w-3 animate-spin" />
                                            Uploaded. Processing in the background, you can carry on.
                                        </p>
                                    )}

                                    {lesson.uploadState === "ready" && (
                                        <p className="flex items-center gap-1 text-xs text-green-600">
                                            <Check className="h-3 w-3" />
                                            {lesson.fileName}
                                        </p>
                                    )}

                                    {lesson.uploadState === "error" && (
                                        <p className="flex items-start gap-1 text-xs text-red-500">
                                            <AlertCircle className="mt-0.5 h-3 w-3 shrink-0" />
                                            <span>{lesson.uploadError || "Upload failed."} Pick the file again to retry.</span>
                                        </p>
                                    )}

                                    {lesson.uploadState === "idle" && (
                                        <p className="text-xs text-gray-400">{lesson.fileName}</p>
                                    )}
                                </div>
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