import { api } from "@/lib/api";

const ADMIN = {
  /* ── Dashboard stats ─────────────────────────────────────────────────────── */
  /** GET /v1/admin/stats — courses, tutors, students counts */
  getStats: () => api.get("/v1/admin/stats"),

  /* ── Users ───────────────────────────────────────────────────────────────── */
  /** GET /v1/admin/users?role=student|tutor|admin&search=&page=1&page_size=20 */
  getUsers: (page = 1, role?: string, search?: string) =>
    api.get(
      `/v1/admin/users?page=${page}${role ? `&role=${role}` : ""}` +
        (search ? `&search=${encodeURIComponent(search)}` : "")
    ),

  /** PATCH /v1/admin/users/{user_id} — suspend/reactivate or change role */
  updateUser: (userId: string, body: { is_active?: boolean; role?: string }) =>
    api.patch(`/v1/admin/users/${userId}`, body),

  /* ── Tutors ──────────────────────────────────────────────────────────────── */
  /** GET /v1/admin/tutors?filter_by=all|verified|pending_verification */
  getTutors: (page = 1, filter: "all" | "verified" | "pending_verification" = "all") =>
    api.get(`/v1/admin/tutors?page=${page}&filter_by=${filter}`),

  /** GET /v1/admin/tutors/{tutor_id} — full profile + their courses */
  getTutorDetail: (tutorId: string) => api.get(`/v1/admin/tutors/${tutorId}`),

  /** PATCH /v1/admin/tutors/{tutor_id}/verify */
  verifyTutor: (tutorId: string, is_verified: boolean) =>
    api.patch(`/v1/admin/tutors/${tutorId}/verify`, { is_verified }),

  /* ── Courses ─────────────────────────────────────────────────────────────── */
  /** GET /v1/admin/courses?status=pending_review|published|draft|rejected */
  getCourses: (page = 1, status?: string) =>
    api.get(`/v1/admin/courses?page=${page}${status ? `&status=${status}` : ""}`),

  /** GET /v1/admin/courses/{course_id} */
  getCourseDetail: (courseId: string) =>
    api.get(`/v1/admin/courses/${courseId}`),

  /** GET /v1/admin/courses/{course_id}/lessons/{lesson_id} — playable content for review */
  getLessonForReview: (courseId: string, lessonId: string) =>
    api.get(`/v1/admin/courses/${courseId}/lessons/${lessonId}`),

  /** POST /v1/admin/courses/{course_id}/approve */
  approveCourse: (courseId: string) =>
    api.post(`/v1/admin/courses/${courseId}/approve`, {}, true),

  /** POST /v1/admin/courses/{course_id}/reject */
  rejectCourse: (courseId: string, reason?: string) =>
    api.post(`/v1/admin/courses/${courseId}/reject`, { reason: reason ?? null }, true),

  /* ── Students ────────────────────────────────────────────────────────────── */
  /** GET /v1/admin/students?search=&page=1&page_size=20 */
  getStudents: (page = 1, search = "") =>
    api.get(`/v1/admin/students?page=${page}${search ? `&search=${encodeURIComponent(search)}` : ""}`),

  /* ── Payments ────────────────────────────────────────────────────────────── */
  /** GET /v1/admin/payments/stats */
  getPaymentStats: () => api.get("/v1/admin/payments/stats"),

  /** GET /v1/admin/analytics — revenue, money flow, sources, payment health, top courses */
  getAnalytics: (topCourses = 10) =>
    api.get(`/v1/admin/analytics?top_courses_limit=${topCourses}`),

  /** GET /v1/admin/payments/revenue-trend?days=7 */
  getRevenueTrend: (days = 7) => api.get(`/v1/admin/payments/revenue-trend?days=${days}`),

  /** GET /v1/admin/payments?page=1 */
  getTransactions: (page = 1, pageSize = 20) =>
    api.get(`/v1/admin/payments?page=${page}&page_size=${pageSize}`),
};

export default ADMIN;
