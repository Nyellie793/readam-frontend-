"use client";

import type { CourseForm as CourseFormData } from "./course.types";

interface CourseFormProps {
    form: CourseFormData;
    onChange: (updates: Partial<CourseFormData>) => void;
}

export default function CourseForm({
    form,
    onChange,
}: CourseFormProps) {
    return (
        <div className="space-y-5">
            {/* Course Title */}
            <div>
                <label className="mb-1.5 block text-xs font-semibold text-gray-600">
                    Course Title <span className="text-red-500">*</span>
                </label>

                <input
                    type="text"
                    value={form.title}
                    onChange={(e) =>
                        onChange({
                            title: e.target.value,
                        })
                    }
                    placeholder="e.g. Advanced Mathematics for GCE A Level"
                    className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-800 outline-none placeholder:text-gray-400 focus:border-blue-400 focus:ring-2 focus:ring-blue-50 transition"
                />
            </div>

            {/* Description */}
            <div>
                <label className="mb-1.5 block text-xs font-semibold text-gray-600">
                    Description <span className="text-red-500">*</span>
                </label>

                <textarea
                    rows={4}
                    value={form.description}
                    onChange={(e) =>
                        onChange({
                            description: e.target.value,
                        })
                    }
                    placeholder="Describe what students will learn in this course..."
                    className="w-full resize-none rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-800 outline-none placeholder:text-gray-400 focus:border-blue-400 focus:ring-2 focus:ring-blue-50 transition"
                />
            </div>

            {/* Category + Level */}
            <div className="grid gap-5 sm:grid-cols-2">
                <div>
                    <label className="mb-1.5 block text-xs font-semibold text-gray-600">
                        Category <span className="text-red-500">*</span>
                    </label>

                    <select
                        value={form.category}
                        onChange={(e) =>
                            onChange({
                                category: e.target.value,
                            })
                        }
                        className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-800 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-50 transition"
                    >
                        <option value="">
                            Select a category
                        </option>

                        <option value="Mathematics">
                            Mathematics
                        </option>

                        <option value="English">
                            English
                        </option>

                        <option value="Science">
                            Science
                        </option>

                        <option value="Physics">
                            Physics
                        </option>

                        <option value="Chemistry">
                            Chemistry
                        </option>

                        <option value="Biology">
                            Biology
                        </option>

                        <option value="History">
                            History
                        </option>

                        <option value="Geography">
                            Geography
                        </option>

                        <option value="Technology">
                            Technology
                        </option>

                        <option value="Design">
                            Design
                        </option>

                        <option value="Economics">
                            Economics
                        </option>

                        <option value="Philosophy">
                            Philosophy
                        </option>

                        <option value="French">
                            French
                        </option>

                        <option value="Literature">
                            Literature
                        </option>
                    </select>
                </div>

            </div>

            {/* Language + Price */}
            <div className="grid gap-5 sm:grid-cols-2">
                <div>
                    <label className="mb-1.5 block text-xs font-semibold text-gray-600">
                        Language
                    </label>

                    <select
                        value={form.language}
                        onChange={(e) =>
                            onChange({
                                language: e.target.value,
                            })
                        }
                        className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-800 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-50 transition"
                    >
                        <option value="english">
                            English
                        </option>

                        <option value="french">
                            French
                        </option>

                        <option value="bilingual">
                            Bilingual (EN/FR)
                        </option>
                    </select>
                </div>

                <div>
                    <label className="mb-1.5 block text-xs font-semibold text-gray-600">
                        Price (XAF)
                    </label>

                    <input
                        type="number"
                        min={0}
                        value={form.price}
                        onChange={(e) =>
                            onChange({
                                price: e.target.value,
                            })
                        }
                        placeholder="0 for free"
                        className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-800 outline-none placeholder:text-gray-400 focus:border-blue-400 focus:ring-2 focus:ring-blue-50 transition"
                    />
                </div>
            </div>

            {/* Tags */}
            <div>
                <label className="mb-1.5 block text-xs font-semibold text-gray-600">
                    Tags (comma separated)
                </label>

                <input
                    type="text"
                    value={form.tags}
                    onChange={(e) =>
                        onChange({
                            tags: e.target.value,
                        })
                    }
                    placeholder="e.g. GCE, A Level, Mathematics, Calculus"
                    className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-800 outline-none placeholder:text-gray-400 focus:border-blue-400 focus:ring-2 focus:ring-blue-50 transition"
                />

                <p className="mt-1.5 text-xs text-gray-400">
                    Tags help students find this course in search.
                </p>
            </div>

            {/* Premium Course */}
            <div className="flex items-center justify-between rounded-xl border border-gray-200 bg-gray-50 px-4 py-3">
                <div>
                    <p className="text-sm font-semibold text-gray-800">
                        Premium Course
                    </p>

                    <p className="text-xs text-gray-400">
                        Only available to subscribed students
                    </p>
                </div>

                <button
                    type="button"
                    onClick={() =>
                        onChange({
                            is_premium: !form.is_premium,
                        })
                    }
                    className={`relative h-6 w-11 rounded-full transition-colors ${form.is_premium
                            ? "bg-blue-600"
                            : "bg-gray-200"
                        }`}
                >
                    <span
                        className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow-sm transition-all ${form.is_premium
                                ? "left-[22px]"
                                : "left-0.5"
                            }`}
                    />
                </button>
            </div>
        </div>
    );
}