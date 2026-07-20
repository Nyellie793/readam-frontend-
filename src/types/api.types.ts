export interface CourseListItem {
    id: string;
    tutor_id: string;
    tutor_name: string | null;
    tutor_avatar_url: string | null;
    title: string;
    description: string | null;
    category: string;
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
  
  export interface AdminTutorListResponse {
    items: AdminTutorListItem[];
    total: number;
    page: number;
    page_size: number;
  }