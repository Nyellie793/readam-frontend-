export type LessonType = "video" | "pdf" | "quiz";

export type CourseLevel =
    | "beginner"
    | "intermediate"
    | "advanced";

export type CourseStatus =
    | "draft"
    | "published";

/**
 * Where a lesson's file has got to.
 *
 * Uploads start as soon as a file is picked rather than at publish, so the
 * transfer and Cloudflare's transcoding overlap with the admin still typing.
 * Publish then only has to create rows, which is fast.
 */
export type UploadState =
    | "idle"
    | "uploading"
    | "processing"
    | "ready"
    | "error";

export interface Lesson {
    id: string;
    title: string;
    type: LessonType;
    /** Only held until the upload finishes. Not persisted: File cannot be serialised. */
    file: File | null;
    fileName: string;
    duration: string;
    isPreview: boolean;

    uploadState: UploadState;
    /** Percent, for the progress bar while uploading. */
    uploadProgress: number;
    uploadError: string;
    /** Set once uploaded. These are what publish actually sends. */
    contentUrl: string | null;
    streamUid: string | null;
    durationSeconds: number | null;
}

export interface Module {
    id: string;
    title: string;
    lessons: Lesson[];
    collapsed: boolean;
}

export interface CourseForm {
    title: string;
    description: string;
    category: string;
    price: string;
    is_premium: boolean;
    tags: string;
    /** Must be one of the API values: "en" | "fr" | "bilingual". */
    language: string;
    status: CourseStatus;
}