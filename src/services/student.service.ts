import { api } from "@/lib/api";
import type {
  PaginatedCoursesResponse,
  CourseDetailResponse,
  PaginatedEnrollmentsResponse,
  EnrollmentResponse,
  GamificationResponse,
  StudentProfileResponse,
  MySubscriptionsResponse,
} from "@/types/api.types";

const STUDENT = {
  // GET /v1/courses/recommended
  getRecommendedCourses: (page = 1) =>
    api.get<PaginatedCoursesResponse>(`/v1/courses/recommended?page=${page}`),

  // GET /v1/courses?search=&category=
  browseCourses: (params?: { search?: string; category?: string; page?: number }) => {
    const q = new URLSearchParams();
    if (params?.search) q.set("search", params.search);
    if (params?.category) q.set("category", params.category);
    if (params?.page) q.set("page", String(params.page));
    return api.get<PaginatedCoursesResponse>(`/v1/courses?${q.toString()}`);
  },

  // GET /v1/courses/:id
  getCourse: (courseId: string) =>
    api.get<CourseDetailResponse>(`/v1/courses/${courseId}`),

  // GET /v1/enrollments
  getEnrollments: (page = 1) =>
    api.get<PaginatedEnrollmentsResponse>(`/v1/enrollments?page=${page}`),

  // POST /v1/enrollments
  enroll: (courseId: string) =>
    api.post<EnrollmentResponse>("/v1/enrollments", { course_id: courseId }, true),

  // GET /v1/ai/gamification — streak, XP
  getGamification: () =>
    api.get<GamificationResponse>("/v1/ai/gamification"),

  // GET /v1/students/me
  getProfile: () =>
    api.get<StudentProfileResponse>("/v1/students/me"),

  // GET /v1/subscriptions/me
  getSubscriptions: () =>
    api.get<MySubscriptionsResponse>("/v1/subscriptions/me"),
};

export default STUDENT;