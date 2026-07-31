import { api } from "@/lib/api";
import type {
  TutorProfileResponse,
  UpdateTutorProfileRequest,
  PublicTutorResponse,
  PayoutDetailsResponse,
  TutorNotificationPrefsResponse,
  CourseListItem,
  CourseDetailResponse,
  CreateCourseRequest,
  UpdateCourseRequest,
  CourseModule,
  CreateModuleRequest,
  ModuleLesson,
  CreateLessonRequest,
  UpdateLessonRequest,
  EarningsSummaryResponse,
  PaginatedEarningsResponse,
  PayoutItem,
  PaginatedPayoutsResponse,
  VideoUploadResponse,
  VideoStatusResponse,
  AssetUploadResponse,
} from "@/types/api.types";

const TUTOR = {
  // ── Profile ─────────────────────────────────────────────────────────────
  getMyProfile: () => api.get<TutorProfileResponse>("/v1/tutors/me"),
  updateMyProfile: (body: UpdateTutorProfileRequest) =>
    api.patch<TutorProfileResponse>("/v1/tutors/me", body, true),
  getPublicTutor: (tutorId: string) =>
    api.get<PublicTutorResponse>(`/v1/tutors/${tutorId}`),

  // ── Payout details ──────────────────────────────────────────────────────
  getPayout: () => api.get<PayoutDetailsResponse>("/v1/tutors/me/payout"),
  updatePayout: (body: { mtn_number?: string; orange_money_number?: string }) =>
    api.patch<PayoutDetailsResponse>("/v1/tutors/me/payout", body, true),

  // ── Notification prefs ──────────────────────────────────────────────────
  getNotificationPrefs: () =>
    api.get<TutorNotificationPrefsResponse>("/v1/tutors/me/notifications"),
  updateNotificationPrefs: (body: {
    email_notifications?: boolean;
    push_alerts?: boolean;
    marketing_tips?: boolean;
  }) => api.patch<TutorNotificationPrefsResponse>("/v1/tutors/me/notifications", body, true),

  // ── Courses ──────────────────────────────────────────────────────────────
  createCourse: (body: CreateCourseRequest) =>
    api.post<CourseListItem>("/v1/tutor/courses", body, true),
  listMyCourses: () => api.get<CourseListItem[]>("/v1/tutor/courses"),
  getMyCourse: (courseId: string) =>
    api.get<CourseDetailResponse>(`/v1/tutor/courses/${courseId}`),
  updateCourse: (courseId: string, body: UpdateCourseRequest) =>
    api.patch<CourseListItem>(`/v1/tutor/courses/${courseId}`, body, true),
  deleteCourse: (courseId: string) =>
    api.delete<void>(`/v1/tutor/courses/${courseId}`, true),
  submitCourse: (courseId: string) =>
    api.post<CourseListItem>(`/v1/tutor/courses/${courseId}/submit`, {}, true),
  retractSubmission: (courseId: string) =>
    api.post<CourseListItem>(`/v1/tutor/courses/${courseId}/retract`, {}, true),

  // ── Modules ──────────────────────────────────────────────────────────────
  addModule: (courseId: string, body: CreateModuleRequest) =>
    api.post<CourseModule>(`/v1/tutor/courses/${courseId}/modules`, body, true),
  updateModule: (courseId: string, moduleId: string, body: { title?: string; order?: number }) =>
    api.patch<CourseModule>(`/v1/tutor/courses/${courseId}/modules/${moduleId}`, body, true),
  deleteModule: (courseId: string, moduleId: string) =>
    api.delete<void>(`/v1/tutor/courses/${courseId}/modules/${moduleId}`, true),

  // ── Lessons ──────────────────────────────────────────────────────────────
  addLesson: (courseId: string, moduleId: string, body: CreateLessonRequest) =>
    api.post<ModuleLesson>(`/v1/tutor/courses/${courseId}/modules/${moduleId}/lessons`, body, true),
  updateLesson: (courseId: string, moduleId: string, lessonId: string, body: UpdateLessonRequest) =>
    api.patch<ModuleLesson>(
      `/v1/tutor/courses/${courseId}/modules/${moduleId}/lessons/${lessonId}`,
      body,
      true
    ),
  deleteLesson: (courseId: string, moduleId: string, lessonId: string) =>
    api.delete<void>(`/v1/tutor/courses/${courseId}/modules/${moduleId}/lessons/${lessonId}`, true),

  // ── Earnings ─────────────────────────────────────────────────────────────
  getEarningsSummary: () =>
    api.get<EarningsSummaryResponse>("/v1/tutor/earnings/summary"),
  listEarnings: (page = 1) =>
    api.get<PaginatedEarningsResponse>(`/v1/tutor/earnings?page=${page}`),
  requestPayout: (body: { phone: string; medium?: string }) =>
    api.post<PayoutItem>("/v1/tutor/earnings/payouts", body, true),
  listPayouts: (page = 1) =>
    api.get<PaginatedPayoutsResponse>(`/v1/tutor/earnings/payouts?page=${page}`),

  // ── Uploads ──────────────────────────────────────────────────────────────
  requestVideoUpload: (filename: string, sizeBytes: number) =>
    api.post<VideoUploadResponse>(
      "/v1/tutor/upload/video",
      { filename, size_bytes: sizeBytes },
      true
    ),
  getVideoStatus: (streamUid: string) =>
    api.get<VideoStatusResponse>(`/v1/tutor/upload/video/${streamUid}/status`),
  requestAssetUpload: (filename: string, contentType: string) =>
    api.post<AssetUploadResponse>(
      "/v1/tutor/upload/asset",
      { filename, content_type: contentType },
      true
    ),
};

export default TUTOR;
