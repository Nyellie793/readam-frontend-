"use client";

import { Plus } from "lucide-react";

import type { Module } from "./course.types";

import ModuleBlock from "./ModuleBlock";

interface StepModulesProps {
    modules: Module[];
    onModules: (modules: Module[]) => void;
}

function uid() {
    return Math.random()
        .toString(36)
        .slice(2, 9);
}

function makeLesson() {
    return {
        id: uid(),
        title: "",
        type: "video" as const,
        file: null,
        fileName: "",
        duration: "",
        isPreview: false,
    };
}

function makeModule(): Module {
    return {
        id: uid(),
        title: "",
        lessons: [makeLesson()],
        collapsed: false,
    };
}

export default function StepModules({
    modules,
    onModules,
}: StepModulesProps) {

    function updateModule(
        id: string,
        updates: Partial<Module>
    ) {
        onModules(
            modules.map((module) =>
                module.id === id
                    ? {
                        ...module,
                        ...updates,
                    }
                    : module
            )
        );
    }

    function removeModule(id: string) {
        onModules(
            modules.filter(
                (module) =>
                    module.id !== id
            )
        );
    }

    const totalLessons =
        modules.reduce(
            (total, module) =>
                total + module.lessons.length,
            0
        );

    return (
        <div className="space-y-4">

            {/* Summary */}
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-sm font-semibold text-gray-800">
                        {modules.length} module
                        {modules.length !== 1
                            ? "s"
                            : ""}{" "}
                        · {totalLessons} lesson
                        {totalLessons !== 1
                            ? "s"
                            : ""}
                    </p>

                    <p className="text-xs text-gray-400">
                        Add modules to organise your
                        course, then add lessons inside
                        each module.
                    </p>
                </div>
            </div>

            {/* Modules */}
            {modules.map(
                (module, index) => (
                    <ModuleBlock
                        key={module.id}
                        module={module}
                        index={index}
                        onUpdate={(updates) =>
                            updateModule(
                                module.id,
                                updates
                            )
                        }
                        onRemove={() =>
                            removeModule(
                                module.id
                            )
                        }
                    />
                )
            )}

            {/* Add module */}
            <button
                type="button"
                onClick={() =>
                    onModules([
                        ...modules,
                        makeModule(),
                    ])
                }
                className="flex w-full items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-gray-200 py-4 text-sm font-semibold text-gray-400 hover:border-blue-300 hover:bg-blue-50/30 hover:text-blue-500 transition"
            >
                <Plus className="h-4 w-4" />
                Add Module
            </button>

        </div>
    );
}