"use client";

import { useState } from "react";
import Link from "next/link";
import {
    ArrowLeft,
    ArrowRight,
    Check,
    Loader2,
} from "lucide-react";

import Topbar from "@/components/admin/Topbar";

import StepIndicator from "@/components/admin/course/StepIndicator";
import StepInfo from "@/components/admin/course/StepInfo";
import StepThumbnail from "@/components/admin/course/StepThumbnail";
import StepModules from "@/components/admin/course/StepModules";
import StepReview from "@/components/admin/course/StepReview";

import {
    CourseForm,
    CourseStatus,
    Module,
} from "@/components/admin/course/course.types";

const STEPS = [
    "Course Info",
    "Thumbnail",
    "Modules & Lessons",
    "Review & Publish",
];

function uid() {
    return Math.random().toString(36).slice(2, 9);
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

export default function NewCoursePage() {
    const [step, setStep] = useState(0);
    const [submitting, setSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    const [form, setForm] = useState<CourseForm>({
        title: "",
        description: "",
        category: "",
        level: "beginner",
        price: "0",
        is_premium: false,
        tags: "",
        language: "english",
        status: "draft",
    });

    const [thumbnail, setThumbnail] = useState<File | null>(null);
    const [thumbnailPreview, setThumbnailPreview] = useState("");

    const [modules, setModules] = useState<Module[]>([
        makeModule(),
    ]);

    function updateForm(updates: Partial<CourseForm>) {
        setForm((current) => ({
            ...current,
            ...updates,
        }));
    }

    function handleThumbnail(file: File) {
        setThumbnail(file);
        setThumbnailPreview(URL.createObjectURL(file));
    }

    function canAdvance() {
        if (step === 0) {
            return (
                !!form.title &&
                !!form.description &&
                !!form.category
            );
        }

        if (step === 1) {
            return !!thumbnail;
        }

        if (step === 2) {
            return (
                modules.length > 0 &&
                modules.every((module) => module.title) &&
                modules.flatMap((module) => module.lessons).length > 0
            );
        }

        return true;
    }

    async function handleSubmit() {
        setSubmitting(true);

        try {
            // Backend integration goes here

            await new Promise((resolve) =>
                setTimeout(resolve, 1500)
            );

            setSubmitted(true);
        } finally {
            setSubmitting(false);
        }
    }

    if (submitted) {
        return (
            <>
                <Topbar title="Upload Course" />

                <div className="flex min-h-[70vh] flex-col items-center justify-center p-6 text-center">
                    <div className="flex h-20 w-20 items-center justify-center rounded-full bg-green-100">
                        <Check className="h-10 w-10 text-green-600" />
                    </div>

                    <h2 className="mt-6 text-2xl font-black text-gray-900">
                        Course Created!
                    </h2>

                    <p className="mt-2 max-w-sm text-sm text-gray-500">
                        {form.status === "published"
                            ? "Your course is now live on the platform."
                            : "Your course has been saved as a draft. You can publish it from the Courses page."}
                    </p>

                    <div className="mt-8 flex gap-3">
                        {/* buttons */}
                    </div>
                </div>
            </>
        );
    }

    return (
        <>
            <Topbar
                title="Upload Course"
                description="Create and publish a new course to the platform."
            />

            <div className="p-4 sm:p-6">
                <Link
                    href="/admin/courses"
                    className="mb-6 inline-flex items-center gap-1.5 text-sm font-medium text-gray-500 hover:text-blue-600"
                >
                    <ArrowLeft className="h-4 w-4" />
                    Back to Courses
                </Link>

                <div className="mb-8 flex justify-center">
                    <StepIndicator current={step} />
                </div>

                <div className="mx-auto max-w-3xl">
                    <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm sm:p-8">
                        <h2 className="mb-6 text-lg font-black text-gray-900">
                            {STEPS[step]}
                        </h2>

                        {step === 0 && (
                            <StepInfo
                                form={form}
                                onChange={updateForm}
                            />
                        )}

                        {step === 1 && (
                            <StepThumbnail
                                file={thumbnail}
                                preview={thumbnailPreview}
                                onFile={handleThumbnail}
                            />
                        )}

                        {step === 2 && (
                            <StepModules
                                modules={modules}
                                onModules={setModules}
                            />
                        )}

                        {step === 3 && (
                            <StepReview
                                form={form}
                                modules={modules}
                                thumbnail={thumbnailPreview}
                                status={form.status}
                                onStatus={(status) =>
                                    updateForm({ status })
                                }
                            />
                        )}
                    </div>

                    <div className="mt-5 flex items-center justify-between">
                        {/* Back / Continue / Submit buttons */}
                    </div>
                </div>
            </div>
        </>
    );
}