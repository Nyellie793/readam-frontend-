/**
 * Admin service — wraps every admin API endpoint.
 * All calls require a valid admin JWT (auth = true).
 *
 * Swap the placeholder paths below once the real API docs confirm routes.
 */
import { api } from "@/lib/api";

const ADMIN = {
  /* ── Dashboard ──────────────────────────────────────────── */
  getDashboardStats: () => api.get("/admin/dashboard/stats"),
  getRecentActivity: () => api.get("/admin/dashboard/activity"),

  /* ── Courses ─────────────────────────────────────────────── */
  getCourses: (page = 1, q = "") =>
    api.get(`/admin/courses?page=${page}&q=${encodeURIComponent(q)}`),
  approveCourse: (id: string) => api.patch(`/admin/courses/${id}/approve`, {}),
  rejectCourse: (id: string) => api.patch(`/admin/courses/${id}/reject`, {}),

  /* ── Tutors ──────────────────────────────────────────────── */
  getTutors: (page = 1, q = "") =>
    api.get(`/admin/tutors?page=${page}&q=${encodeURIComponent(q)}`),
  verifyTutor: (id: string) => api.patch(`/admin/tutors/${id}/verify`, {}),
  suspendTutor: (id: string) => api.patch(`/admin/tutors/${id}/suspend`, {}),

  /* ── Students ────────────────────────────────────────────── */
  getStudents: (page = 1, q = "") =>
    api.get(`/admin/students?page=${page}&q=${encodeURIComponent(q)}`),
  suspendStudent: (id: string) => api.patch(`/admin/students/${id}/suspend`, {}),

  /* ── Payments ────────────────────────────────────────────── */
  getPaymentStats: () => api.get("/admin/payments/stats"),
  getTransactions: (page = 1) => api.get(`/admin/payments/transactions?page=${page}`),

  /* ── AI Insights ─────────────────────────────────────────── */
  getTopQuestions: () => api.get("/admin/ai/top-questions"),
  getStruggleTopics: () => api.get("/admin/ai/struggle-topics"),
  getAtRiskStudents: () => api.get("/admin/ai/at-risk"),

  /* ── Settings ────────────────────────────────────────────── */
  getPlatformSettings: () => api.get("/admin/settings"),
  updatePlatformSettings: (body: Record<string, unknown>) =>
    api.patch("/admin/settings", body),
  getRoles: () => api.get("/admin/roles"),
};

export default ADMIN;
