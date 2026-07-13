export type CourseFormat = "Video" | "PDF" | "Interactive";

export type CourseCTA = "View Course" | "Download" | "Enroll Now" | "Upgrade to Premium";

export interface CourseTag {
  label: string;
  tone?: "default" | "dark" | "success" | "premium";
}

export interface Course {
  id: string;
  title: string;
  instructor: string;
  instructorRole?: string;
  rating: number;
  reviews: string;
  price: string;
  image: string;
  tags: CourseTag[];
  cta: CourseCTA;
  format: CourseFormat;
}

export type LessonStatus = "done" | "active" | "locked";

export interface Lesson {
  id: string;
  title: string;
  duration: string;
  status: LessonStatus;
}

export interface CourseModule {
  id: string;
  title: string;
  lessons: Lesson[];
}

export interface ContinueLearningItem {
  id: string;
  title: string;
  meta: string;
  duration: string;
  image: string;
}
