export type LessonType = "video" | "pdf" | "quiz";

export type CourseLevel =
    | "beginner"
    | "intermediate"
    | "advanced";

export type CourseStatus =
    | "draft"
    | "published";

export interface Lesson {
    id: string;
    title: string;
    type: LessonType;
    file: File | null;
    fileName: string;
    duration: string;
    isPreview: boolean;
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