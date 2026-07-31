"use client";

import {
    ChevronDown,
    ChevronUp,
    Plus,
    Trash2,
} from "lucide-react";

import type {
    Lesson,
    Module,
} from "./course.types";

import LessonRow from "./LessonRow";

interface ModuleBlockProps {
    module: Module;
    index: number;
    onUpdate: (updates: Partial<Module>) => void;
    onRemove: () => void;
}

function uid() {
    return Math.random()
        .toString(36)
        .slice(2, 9);
}

function makeLesson(): Lesson {
    return {
        id: uid(),
        title: "",
        type: "video",
        file: null,
        fileName: "",
        duration: "",
        isPreview: false,
    };
}

export default function ModuleBlock({
    module,
    index,
    onUpdate,
    onRemove,
}: ModuleBlockProps) {

    function updateLesson(
        lessonId: string,
        updates: Partial<Lesson>
    ) {
        onUpdate({
            lessons: module.lessons.map(
                (lesson) =>
                    lesson.id === lessonId
                        ? {
                            ...lesson,
                            ...updates,
                        }
                        : lesson
            ),
        });
    }

    function removeLesson(
        lessonId: string
    ) {
        onUpdate({
            lessons: module.lessons.filter(
                (lesson) =>
                    lesson.id !== lessonId
            ),
        });
    }

    function addLesson() {
        onUpdate({
            lessons: [
                ...module.lessons,
                makeLesson(),
            ],
        });
    }

    return (
        <div className="rounded-2xl border border-gray-200 bg-gray-50">

            {/* Module header */}
            <div className="flex items-center gap-3 px-4 py-3">

                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blue-600 text-[11px] font-bold text-white">
                    {index + 1}
                </span>

                <input
                    type="text"
                    placeholder={`Module ${index + 1} title`}
                    value={module.title}
                    onChange={(e) =>
                        onUpdate({
                            title: e.target.value,
                        })
                    }
                    className="flex-1 bg-transparent text-sm font-semibold text-gray-800 outline-none placeholder:font-normal placeholder:text-gray-400"
                />

                <div className="flex items-center gap-1">

                    <span className="text-xs text-gray-400">
                        {module.lessons.length} lesson
                        {module.lessons.length !== 1
                            ? "s"
                            : ""}
                    </span>

                    <button
                        type="button"
                        onClick={() =>
                            onUpdate({
                                collapsed:
                                    !module.collapsed,
                            })
                        }
                        className="rounded-lg p-1.5 text-gray-400 hover:bg-white hover:text-gray-600 transition"
                    >
                        {module.collapsed ? (
                            <ChevronDown className="h-4 w-4" />
                        ) : (
                            <ChevronUp className="h-4 w-4" />
                        )}
                    </button>

                    <button
                        type="button"
                        onClick={onRemove}
                        className="rounded-lg p-1.5 text-gray-300 hover:bg-red-50 hover:text-red-500 transition"
                    >
                        <Trash2 className="h-4 w-4" />
                    </button>

                </div>
            </div>

            {/* Lessons */}
            {!module.collapsed && (
                <div className="space-y-2 px-4 pb-4">

                    {module.lessons.map(
                        (lesson) => (
                            <LessonRow
                                key={lesson.id}
                                lesson={lesson}
                                onUpdate={(updates) =>
                                    updateLesson(
                                        lesson.id,
                                        updates
                                    )
                                }
                                onRemove={() =>
                                    removeLesson(
                                        lesson.id
                                    )
                                }
                            />
                        )
                    )}

                    <button
                        type="button"
                        onClick={addLesson}
                        className="flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-blue-200 py-2.5 text-xs font-semibold text-blue-500 hover:border-blue-400 hover:bg-blue-50 transition"
                    >
                        <Plus className="h-3.5 w-3.5" />
                        Add Lesson
                    </button>

                </div>
            )}
        </div>
    );
}