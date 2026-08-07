import { api } from "@/lib/api";
import type {
  PaginatedCoursesResponse,
  CourseDetailResponse,
  PaginatedEnrollmentsResponse,
  EnrollmentResponse,
  GamificationResponse,
  StudentProfileResponse,
  MySubscriptionsResponse,
  LessonContentResponse,
  LessonProgressResponse,
  WeeklyActivityResponse,
  BadgesResponse,
  RecentlyViewedResponse,
  SavedCourseResponse,
  NotificationPrefsResponse,
  PaginatedPaymentsResponse,
  ProductResponse,
  PaginatedNotificationsResponse,
  MarkAllReadResponse,
  NotificationItem,
  SubscriptionPaymentResponse,
  PaymentResponse,
  PastQuestionsProductResponse,
} from "@/types/api.types";

const STUDENT = {
  // GET /v1/courses/recommended
  getRecommendedCourses: (page = 1) =>
    api.get<PaginatedCoursesResponse>(`/v1/courses/recommended?page=${page}`),

  // GET /v1/courses?search=&category=&content_type=
  browseCourses: (params?: {
    search?: string;
    category?: string;
    contentTypes?: string[];
    officialOnly?: boolean;
    page?: number;
  }) => {
    const q = new URLSearchParams();
    if (params?.search) q.set("search", params.search);
    if (params?.category) q.set("category", params.category);
    for (const t of params?.contentTypes ?? []) q.append("content_type", t);
    if (params?.officialOnly) q.set("official_only", "true");
    if (params?.page) q.set("page", String(params.page));
    return api.get<PaginatedCoursesResponse>(`/v1/courses?${q.toString()}`);
  },

  // GET /v1/courses/:id
  getCourse: (courseId: string) =>
    api.get<CourseDetailResponse>(`/v1/courses/${courseId}`),

  // GET /v1/courses/:courseId/lessons/:lessonId — 403 if not enrolled/subscribed and not a preview lesson
  getLessonContent: (courseId: string, lessonId: string) =>
    api.get<LessonContentResponse>(`/v1/courses/${courseId}/lessons/${lessonId}`),

  // POST /v1/courses/:courseId/lessons/:lessonId/progress
  updateLessonProgress: (
    courseId: string,
    lessonId: string,
    body: { completed?: boolean; last_position_seconds?: number }
  ) =>
    api.post<LessonProgressResponse>(
      `/v1/courses/${courseId}/lessons/${lessonId}/progress`,
      body,
      true
    ),

  // GET /v1/enrollments
  getEnrollments: (page = 1) =>
    api.get<PaginatedEnrollmentsResponse>(`/v1/enrollments?page=${page}`),

  // POST /v1/enrollments
  enroll: (courseId: string) =>
    api.post<EnrollmentResponse>("/v1/enrollments", { course_id: courseId }, true),

  // POST /v1/payments/initiate — buy a paid course via MTN MoMo / Orange Money
  initiatePayment: (body: {
    course_id: string;
    phone: string;
    medium?: "mobile money" | "orange money";
  }) => api.post<PaymentResponse>("/v1/payments/initiate", body, true),

  // GET /v1/payments/past-questions-products
  getPastQuestionsProducts: () =>
    api.get<PastQuestionsProductResponse[]>("/v1/payments/past-questions-products"),

  // POST /v1/payments/initiate-past-questions — buy a Past Questions subject bundle
  initiatePastQuestionsPayment: (body: {
    product_code: string;
    course_ids: string[];
    phone: string;
    medium?: "mobile money" | "orange money";
  }) => api.post<PaymentResponse>("/v1/payments/initiate-past-questions", body, true),

  // GET /v1/courses?official_only=true — browse admin-authored Past Questions subjects
  getPastQuestionsCourses: (page = 1) =>
    api.get<PaginatedCoursesResponse>(`/v1/courses?official_only=true&page=${page}&page_size=100`),

  // POST /v1/courses/:courseId/save — bookmark a course
  saveCourse: (courseId: string) =>
    api.post<SavedCourseResponse>(`/v1/courses/${courseId}/save`, {}, true),

  // DELETE /v1/courses/:courseId/save — remove bookmark
  unsaveCourse: (courseId: string) =>
    api.delete<SavedCourseResponse>(`/v1/courses/${courseId}/save`, true),

  // GET /v1/students/me/saved-courses
  getSavedCourses: (page = 1) =>
    api.get<PaginatedCoursesResponse>(`/v1/students/me/saved-courses?page=${page}`),

  // GET /v1/ai/gamification — streak, XP
  getGamification: () =>
    api.get<GamificationResponse>("/v1/ai/gamification"),

  // GET /v1/ai/gamification/weekly-activity — XP earned per day, last N days (7=weekly, 30=monthly)
  getWeeklyActivity: (days = 7) =>
    api.get<WeeklyActivityResponse>(`/v1/ai/gamification/weekly-activity?days=${days}`),

  // GET /v1/students/me/badges — computed achievement flags
  getBadges: () =>
    api.get<BadgesResponse>("/v1/students/me/badges"),

  // GET /v1/students/me/recently-viewed — courses with progress, most recent first
  getRecentlyViewed: () =>
    api.get<RecentlyViewedResponse>("/v1/students/me/recently-viewed"),

  // GET /v1/students/me
  getProfile: () =>
    api.get<StudentProfileResponse>("/v1/students/me"),

  // POST /v1/students/me/onboarding — sets onboarding_completed = true
  completeOnboarding: (body: { interests: string[]; goals: string[] }) =>
    api.post<StudentProfileResponse>("/v1/students/me/onboarding", body, true),

  // GET /v1/subscriptions/me
  getSubscriptions: () =>
    api.get<MySubscriptionsResponse>("/v1/subscriptions/me"),

  // GET /v1/subscriptions/products
  getProducts: () =>
    api.get<ProductResponse[]>("/v1/subscriptions/products"),

  // GET /v1/students/me/notifications — email/study-reminder/digest prefs
  getNotificationPrefs: () =>
    api.get<NotificationPrefsResponse>("/v1/students/me/notifications"),

  // PATCH /v1/students/me/notifications
  updateNotificationPrefs: (body: {
    email_alerts?: boolean;
    study_reminders?: boolean;
    weekly_digest?: boolean;
  }) => api.patch<NotificationPrefsResponse>("/v1/students/me/notifications", body, true),

  // GET /v1/payments — billing history
  getPayments: (page = 1) =>
    api.get<PaginatedPaymentsResponse>(`/v1/payments?page=${page}`),

  // GET /v1/payments/:id — poll while waiting for the Fapshi webhook to land
  getPayment: (id: string) => api.get<PaymentResponse>(`/v1/payments/${id}`),

  // POST /v1/subscriptions/purchase — buy an AI session product via MTN MoMo / Orange Money
  purchaseSubscription: (body: {
    product_code: string;
    phone?: string;
    medium?: "mobile money" | "orange money";
    /** "link" returns a hosted Fapshi page; "direct" pushes USSD to the phone
     *  but needs direct-pay activated on the Fapshi account. */
    method?: "direct" | "link";
  }) => api.post<SubscriptionPaymentResponse>("/v1/subscriptions/purchase", body, true),

  // GET /v1/notifications — the in-app notification feed
  getNotifications: (page = 1) =>
    api.get<PaginatedNotificationsResponse>(`/v1/notifications?page=${page}`),

  // PATCH /v1/notifications/:id/read
  markNotificationRead: (id: string) =>
    api.patch<NotificationItem>(`/v1/notifications/${id}/read`, {}, true),

  // POST /v1/notifications/mark-all-read
  markAllNotificationsRead: () =>
    api.post<MarkAllReadResponse>("/v1/notifications/mark-all-read", {}, true),
};

export default STUDENT;