"use client";

import type {
    CourseForm,
} from "./course.types";
import { COURSE_CATEGORIES } from "@/constants/course-categories";

function FieldLabel({
    children,
    required,
}: {
    children: React.ReactNode;
    required?: boolean;
}) {
    return (
        <label className="mb-1.5 block text-xs font-semibold text-gray-600">
            {children}
            {required && (
                <span className="text-red-500"> *</span>
            )}
        </label>
    );
}

function InputField({
    label,
    required,
    ...props
}: {
    label: string;
    required?: boolean;
} & React.InputHTMLAttributes<HTMLInputElement>) {
    return (
        <div>
            <FieldLabel required={required}>
                {label}
            </FieldLabel>

            <input
                {...props}
                className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-800 outline-none placeholder:text-gray-400 focus:border-blue-400 focus:ring-2 focus:ring-blue-50 transition"
            />
        </div>
    );
}

function SelectField({
    label,
    required,
    children,
    ...props
}: {
    label: string;
    required?: boolean;
} & React.SelectHTMLAttributes<HTMLSelectElement>) {
    return (
        <div>
            <FieldLabel required={required}>
                {label}
            </FieldLabel>

            <select
                {...props}
                className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-800 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-50 transition"
            >
                {children}
            </select>
        </div>
    );
}

interface StepInfoProps {
    form: CourseForm;
    onChange: (updates: Partial<CourseForm>) => void;
}

export default function StepInfo({
    form,
    onChange,
}: StepInfoProps) {
    return (
        <div className="space-y-5">
            <div className="grid gap-5 sm:grid-cols-2">

                {/* Course title */}
                <div className="sm:col-span-2">
                    <InputField
                        label="Course Title"
                        required
                        placeholder="e.g. Advanced Mathematics for GCE A Level"
                        value={form.title}
                        onChange={(e) =>
                            onChange({
                                title: e.target.value,
                            })
                        }
                    />
                </div>

                {/* Description */}
                <div className="sm:col-span-2">
                    <FieldLabel required>
                        Description
                    </FieldLabel>

                    <textarea
                        rows={4}
                        placeholder="Describe what students will learn in this course..."
                        value={form.description}
                        onChange={(e) =>
                            onChange({
                                description: e.target.value,
                            })
                        }
                        className="w-full resize-none rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-800 outline-none placeholder:text-gray-400 focus:border-blue-400 focus:ring-2 focus:ring-blue-50 transition"
                    />
                </div>

                {/* Category */}
                <SelectField
                    label="Category"
                    required
                    value={form.category}
                    onChange={(e) =>
                        onChange({
                            category: e.target.value,
                        })
                    }
                >
                    <option value="">
                        Select a category
                    </option>

                    {COURSE_CATEGORIES.map((category) => (
                        <option
                            key={category.value}
                            value={category.value}
                        >
                            {category.label}
                        </option>
                    ))}
                </SelectField>

                {/* Language */}
                <SelectField
                    label="Language"
                    value={form.language}
                    onChange={(e) =>
                        onChange({
                            language: e.target.value,
                        })
                    }
                >
                    {/* Must match the API enum: en / fr / bilingual. These
                        were "english" and "french", which the backend rejects. */}
                    <option value="en">
                        English
                    </option>

                    <option value="fr">
                        French
                    </option>

                    <option value="bilingual">
                        Bilingual (EN/FR)
                    </option>
                </SelectField>

                {/* Price */}
                <InputField
                    label="Price (XAF)"
                    placeholder="0 for free"
                    type="number"
                    min={0}
                    value={form.price}
                    onChange={(e) =>
                        onChange({
                            price: e.target.value,
                        })
                    }
                />

                {/* Tags */}
                <div className="sm:col-span-2">
                    <InputField
                        label="Tags (comma separated)"
                        placeholder="e.g. GCE, A Level, Mathematics, Calculus"
                        value={form.tags}
                        onChange={(e) =>
                            onChange({
                                tags: e.target.value,
                            })
                        }
                    />

                    <p className="mt-1.5 text-xs text-gray-400">
                        Tags help students find this course in search.
                    </p>
                </div>

                {/* Premium toggle */}
                <div className="sm:col-span-2">
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

            </div>
        </div>
    );
}