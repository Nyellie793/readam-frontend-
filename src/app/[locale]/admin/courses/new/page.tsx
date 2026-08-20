"use client";

import { useEffect, useRef, useState } from "react";
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
import type { CourseLanguage } from "@/types/api.types";

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

const DRAFT_KEY = "readam_admin_course_draft";

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
        uploadState: "idle" as const,
        uploadProgress: 0,
        uploadError: "",
        contentUrl: null,
        streamUid: null,
        durationSeconds: null,
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
        price: "0",
        is_premium: false,
        tags: "",
        language: "en",
        status: "draft",
    });

    const [thumbnail, setThumbnail] = useState<File | null>(null);
    const [thumbnailPreview, setThumbnailPreview] = useState("");

    const [modules, setModules] = useState<Module[]>([
        makeModule(),
    ]);

    // Uploaded cover image URL. Kept separately from the File so it survives a
    // reload, which the File cannot.
    const [thumbnailUrl, setThumbnailUrl] = useState<string | null>(null);
    const [thumbnailState, setThumbnailState] = useState<"idle" | "uploading" | "ready" | "error">("idle");

    // Lessons whose upload is already running, so a re-render cannot start a
    // second one for the same lesson before the state patch lands.
    const uploading = useRef<Set<string>>(new Set());

    /* ── Draft persistence ───────────────────────────────────────────────
     * Nothing used to be saved until Publish, so a refresh, a closed tab or a
     * flaky connection lost the whole course. Files are excluded because a
     * File cannot be serialised; by the time it matters the upload has
     * finished and only its URL is needed.
     */
    useEffect(() => {
        try {
            const raw = localStorage.getItem(DRAFT_KEY);
            if (!raw) return;
            const saved = JSON.parse(raw) as Partial<{
                step: number;
                form: CourseForm;
                modules: Module[];
                thumbnailUrl: string;
            }>;
            if (saved.form) setForm(saved.form);
            if (Array.isArray(saved.modules) && saved.modules.length) {
                // An upload that was still running when the tab closed cannot
                // be resumed: the File is gone. Send those lessons back to
                // "idle" so the admin is asked for the file again rather than
                // being left with a progress bar that never moves.
                setModules(
                    saved.modules.map((m) => ({
                        ...m,
                        lessons: m.lessons.map((l) =>
                            l.uploadState === "uploading"
                                ? {
                                      ...l,
                                      file: null,
                                      fileName: "",
                                      uploadState: "idle" as const,
                                      uploadProgress: 0,
                                  }
                                : l
                        ),
                    }))
                );
            }
            if (typeof saved.step === "number") setStep(saved.step);
            if (saved.thumbnailUrl) {
                setThumbnailUrl(saved.thumbnailUrl);
                setThumbnailPreview(saved.thumbnailUrl);
                setThumbnailState("ready");
            }
            toast.info("Picked up where you left off.");
        } catch {
            // A corrupt draft should never block starting a new course.
        }
    }, []);

    useEffect(() => {
        if (submitted) return;
        try {
            localStorage.setItem(
                DRAFT_KEY,
                JSON.stringify({
                    step,
                    form,
                    thumbnailUrl,
                    modules: modules.map((m) => ({
                        ...m,
                        lessons: m.lessons.map((l) => ({ ...l, file: null })),
                    })),
                })
            );
        } catch {
            // Quota errors are not worth interrupting the admin over.
        }
    }, [step, form, thumbnailUrl, modules, submitted]);

    function updateForm(updates: Partial<CourseForm>) {
        setForm((current) => ({
            ...current,
            ...updates,
        }));
    }

    async function handleThumbnail(file: File) {
        setThumbnail(file);
        setThumbnailPreview(URL.createObjectURL(file));
        setThumbnailState("uploading");
        try {
            assertUploadable(file, "image");
            const presigned = await TUTOR.requestAssetUpload(file.name, file.type);
            await putToPresigned(presigned.upload_url, file);
            setThumbnailUrl(presigned.file_url);
            setThumbnailState("ready");
        } catch (err) {
            setThumbnailState("error");
            toast.error(errorMessage(err, "Could not upload the cover image."));
        }
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
            if (!thumbnail && !thumbnailUrl) return "Upload a cover image.";
            if (thumbnailState === "uploading") return "Waiting for the cover image to finish uploading.";
            if (thumbnailState === "error") return "The cover image failed to upload. Try another file.";
            return null;
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
                    if (lesson.type !== "quiz") {
                        if (lesson.uploadState === "idle") {
                            return `Upload a file for "${lesson.title.trim()}".`;
                        }
                        if (lesson.uploadState === "uploading") {
                            return `"${lesson.title.trim()}" is still uploading (${lesson.uploadProgress}%).`;
                        }
                        if (lesson.uploadState === "error") {
                            return `"${lesson.title.trim()}" failed to upload. Replace the file and try again.`;
                        }
                        // "processing" is fine to continue on: the playback URL
                        // and stream id already exist, and only the duration is
                        // still being worked out by Cloudflare.
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

    function patchLesson(moduleId: string, lessonId: string, patch: Partial<Lesson>) {
        setModules((current) =>
            current.map((m) =>
                m.id !== moduleId
                    ? m
                    : {
                          ...m,
                          lessons: m.lessons.map((l) =>
                              l.id !== lessonId ? l : { ...l, ...patch }
                          ),
                      }
            )
        );
    }

    /** POST with a progress callback. fetch() cannot report upload progress. */
    function uploadWithProgress(url: string, file: File, onProgress: (pct: number) => void) {
        return new Promise<void>((resolve, reject) => {
            const xhr = new XMLHttpRequest();
            xhr.open("POST", url);
            xhr.upload.onprogress = (e) => {
                if (e.lengthComputable) onProgress(Math.round((e.loaded / e.total) * 100));
            };
            xhr.onload = () =>
                xhr.status >= 200 && xhr.status < 300 ? resolve() : reject(new Error("Upload failed"));
            xhr.onerror = () => reject(new Error("Upload failed"));
            const body = new FormData();
            body.append("file", file);
            xhr.send(body);
        });
    }

    /**
     * Wait for Cloudflare to finish transcoding, only to learn the duration.
     *
     * This runs in the background after the upload rather than at publish.
     * Publish does not wait for it: the playback URL and stream id are known
     * as soon as the upload lands, and duration is optional on the lesson.
     */
    async function pollVideoReady(streamUid: string): Promise<number | null> {
        for (let attempt = 0; attempt < 100; attempt++) {
            await new Promise((r) => setTimeout(r, 3000));
            const status = await TUTOR.getVideoStatus(streamUid);
            if (status.state === "ready") {
                // Cloudflare returns a float (e.g. 144.8s); the column is an
                // integer and rejects fractional values with a 422.
                return status.duration_seconds != null ? Math.round(status.duration_seconds) : null;
            }
            if (status.state === "error") throw new Error("Cloudflare could not process this video.");
        }
        return null;
    }

    async function startLessonUpload(moduleId: string, lesson: Lesson) {
        const file = lesson.file;
        if (!file) return;
        uploading.current.add(lesson.id);
        patchLesson(moduleId, lesson.id, { uploadState: "uploading", uploadProgress: 0, uploadError: "" });

        try {
            if (lesson.type === "pdf") {
                assertUploadable(file, "document");
                const presigned = await TUTOR.requestAssetUpload(file.name, file.type);
                await putToPresigned(presigned.upload_url, file);
                patchLesson(moduleId, lesson.id, {
                    uploadState: "ready",
                    uploadProgress: 100,
                    contentUrl: presigned.file_url,
                    file: null,
                });
                return;
            }

            const presigned = await TUTOR.requestVideoUpload(file.name, file.size);
            await uploadWithProgress(presigned.upload_url, file, (pct) =>
                patchLesson(moduleId, lesson.id, { uploadProgress: pct })
            );
            // Publishable from here: the stream id and playback URL are known.
            patchLesson(moduleId, lesson.id, {
                uploadState: "processing",
                uploadProgress: 100,
                streamUid: presigned.stream_uid,
                contentUrl: presigned.hls_url,
                file: null,
            });

            const duration = await pollVideoReady(presigned.stream_uid);
            patchLesson(moduleId, lesson.id, { uploadState: "ready", durationSeconds: duration });
        } catch (err) {
            patchLesson(moduleId, lesson.id, {
                uploadState: "error",
                uploadError: errorMessage(err, "Upload failed."),
            });
            toast.error(errorMessage(err, `Could not upload the file for "${lesson.title || "this lesson"}".`));
        } finally {
            uploading.current.delete(lesson.id);
        }
    }

    /** Starts the upload for any lesson that has just been given a file. */
    function handleModules(next: Module[]) {
        setModules(next);
        for (const m of next) {
            for (const l of m.lessons) {
                if (l.file && l.uploadState === "idle" && !uploading.current.has(l.id)) {
                    void startLessonUpload(m.id, l);
                }
            }
        }
    }

    async function handleSubmit() {
        setSubmitting(true);
        try {
            const course = await TUTOR.createCourse({
                title: form.title.trim(),
                description: form.description.trim() || undefined,
                category: form.category,
                // The wizard asked for this and then dropped it, so every
                // admin-authored course was filed as English regardless of
                // what was picked, and language decides who finds the course
                // and how its transcripts are generated.
                language: form.language as CourseLanguage,
                price: Number(form.price) || 0,
                is_premium: form.is_premium,
                thumbnail_url: thumbnailUrl ?? undefined,
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
                    await TUTOR.addLesson(course.id, createdModule.id, {
                        title: lesson.title.trim(),
                        type: lesson.type,
                        order: lIndex,
                        duration_seconds: lesson.durationSeconds,
                        content_url: lesson.contentUrl,
                        is_preview: lesson.isPreview,
                        stream_uid: lesson.streamUid,
                    });
                }
            }

            if (form.status === "published") {
                await TUTOR.submitCourse(course.id);
            }

            try {
                localStorage.removeItem(DRAFT_KEY);
            } catch {
                // Nothing useful to do if storage is unavailable.
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
                                onModules={handleModules}
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