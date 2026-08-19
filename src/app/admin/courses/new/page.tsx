"use client";

import { useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import {
    ArrowLeft,
    ArrowRight,
    Check,
    Loader2,
    AlertCircle,
} from "lucide-react";

import Topbar from "@/components/admin/Topbar";

import StepIndicator from "@/components/admin/course/StepIndicator";
import StepInfo from "@/components/admin/course/StepInfo";
import StepThumbnail from "@/components/admin/course/StepThumbnail";
import StepModules from "@/components/admin/course/StepModules";
import StepReview from "@/components/admin/course/StepReview";

import type {
    CourseForm,
    Lesson,
    Module,
} from "@/components/admin/course/course.types";
import TUTOR from "@/services/tutor.service";
import { errorMessage, assertUploadable, putToPresigned } from "@/lib/api";

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

    /**
     * Why the Continue button is disabled, or null when it is not.
     *
     * It used to be a bare boolean, so a disabled button gave no clue what was
     * missing. A new module arrives with an empty lesson already inside, which
     * means the lesson-count check always passed and the only thing that could
     * ever block you was an unnamed module — with nothing on screen saying so.
     * Admins uploaded a video, saw Continue stay grey, and reasonably assumed
     * the upload had failed.
     */
    function blockingReason(): string | null {
        if (step === 0) {
            if (!form.title) return "Add a course title.";
            if (!form.description) return "Add a course description.";
            if (!form.category) return "Choose a category.";
            return null;
        }

        if (step === 1) {
            return thumbnail ? null : "Upload a cover image.";
        }

        if (step === 2) {
            if (modules.length === 0) return "Add at least one module.";

            const unnamed = modules.findIndex((m) => !m.title.trim());
            if (unnamed !== -1) return `Name module ${unnamed + 1}.`;

            const lessons = modules.flatMap((m) => m.lessons);
            if (lessons.length === 0) return "Add at least one lesson.";

            // Caught here rather than at submit: the backend rejects an empty
            // title, and failing after the course has already been created
            // leaves a half-built course behind.
            for (const [mi, m] of modules.entries()) {
                for (const [li, lesson] of m.lessons.entries()) {
                    if (!lesson.title.trim()) {
                        return `Name lesson ${li + 1} in module ${mi + 1}.`;
                    }
                    if (lesson.type !== "quiz" && !lesson.file) {
                        return `Upload a file for "${lesson.title.trim()}".`;
                    }
                }
            }
            return null;
        }

        return null;
    }

    function canAdvance() {
        return blockingReason() === null;
    }

    async function uploadThumbnail(): Promise<string | undefined> {
        if (!thumbnail) return undefined;
        assertUploadable(thumbnail, "image");
        const presigned = await TUTOR.requestAssetUpload(thumbnail.name, thumbnail.type);
        await putToPresigned(presigned.upload_url, thumbnail);
        return presigned.file_url;
    }

    async function pollVideoReady(streamUid: string, lessonTitle: string): Promise<number | null> {
        for (let attempt = 0; attempt < 100; attempt++) {
            await new Promise((r) => setTimeout(r, 3000));
            const status = await TUTOR.getVideoStatus(streamUid);
            // Cloudflare returns a float (e.g. 144.8s) — the backend column is
            // an integer and rejects fractional values with a 422.
            if (status.state === "ready") {
                return status.duration_seconds != null ? Math.round(status.duration_seconds) : null;
            }
            if (status.state === "error") {
                throw new Error(`Video processing failed for "${lessonTitle}"`);
            }
        }
        throw new Error(`Video for "${lessonTitle}" is taking too long to process`);
    }

    async function uploadLessonFile(
        lesson: Lesson
    ): Promise<{ content_url?: string | null; duration_seconds?: number | null; stream_uid?: string | null }> {
        if (lesson.type === "quiz" || !lesson.file) return {};

        if (lesson.type === "pdf") {
            assertUploadable(lesson.file, "document");
            const presigned = await TUTOR.requestAssetUpload(lesson.file.name, lesson.file.type);
            await putToPresigned(presigned.upload_url, lesson.file);
            return { content_url: presigned.file_url };
        }

        // video
        const presigned = await TUTOR.requestVideoUpload(lesson.file.name, lesson.file.size);
        const file = lesson.file;
        await new Promise<void>((resolve, reject) => {
            const xhr = new XMLHttpRequest();
            xhr.open("POST", presigned.upload_url);
            xhr.onload = () =>
                xhr.status >= 200 && xhr.status < 300 ? resolve() : reject(new Error("Upload failed"));
            xhr.onerror = () => reject(new Error("Upload failed"));
            const formData = new FormData();
            formData.append("file", file);
            xhr.send(formData);
        });
        const durationSeconds = await pollVideoReady(presigned.stream_uid, lesson.title || "lesson");
        return { content_url: presigned.hls_url, duration_seconds: durationSeconds, stream_uid: presigned.stream_uid };
    }

    async function handleSubmit() {
        for (const courseModule of modules) {
            for (const lesson of courseModule.lessons) {
                if (!lesson.title.trim()) {
                    toast.error(`Every lesson needs a title (missing in "${courseModule.title || "a module"}").`);
                    return;
                }
                if (lesson.type !== "quiz" && !lesson.file) {
                    toast.error(`"${lesson.title}" needs a file uploaded before you can publish.`);
                    return;
                }
            }
        }

        setSubmitting(true);
        try {
            const thumbnailUrl = await uploadThumbnail();

            const course = await TUTOR.createCourse({
                title: form.title.trim(),
                description: form.description.trim() || undefined,
                category: form.category,
                price: Number(form.price) || 0,
                is_premium: form.is_premium,
                thumbnail_url: thumbnailUrl,
                tags: form.tags
                    .split(",")
                    .map((t) => t.trim())
                    .filter(Boolean),
            });

            for (let mIndex = 0; mIndex < modules.length; mIndex++) {
                const courseModule = modules[mIndex];
                const createdModule = await TUTOR.addModule(course.id, {
                    title: courseModule.title.trim(),
                    order: mIndex,
                });

                for (let lIndex = 0; lIndex < courseModule.lessons.length; lIndex++) {
                    const lesson = courseModule.lessons[lIndex];
                    const uploaded = await uploadLessonFile(lesson);
                    await TUTOR.addLesson(course.id, createdModule.id, {
                        title: lesson.title.trim(),
                        type: lesson.type,
                        order: lIndex,
                        duration_seconds: uploaded.duration_seconds ?? null,
                        content_url: uploaded.content_url ?? null,
                        is_preview: lesson.isPreview,
                        stream_uid: uploaded.stream_uid ?? null,
                    });
                }
            }

            if (form.status === "published") {
                await TUTOR.submitCourse(course.id);
            }

            setSubmitted(true);
        } catch (err) {
            toast.error(errorMessage(err, "Couldn't create this course."));
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
                        <Link
                            href="/admin/courses"
                            className="rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
                        >
                            View All Courses
                        </Link>
                        <button
                            type="button"
                            onClick={() => window.location.reload()}
                            className="rounded-xl border border-gray-200 px-5 py-2.5 text-sm font-semibold text-gray-600 hover:bg-gray-50"
                        >
                            Create Another
                        </button>
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
                        <button
                            type="button"
                            onClick={() => setStep((s) => Math.max(0, s - 1))}
                            disabled={step === 0}
                            className="flex items-center gap-1.5 rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-semibold text-gray-600 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
                        >
                            <ArrowLeft className="h-4 w-4" />
                            Back
                        </button>

                        {/* A disabled button with no explanation is the whole
                            complaint: people uploaded a video, saw Continue
                            stay grey, and assumed the upload had failed. */}
                        {step < STEPS.length - 1 && blockingReason() && (
                            <p className="mr-3 flex items-center gap-1.5 text-xs font-medium text-orange-600">
                                <AlertCircle className="size-3.5 shrink-0" />
                                {blockingReason()}
                            </p>
                        )}

                        {step < STEPS.length - 1 ? (
                            <button
                                type="button"
                                onClick={() => canAdvance() && setStep((s) => s + 1)}
                                disabled={!canAdvance()}
                                className="flex items-center gap-1.5 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-40"
                            >
                                Continue
                                <ArrowRight className="h-4 w-4" />
                            </button>
                        ) : (
                            <button
                                type="button"
                                onClick={handleSubmit}
                                disabled={submitting}
                                className="flex items-center gap-1.5 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-60"
                            >
                                {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
                                {form.status === "published" ? "Publish Course" : "Save as Draft"}
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}