export interface CourseListItem {
    id: string;
    tutor_id: string;
    tutor_name: string | null;
    tutor_avatar_url: string | null;
    title: string;
    description: string | null;
    category: string;
    language: CourseLanguage;
    price: number;
    is_premium: boolean;
    thumbnail_url: string | null;
    tags: string[];
    avg_rating: number | null;
    review_count: number;
    total_lessons: number;
    status: string;
    created_at: string;
    updated_at: string;
    is_saved: boolean;
    has_video: boolean;
  }

  export interface SavedCourseResponse {
    course_id: string;
    is_saved: boolean;
  }

  export interface PaginatedCoursesResponse {
    items: CourseListItem[];
    total: number;
    page: number;
    page_size: number;
  }
  
  export interface ModuleLesson {
    id: string;
    title: string;
    type: "video" | "pdf" | "quiz";
    order: number;
    duration_seconds: number | null;
    is_preview: boolean;
    description?: string | null;
    /** Two-page sample of the first PDF lesson. Null on every other lesson. */
    preview_url?: string | null;
  }
  
  export interface CourseModule {
    id: string;
    title: string;
    order: number;
    lessons: ModuleLesson[];
  }
  
  export interface CourseDetailResponse extends CourseListItem {
    modules: CourseModule[];
  }

  export interface LessonContentResponse {
    id: string;
    title: string;
    type: "video" | "pdf" | "quiz";
    order: number;
    duration_seconds: number | null;
    content_url: string | null;
    description: string | null;
    is_preview: boolean;
    stream_uid: string | null;
    transcript_status: "none" | "pending" | "ready" | "failed";
    caption_url_en: string | null;
    caption_url_fr: string | null;
  }

  export interface LessonProgressResponse {
    lesson_id: string;
    completed: boolean;
    last_position_seconds: number;
    completed_at: string | null;
  }

  export interface EnrolledCourseItem {
    id: string;
    course_id: string;
    status: string;
    enrolled_at: string;
    expires_at: string | null;
    course_title: string;
    course_thumbnail: string | null;
    course_total_lessons: number;
  }
  
  export interface PaginatedEnrollmentsResponse {
    items: EnrolledCourseItem[];
    total: number;
    page: number;
    page_size: number;
  }
  
  export interface EnrollmentResponse {
    id: string;
    course_id: string;
    status: string;
    enrolled_at: string;
    expires_at: string | null;
  }
  
  export interface GamificationResponse {
    total_xp: number;
    current_streak_days: number;
    longest_streak_days: number;
    last_activity_date: string | null;
  }
  
  export interface StudentProfileResponse {
    id: string;
    user_id: string;
    interests: string[];
    goals: string[];
    onboarding_completed: boolean;
    updated_at: string;
  }
  
  export interface MySubscriptionsResponse {
    can_start_ai_session: boolean;
    entitlements: EntitlementResponse[];
  }
  
  export interface EntitlementResponse {
    id: string;
    type: string;
    product_code: string;
    sessions_remaining: number | null;
    sessions_total: number | null;
    expires_at: string | null;
    daily_session_cap: number | null;
    created_at: string;
  }
  
  // Admin types
  export interface AdminStatsResponse {
    courses: { draft: number; pending_review: number; published: number; rejected: number; total: number };
    tutors: { total: number; verified: number; pending_verification: number };
    students: { total: number; active_enrollments: number };
  }
  
  export interface AdminCourseListItem {
    id: string;
    title: string;
    description: string | null;
    category: string;
    price: number;
    is_premium: boolean;
    thumbnail_url: string | null;
    status: string;
    tags: string[];
    avg_rating: number | null;
    review_count: number;
    total_lessons: number;
    tutor_name: string | null;
    created_at: string;
    updated_at: string;
  }
  
  export interface AdminCoursesResponse {
    items: AdminCourseListItem[];
    total: number;
    page: number;
    page_size: number;
  }
  
  export interface AdminUserResponse {
    id: string;
    email: string;
    full_name: string;
    role: string | null;
    is_active: boolean;
    created_at: string;
  }
  
  export interface UserListResponse {
    items: AdminUserResponse[];
    total: number;
    page: number;
    page_size: number;
  }
  
  export interface AdminStudentListItem {
    id: string;
    email: string;
    full_name: string;
    avatar_url: string | null;
    is_active: boolean;
    enrollment_count: number;
    created_at: string;
  }
  
  export interface AdminStudentListResponse {
    items: AdminStudentListItem[];
    total: number;
    page: number;
    page_size: number;
  }

  export interface AdminPaymentStatsResponse {
    platform_revenue: number;
    total_processed: number;
    pending_payouts: number;
    paid_out: number;
    successful_count: number;
    pending_count: number;
    failed_count: number;
  }

  export interface RevenueTrendPoint {
    label: string;
    value: number;
  }

  export interface AdminRevenueTrendResponse {
    points: RevenueTrendPoint[];
  }

  export interface AdminTransactionItem {
    id: string;
    party: string;
    type: "revenue" | "payout";
    description: string;
    amount: number;
    status: string;
    created_at: string;
  }

  export interface AdminTransactionsResponse {
    items: AdminTransactionItem[];
    total: number;
    page: number;
    page_size: number;
  }
  
  export interface AdminTutorListItem {
    id: string;
    email: string;
    full_name: string;
    avatar_url: string | null;
    is_active: boolean;
    is_verified: boolean;
    subject: string | null;
    city: string | null;
    student_count: number;
    created_at: string;
  }
  
  export interface AdminLessonBrief {
    id: string;
    title: string;
    type: "video" | "pdf" | "quiz";
    order: number;
    duration_seconds: number | null;
    is_preview: boolean;
  }

  export interface AdminCourseModule {
    id: string;
    title: string;
    order: number;
    lessons: AdminLessonBrief[];
  }

  export interface AdminCourseInstructor {
    user_id: string;
    full_name: string;
    avatar_url: string | null;
    is_verified: boolean;
    subject: string | null;
    bio: string | null;
  }

  /** GET /v1/admin/courses/{id} — the full course, for the approval decision. */
  export interface AdminCourseDetail {
    id: string;
    title: string;
    description: string | null;
    category: string;
    language: CourseLanguage;
    price: number;
    is_premium: boolean;
    thumbnail_url: string | null;
    status: "draft" | "pending_review" | "published" | "rejected";
    rejection_reason: string | null;
    tags: string[];
    avg_rating: number | null;
    review_count: number;
    total_lessons: number;
    modules: AdminCourseModule[];
    instructor: AdminCourseInstructor;
    created_at: string;
    updated_at: string;
  }

  export interface AdminTutorCourse {
    id: string;
    title: string;
    status: "draft" | "pending_review" | "published" | "rejected";
    price: number;
    total_lessons: number;
    enrollment_count: number;
    created_at: string;
  }

  /** GET /v1/admin/tutors/{id} — everything needed to decide on verification. */
  export interface AdminTutorDetail {
    id: string;
    email: string;
    full_name: string;
    avatar_url: string | null;
    is_active: boolean;
    created_at: string;
    is_verified: boolean;
    profile_completed: boolean;
    display_name: string | null;
    title: string | null;
    phone: string | null;
    city: string | null;
    subject: string | null;
    teaching_level: string | null;
    experience_years: string | null;
    bio: string | null;
    student_count: number;
    course_count: number;
    published_course_count: number;
    courses: AdminTutorCourse[];
  }

  export interface AdminTutorListResponse {
    items: AdminTutorListItem[];
    total: number;
    page: number;
    page_size: number;
  }

  export interface DailyActivityItem {
    activity_date: string;
    weekday: string;
    xp_earned: number;
    active: boolean;
  }

  export interface WeeklyActivityResponse {
    days: DailyActivityItem[];
  }

  export interface BadgeItem {
    id: string;
    label: string;
    description: string;
    achieved: boolean;
  }

  export interface BadgesResponse {
    badges: BadgeItem[];
  }

  export interface RecentlyViewedItem {
    course_id: string;
    course_title: string;
    course_thumbnail: string | null;
    total_lessons: number;
    completed_lessons: number;
    remaining_seconds: number;
    last_viewed_at: string;
  }

  export interface RecentlyViewedResponse {
    items: RecentlyViewedItem[];
  }

  export interface NotificationPrefsResponse {
    user_id: string;
    email_alerts: boolean;
    study_reminders: boolean;
    weekly_digest: boolean;
  }

  export interface NotificationItem {
    id: string;
    type: "payment_successful" | "payment_failed";
    title: string;
    message: string;
    related_payment_id: string | null;
    is_read: boolean;
    created_at: string;
  }

  export interface PaginatedNotificationsResponse {
    items: NotificationItem[];
    total: number;
    unread_count: number;
    page: number;
    page_size: number;
  }

  export interface MarkAllReadResponse {
    marked_read: number;
  }

  export interface ProductResponse {
    code: string;
    name: string;
    description: string;
    price_xaf: number;
    entitlement_type: string;
    sessions: number | null;
    duration_days: number | null;
    daily_session_cap: number | null;
  }

  export interface PaymentListItem {
    id: string;
    course_id: string | null;
    product_code: string | null;
    payment_type: "course" | "subscription";
    fapshi_trans_id: string;
    amount: number;
    phone: string | null;
    medium: string | null;
    status: "pending" | "successful" | "failed" | "expired";
    webhook_received_at: string | null;
    created_at: string;
    course_title: string | null;
    product_name: string | null;
  }

  export interface PaginatedPaymentsResponse {
    items: PaymentListItem[];
    total: number;
    page: number;
    page_size: number;
  }

  // ── AI Tutor ──────────────────────────────────────────────────────────────

  export interface AISessionResponse {
    id: string;
    lesson_id: string | null;
    session_type: "lesson" | "general";
    status: "active" | "paused" | "expired" | "ended";
    started_at: string;
    expires_at: string;
    message_count: number;
    created_at: string;
  /** Set while paused. Freeze the countdown when present. */
  paused_at?: string | null;
}

  export type AISessionListItem = AISessionResponse;

  export interface AIAttachmentResponse {
    id: string;
    filename: string;
    content_type: string;
    file_url: string;
    created_at: string;
  }

  export interface AIMessageResponse {
    id: string;
    role: "user" | "assistant";
    content: string;
    model_used: string | null;
    input_tokens: number | null;
    output_tokens: number | null;
    attachments: AIAttachmentResponse[];
    created_at: string;
  }

  export interface SendMessageResponse {
    user_message: AIMessageResponse;
    assistant_message: AIMessageResponse;
  }

  export interface AISessionDetailResponse extends AISessionResponse {
    messages: AIMessageResponse[];
  }

  export interface AttachmentUploadResponse {
    attachment_id: string;
    upload_url: string;
    file_url: string;
  }

  export interface RevisionResponse {
    id: string;
    content: string;
    model_used: string;
    created_at: string;
  }

  export interface QuizQuestionPublic {
    question_id: string;
    order: number;
    prompt: string;
    options: string[];
  }

  export interface QuizResponse {
    quiz_id: string;
    num_questions: number;
    questions: QuizQuestionPublic[];
  }

  export interface QuizAnswerItem {
    question_id: string;
    selected_index: number;
  }

  export interface QuizGradedQuestion {
    question_id: string;
    selected_index: number;
    correct_index: number;
    is_correct: boolean;
    explanation: string;
  }

  export interface QuizAttemptResponse {
    attempt_id: string;
    score: number;
    total: number;
    results: QuizGradedQuestion[];
  }

  export interface StudyPlanResponse {
    id: string;
    content: string;
    model_used: string;
    created_at: string;
  }

  export interface SuggestedTopicsResponse {
    topics: string[];
  }

  export interface SessionSummaryRevision {
    id: string;
    content: string;
    created_at: string;
  }

  export interface SessionSummaryQuiz {
    quiz_id: string;
    num_questions: number;
    created_at: string;
    taken: boolean;
    best_score: number | null;
    best_total: number | null;
    attempt_count: number;
    latest_attempt_at: string | null;
  }

  export interface SessionSummaryStudyPlan {
    id: string;
    created_at: string;
  }

  export interface SubscriptionPaymentResponse {
    id: string;
    product_code: string | null;
    fapshi_trans_id: string;
    amount: number;
    status: "pending" | "successful" | "failed" | "expired";
    created_at: string;
  /** Hosted checkout URL — set only when method was "link". */
  payment_link?: string | null;
}

  export interface PaymentResponse {
    id: string;
    course_id: string | null;
    product_code: string | null;
    payment_type: "course" | "subscription" | "past_questions_bundle";
    fapshi_trans_id: string;
    amount: number;
    phone: string | null;
    medium: string | null;
    status: "pending" | "successful" | "failed" | "expired";
    bundle_course_ids: string[] | null;
    webhook_received_at: string | null;
    created_at: string;
  }

  export interface PastQuestionsProductResponse {
    code: string;
    name: string;
    description: string;
    price_xaf: number;
    subject_count: number | null;
  }

  export interface SessionSummaryResponse {
    session_id: string;
    session_type: "lesson" | "general";
    status: "active" | "paused" | "expired" | "ended";
    lesson_id: string | null;
    lesson_title: string | null;
    started_at: string;
    expires_at: string;
    message_count: number;
    revisions: SessionSummaryRevision[];
    quizzes: SessionSummaryQuiz[];
    study_plans: SessionSummaryStudyPlan[];
    xp_earned: number;
  }

  // ── Tutor ─────────────────────────────────────────────────────────────────

  export type ExperienceYears = "1-3" | "4-7" | "8+";

  export interface TutorProfileResponse {
    id: string;
    user_id: string;
    display_name: string | null;
    title: string | null;
    phone: string | null;
    city: string | null;
    subject: string | null;
    teaching_level: string | null;
    experience_years: ExperienceYears | null;
    bio: string | null;
    is_verified: boolean;
    profile_completed: boolean;
    avatar_url: string | null;
    updated_at: string;
  }

  export interface UpdateTutorProfileRequest {
    display_name?: string;
    title?: string;
    phone?: string;
    city?: string;
    subject?: string;
    teaching_level?: string;
    experience_years?: ExperienceYears;
    bio?: string;
    profile_completed?: boolean;
    avatar_url?: string;
  }

  export interface PublicTutorResponse {
    user_id: string;
    display_name: string | null;
    title: string | null;
    subject: string | null;
    teaching_level: string | null;
    experience_years: ExperienceYears | null;
    bio: string | null;
    is_verified: boolean;
    avatar_url: string | null;
  }

  export interface PayoutDetailsResponse {
    user_id: string;
    mtn_number: string | null;
    orange_money_number: string | null;
    updated_at: string;
  }

  export interface TutorNotificationPrefsResponse {
    user_id: string;
    email_notifications: boolean;
    push_alerts: boolean;
    marketing_tips: boolean;
  }

  export type CourseLanguage = "en" | "fr" | "bilingual";

  export interface CreateCourseRequest {
    title: string;
    description?: string | null;
    category: string;
    language?: CourseLanguage;
    price: number;
    is_premium?: boolean;
    thumbnail_url?: string | null;
    tags?: string[];
  }

  export interface UpdateCourseRequest {
    title?: string;
    description?: string | null;
    category?: string;
    language?: CourseLanguage;
    price?: number;
    is_premium?: boolean;
    thumbnail_url?: string | null;
    tags?: string[];
  }

  export interface CreateModuleRequest {
    title: string;
    order: number;
  }

  export interface CreateLessonRequest {
    title: string;
    type: "video" | "pdf" | "quiz";
    order: number;
    duration_seconds?: number | null;
    content_url?: string | null;
    description?: string | null;
    is_preview?: boolean;
    stream_uid?: string | null;
  }

  export interface UpdateLessonRequest {
    title?: string;
    type?: "video" | "pdf" | "quiz";
    order?: number;
    duration_seconds?: number | null;
    content_url?: string | null;
    description?: string | null;
    is_preview?: boolean;
    stream_uid?: string | null;
  }

  export interface EarningItem {
    id: string;
    course_id: string;
    payment_id: string;
    gross_amount: number;
    platform_fee: number;
    net_amount: number;
    status: "pending" | "paid_out";
    created_at: string;
  }

  export interface PaginatedEarningsResponse {
    items: EarningItem[];
    total: number;
    page: number;
    page_size: number;
  }

  export interface EarningsSummaryResponse {
    total_earned: number;
    pending_balance: number;
    total_paid_out: number;
  }

  export interface PayoutItem {
    id: string;
    fapshi_trans_id: string;
    amount: number;
    phone: string;
    medium: string | null;
    status: "pending" | "successful" | "failed";
    created_at: string;
    updated_at: string;
  }

  export interface PaginatedPayoutsResponse {
    items: PayoutItem[];
    total: number;
    page: number;
    page_size: number;
  }

  export interface VideoUploadResponse {
    upload_url: string;
    stream_uid: string;
    hls_url: string;
    thumbnail_url: string | null;
  }

  export interface VideoStatusResponse {
    stream_uid: string;
    state: string;
    duration_seconds: number | null;
    thumbnail_url: string | null;
  }

  export interface AssetUploadResponse {
    upload_url: string;
    file_url: string;
  }
