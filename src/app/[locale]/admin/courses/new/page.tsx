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
const DRAFT_ID_KEY = "readam_admin_course_draft_id";

function uid() {
    return Math.random().toString(36).slice(2, 9);
}

function makeLesson() {
    return {
        id: uid(),
        serverId: null,
        title: "",
        type: "video" as const,
        file: null,
        fileName: "",
        duration: "",
        description: "",
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
        serverId: null,
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

    /* ── Draft ───────────────────────────────────────────────────────────
     * The course becomes a real draft on the server as soon as step one is
     * valid, and everything after that is saved as it is entered. Before that
     * point there is nothing on the server to save to, so the browser holds
     * the half typed first step and hands it over once the course exists.
     *
     * Deliberately only one of the two is ever authoritative. Keeping a full
     * browser copy alongside a server draft gives two sources of truth, and
     * restoring a stale browser copy over a newer draft silently undoes real
     * work. Once the course id exists the browser copy is discarded.
     */
    const [courseId, setCourseId] = useState<string | null>(null);
    const [savingStep, setSavingStep] = useState(false);
    const [draftState, setDraftState] = useState<"idle" | "saving" | "saved">("idle");
    const [loadingDraft, setLoadingDraft] = useState(true);
    const hydrated = useRef(false);

    // Signature of what was last written to the server, keyed by local id, so
    // an unchanged module or lesson is not re-sent on every keystroke.
    const synced = useRef<Map<string, string>>(new Map());
    /**
     * Database ids keyed by local id, written the instant a row is created.
     *
     * State cannot be trusted for this. A sync pass closes over the modules
     * array from its own render, so a second pass queued before setModules has
     * landed would still see serverId as null and create the row a second
     * time, leaving duplicate modules and lessons on the course. This ref is
     * updated synchronously, so it is always ahead of the state.
     */
    const serverIds = useRef<Map<string, string>>(new Map());
    // Rows removed locally that still exist on the server.
    const pendingDeletes = useRef<{ modules: string[]; lessons: { m: string; l: string }[] }>({
        modules: [],
        lessons: [],
    });
    // Serialises sync passes: each queued pass waits for the one before it, so
    // publishing can await the chain and know everything has landed.
    const syncChain = useRef<Promise<void>>(Promise.resolve());

    function courseInfoPayload() {
        return {
            title: form.title.trim(),
            description: form.description.trim() || undefined,
            category: form.category,
            // The wizard asked for this and then dropped it, so every
            // admin-authored course was filed as English regardless of what
            // was picked, and language decides who finds the course and how
            // its transcripts are generated.
            language: form.language as CourseLanguage,
            price: Number(form.price) || 0,
            is_premium: form.is_premium,
            thumbnail_url: thumbnailUrl ?? undefined,
            tags: form.tags.split(",").map((t) => t.trim()).filter(Boolean),
        };
    }

    /** Creates the draft on first call, updates it afterwards. */
    async function ensureCourse(): Promise<string> {
        if (courseId) {
            await TUTOR.updateCourse(courseId, courseInfoPayload());
            return courseId;
        }
        const created = await TUTOR.createCourse(courseInfoPayload());
        setCourseId(created.id);
        try {
            localStorage.setItem(DRAFT_ID_KEY, created.id);
            // The server is authoritative from here.
            localStorage.removeItem(DRAFT_KEY);
        } catch {
            // Storage being unavailable only costs the resume, not the draft.
        }
        return created.id;
    }

    /* ── Restore ─────────────────────────────────────────────────────────── */
    useEffect(() => {
        let cancelled = false;

        async function restore() {
            let storedId: string | null = null;
            try {
                storedId = localStorage.getItem(DRAFT_ID_KEY);
            } catch {
                storedId = null;
            }

            if (storedId) {
                try {
                    const c = await TUTOR.getMyCourse(storedId);
                    if (cancelled) return;
                    if (c.status !== "draft") throw new Error("not a draft");

                    setCourseId(c.id);
                    setForm({
                        title: c.title ?? "",
                        description: c.description ?? "",
                        category: c.category ?? "",
                        price: String(c.price ?? 0),
                        is_premium: !!c.is_premium,
                        tags: (c.tags ?? []).join(", "),
                        language: c.language ?? "en",
                        status: "draft",
                    });
                    if (c.thumbnail_url) {
                        setThumbnailUrl(c.thumbnail_url);
                        setThumbnailPreview(c.thumbnail_url);
                        setThumbnailState("ready");
                    }
                    if (c.modules?.length) {
                        setModules(
                            c.modules.map((m) => {
                                const localModuleId = uid();
                                serverIds.current.set(localModuleId, m.id);
                                return {
                                id: localModuleId,
                                serverId: m.id,
                                title: m.title,
                                collapsed: false,
                                lessons: m.lessons.length
                                    ? m.lessons.map((l) => {
                                          const localLessonId = uid();
                                          serverIds.current.set(localLessonId, l.id);
                                          return {
                                          id: localLessonId,
                                          serverId: l.id,
                                          title: l.title,
                                          type: l.type,
                                          file: null,
                                          fileName: "Uploaded file",
                                          duration: "",
                                          description: l.description ?? "",
                                          isPreview: l.is_preview,
                                          uploadState: "ready" as const,
                                          uploadProgress: 100,
                                          uploadError: "",
                                          // Left null on purpose: the lesson
                                          // already has content on the server,
                                          // and sending null would clear it.
                                          contentUrl: null,
                                          streamUid: null,
                                          durationSeconds: l.duration_seconds,
                                          };
                                      })
                                    : [makeLesson()],
                                };
                            })
                        );
                        setStep(2);
                    } else {
                        setStep(c.thumbnail_url ? 2 : 1);
                    }
                    toast.info("Picked up your unfinished draft.");
                    return;
                } catch {
                    // Deleted, published, or belongs to someone else. Drop the
                    // pointer rather than trapping the admin on a dead draft.
                    try {
                        localStorage.removeItem(DRAFT_ID_KEY);
                    } catch {
                        // nothing useful to do
                    }
                }
            }

            // No server draft: fall back to the half typed first step.
            try {
                const raw = localStorage.getItem(DRAFT_KEY);
                if (raw && !cancelled) {
                    const saved = JSON.parse(raw) as Partial<{ form: CourseForm }>;
                    if (saved.form) setForm(saved.form);
                }
            } catch {
                // A corrupt draft should never block starting a new course.
            }
        }

        void restore().finally(() => {
            if (cancelled) return;
            hydrated.current = true;
            setLoadingDraft(false);
        });

        return () => {
            cancelled = true;
        };
    }, []);

    /* ── Before the course exists, hold step one in the browser ──────────── */
    useEffect(() => {
        if (!hydrated.current || courseId || submitted) return;
        try {
            localStorage.setItem(DRAFT_KEY, JSON.stringify({ form }));
        } catch {
            // Quota errors are not worth interrupting the admin over.
        }
    }, [form, courseId, submitted]);

    /* ── Once it exists, course details save as they change ─────────────── */
    const courseInfoSignature = JSON.stringify([form, thumbnailUrl]);
    useEffect(() => {
        if (!courseId || submitted) return;
        const timer = setTimeout(() => {
            // Set here rather than in the effect body: saving only actually
            // begins once the debounce fires, and flipping state synchronously
            // on every keystroke just causes a cascading render.
            setDraftState("saving");
            TUTOR.updateCourse(courseId, courseInfoPayload())
                .then(() => setDraftState("saved"))
                .catch(() => {
                // Silent: the same values go up again on the next change and
                // once more when publishing, so one dropped autosave is not
                // worth a toast mid-typing.
            });
        }, 800);
        return () => clearTimeout(timer);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [courseInfoSignature, courseId, submitted]);

    /* ── And so do modules and lessons ──────────────────────────────────── */
    const modulesSignature = JSON.stringify(
        modules.map((m) => ({
            t: m.title.trim(),
            l: m.lessons.map((l) => ({
                t: l.title.trim(),
                ty: l.type,
                d: l.description.trim(),
                p: l.isPreview,
                c: l.contentUrl,
                s: l.streamUid,
                du: l.durationSeconds,
            })),
        }))
    );

    function queueSync(explicitId?: string): Promise<void> {
        const id = explicitId ?? courseId;
        if (!id) return syncChain.current;
        setDraftState("saving");
        syncChain.current = syncChain.current
            .then(() => runSync(id))
            .then(() => setDraftState("saved"))
            .catch(() => setDraftState("idle"));
        return syncChain.current;
    }

    async function runSync(id: string): Promise<void> {

        const dropped = pendingDeletes.current;
        pendingDeletes.current = { modules: [], lessons: [] };
        for (const d of dropped.lessons) {
            try {
                await TUTOR.deleteLesson(id, d.m, d.l);
            } catch {
                // Already gone is the outcome we wanted.
            }
        }
        for (const moduleId of dropped.modules) {
            try {
                await TUTOR.deleteModule(id, moduleId);
            } catch {
                // As above.
            }
        }

        for (let mi = 0; mi < modules.length; mi++) {
            const m = modules[mi];
            if (!m.title.trim()) continue;

            let moduleServerId = m.serverId ?? serverIds.current.get(m.id) ?? null;
            const moduleSig = `${m.title.trim()}|${mi}`;
            if (!moduleServerId) {
                const created = await TUTOR.addModule(id, { title: m.title.trim(), order: mi });
                moduleServerId = created.id;
                serverIds.current.set(m.id, created.id);
                setModules((cur) =>
                    cur.map((x) => (x.id === m.id ? { ...x, serverId: created.id } : x))
                );
                synced.current.set(m.id, moduleSig);
            } else if (synced.current.get(m.id) !== moduleSig) {
                await TUTOR.updateModule(id, moduleServerId, { title: m.title.trim(), order: mi });
                synced.current.set(m.id, moduleSig);
            }

            for (let li = 0; li < m.lessons.length; li++) {
                const l = m.lessons[li];
                if (!l.title.trim()) continue;
                // The backend rejects a non-quiz lesson with no content, so it
                // waits here until the upload has produced a URL.
                const lessonServerId = l.serverId ?? serverIds.current.get(l.id) ?? null;
                if (l.type !== "quiz" && !l.contentUrl && !lessonServerId) continue;

                const lessonSig = JSON.stringify([
                    l.title.trim(), l.type, l.description.trim(), l.isPreview,
                    l.contentUrl, l.streamUid, l.durationSeconds, li,
                ]);
                if (synced.current.get(l.id) === lessonSig) continue;

                // Only send file fields when this session produced new content;
                // omitting them leaves whatever the lesson already has.
                const content = l.contentUrl
                    ? {
                          content_url: l.contentUrl,
                          stream_uid: l.streamUid,
                          duration_seconds: l.durationSeconds,
                      }
                    : {};

                if (!lessonServerId) {
                    const created = await TUTOR.addLesson(id, moduleServerId, {
                        title: l.title.trim(),
                        type: l.type,
                        order: li,
                        description: l.description.trim() || null,
                        is_preview: l.isPreview,
                        ...content,
                    });
                    serverIds.current.set(l.id, created.id);
                    setModules((cur) =>
                        cur.map((x) =>
                            x.id !== m.id
                                ? x
                                : {
                                      ...x,
                                      lessons: x.lessons.map((y) =>
                                          y.id === l.id ? { ...y, serverId: created.id } : y
                                      ),
                                  }
                        )
                    );
                } else {
                    await TUTOR.updateLesson(id, moduleServerId, lessonServerId, {
                        title: l.title.trim(),
                        type: l.type,
                        order: li,
                        description: l.description.trim() || null,
                        is_preview: l.isPreview,
                        ...content,
                    });
                }
                synced.current.set(l.id, lessonSig);
            }
        }
    }

    useEffect(() => {
        if (!courseId || submitted) return;
        const timer = setTimeout(() => {
            void queueSync();
        }, 800);
        return () => clearTimeout(timer);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [modulesSignature, courseId, submitted]);

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

    /**
     * Starts the upload for any lesson that has just been given a file, and
     * records rows that were removed so the next sync deletes them server side.
     */
    function handleModules(next: Module[]) {
        for (const m of modules) {
            const survivor = next.find((x) => x.id === m.id);
            const moduleServerId = m.serverId ?? serverIds.current.get(m.id) ?? null;
            if (!survivor) {
                if (moduleServerId) pendingDeletes.current.modules.push(moduleServerId);
                continue;
            }
            if (!moduleServerId) continue;
            const keptLessons = new Set(survivor.lessons.map((l) => l.id));
            for (const l of m.lessons) {
                const lessonServerId = l.serverId ?? serverIds.current.get(l.id) ?? null;
                if (!keptLessons.has(l.id) && lessonServerId) {
                    pendingDeletes.current.lessons.push({ m: moduleServerId, l: lessonServerId });
                }
            }
        }
        setModules(next);
        for (const m of next) {
            for (const l of m.lessons) {
                if (l.file && l.uploadState === "idle" && !uploading.current.has(l.id)) {
                    void startLessonUpload(m.id, l);
                }
            }
        }
    }

    /**
     * Throw the current draft away and start clean.
     *
     * Without this the wizard would always reopen the same unfinished draft,
     * with no way to begin a different course while one is outstanding.
     */
    async function discardDraft() {
        if (!confirm("Delete this draft and start a new course? This cannot be undone.")) return;
        setSavingStep(true);
        try {
            if (courseId) await TUTOR.deleteCourse(courseId);
        } catch (err) {
            toast.error(errorMessage(err, "Could not delete the draft."));
            setSavingStep(false);
            return;
        }
        try {
            localStorage.removeItem(DRAFT_KEY);
            localStorage.removeItem(DRAFT_ID_KEY);
        } catch {
            // Nothing useful to do if storage is unavailable.
        }
        // Reload rather than unpick every piece of state by hand: the refs
        // holding server ids and sync signatures have to go too.
        window.location.reload();
    }

    async function goNext() {
        if (!canAdvance() || savingStep) return;
        // Leaving the first step is what turns this into a real draft: it is
        // the first point at which the backend has everything it needs.
        if (step === 0) {
            setSavingStep(true);
            try {
                await ensureCourse();
            } catch (err) {
                toast.error(errorMessage(err, "Could not start this course."));
                return;
            } finally {
                setSavingStep(false);
            }
        }
        setStep((current) => current + 1);
    }

    async function handleSubmit() {
        setSubmitting(true);
        try {
            // Everything has been saved along the way; this flushes anything
            // still in flight and then decides whether it goes live.
            const id = await ensureCourse();
            await queueSync(id);
            if (form.status === "published") {
                await TUTOR.submitCourse(id);
            }
            try {
                localStorage.removeItem(DRAFT_KEY);
                localStorage.removeItem(DRAFT_ID_KEY);
            } catch {
                // Nothing useful to do if storage is unavailable.
            }
            setSubmitted(true);
        } catch (err) {
            toast.error(errorMessage(err, "Couldn't save this course."));
        } finally {
            setSubmitting(false);
        }
    }

    // Restoring reads the draft back from the server, so without this the form
    // shows empty for a moment and then fills itself in, which reads as the
    // work having been lost.
    if (loadingDraft) {
        return (
            <>
                <Topbar title="Upload Course" />
                <div className="flex min-h-[70vh] items-center justify-center">
                    <p className="flex items-center gap-2 text-sm text-gray-400">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Checking for an unfinished draft
                    </p>
                </div>
            </>
        );
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

                <div className="mb-8 flex flex-col items-center gap-2">
                    <StepIndicator current={step} />

                    {/* Says plainly whether the work is safe. Before the course
                        exists there is nothing on the server to point at, so
                        this stays quiet until the first step is done. */}
                    {draftState !== "idle" && (
                        <p className="flex items-center gap-1.5 text-xs text-gray-400">
                            {draftState === "saving" ? (
                                <>
                                    <Loader2 className="h-3 w-3 animate-spin" />
                                    Saving draft
                                </>
                            ) : (
                                <>
                                    <Check className="h-3 w-3 text-green-600" />
                                    Draft saved. You can close this and come back to it.
                                </>
                            )}
                        </p>
                    )}

                    {courseId && (
                        <button
                            type="button"
                            onClick={discardDraft}
                            disabled={savingStep || submitting}
                            className="text-xs font-medium text-gray-400 underline underline-offset-2 hover:text-red-500 disabled:opacity-50"
                        >
                            Discard this draft and start over
                        </button>
                    )}
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
                                onClick={goNext}
                                disabled={!canAdvance() || savingStep}
                                className="flex items-center gap-1.5 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-40"
                            >
                                {savingStep && <Loader2 className="h-4 w-4 animate-spin" />}
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