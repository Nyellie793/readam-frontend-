import { api } from "@/lib/api";

const ADMIN = {
  /* ── Dashboard stats ─────────────────────────────────────────────────────── */
  /** GET /v1/admin/stats — courses, tutors, students counts */
  getStats: () => api.get("/v1/admin/stats"),

  /* ── Users ───────────────────────────────────────────────────────────────── */
  /** GET /v1/admin/users?role=student|tutor|admin&page=1&page_size=20 */
  getUsers: (page = 1, role?: string) =>
    api.get(`/v1/admin/users?page=${page}${role ? `&role=${role}` : ""}`),

  /** PATCH /v1/admin/users/{user_id} — suspend/reactivate or change role */
  updateUser: (userId: string, body: { is_active?: boolean; role?: string }) =>
    api.patch(`/v1/admin/users/${userId}`, body),

  /* ── Tutors ──────────────────────────────────────────────────────────────── */
  /** GET /v1/admin/tutors?filter_by=all|verified|pending_verification */
  getTutors: (page = 1, filter: "all" | "verified" | "pending_verification" = "all") =>
    api.get(`/v1/admin/tutors?page=${page}&filter_by=${filter}`),

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

  /** POST /v1/admin/courses/{course_id}/approve */
  approveCourse: (courseId: string) =>
    api.post(`/v1/admin/courses/${courseId}/approve`, {}, true),

  /** POST /v1/admin/courses/{course_id}/reject */
  rejectCourse: (courseId: string) =>
    api.post(`/v1/admin/courses/${courseId}/reject`, {}, true),

  /* ── Students ────────────────────────────────────────────────────────────── */
  /** GET /v1/admin/students?search=&page=1&page_size=20 */
  getStudents: (page = 1, search = "") =>
    api.get(`/v1/admin/students?page=${page}${search ? `&search=${encodeURIComponent(search)}` : ""}`),
};

export default ADMIN;