export interface RevenueSummary {
  this_month: number;
  last_month: number;
  /** Null when last month was zero — growth from nothing is not a percentage. */
  change_pct: number | null;
  all_time: number;
}

export interface MoneyFlow {
  platform_earned: number;
  tutor_net: number;
  pending_payouts: number;
  paid_out: number;
}

export interface RevenueBySource {
  source: string;
  label: string;
  amount: number;
  count: number;
}

export interface PaymentHealth {
  medium: string;
  successful: number;
  failed: number;
  success_rate: number;
}

export interface CoursePerformance {
  id: string;
  title: string;
  tutor_name: string | null;
  price: number;
  students: number;
  revenue: number;
}

export interface AdminAnalyticsResponse {
  revenue: RevenueSummary;
  flow: MoneyFlow;
  by_source: RevenueBySource[];
  by_medium: PaymentHealth[];
  top_courses: CoursePerformance[];
  currency: string;
}

export interface CourseSalesPoint {
  date: string;
  revenue: number;
  sales: number;
}

export interface CourseSalesReport {
  course_id: string;
  title: string;
  tutor_name: string | null;
  price: number;
  currency: string;
  total_revenue: number;
  total_sales: number;
  /** Can exceed total_sales: bundle buyers enrol without a per-course payment. */
  total_enrollments: number;
  points: CourseSalesPoint[];
}
