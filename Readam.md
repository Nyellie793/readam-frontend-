# ReadAM Frontend — Project Documentation

> **Last updated:** July 2026  
> **Stack:** Next.js 16.2.7 (App Router, Turbopack) · React 19 · TypeScript · Tailwind CSS v4 · shadcn/ui · Lucide React  
> **Backend:** FastAPI on Railway — `https://web-production-0dce.up.railway.app`  
> **Repo:** https://github.com/Nyellie793/readam-frontend-.git

---

## 1. What is ReadAM?

ReadAM is a Cameroonian edtech platform connecting students (primarily secondary and university level) with courses, AI-powered tutoring, and a structured learning environment. The platform supports two user roles:

- **Student** — browses and enrolls in courses, uses an AI tutor, tracks progress, manages their account
- **Admin** — manages the platform: reviews and approves courses, verifies tutors, monitors students and payments

The frontend is a Next.js single-page application that authenticates against a live FastAPI backend, stores the session in `localStorage` + cookies (for middleware), and renders role-specific dashboards.

---

## 2. How Authentication Works

```
User visits /login or /signup
        │
        ▼
POST /v1/auth/register  (signup)
POST /v1/auth/login     (login)
        │
        ▼
API returns { user, tokens: { access_token, refresh_token } }
        │
        ▼
saveSession() stores:
  localStorage["readam_access_token"]
  localStorage["readam_refresh_token"]
  localStorage["readam_user"]
  cookie: readam_auth=1
  cookie: readam_role=student|tutor|admin
        │
        ▼
Next.js middleware reads cookies → redirects to /dashboard (student)
                                              or /admin (admin)
```

**Key files:**
- `src/lib/auth.ts` — `saveSession`, `getStoredUser`, `clearSession`, `logout`
- `src/lib/constants.ts` — `TOKEN_KEY`, `USER_KEY`, `API_BASE_URL`, `ROUTES`
- `src/hooks/use-auth.ts` — `useAuth()` hook wrapping login/register/logout with toast feedback
- `src/services/auth.service.ts` — raw API calls: `register`, `login`, `setRole`, `me`, `refresh`, `google`

**Role assignment flow (new users):**
```
POST /v1/auth/register → POST /v1/auth/role (student|tutor) → /onboarding-1 → /onboarding-2 → /welcome-back → /dashboard
```

**Token usage:** Every authenticated API call adds `Authorization: Bearer <token>` via `src/lib/api.ts`. The `api` object exposes `get`, `post`, `patch`, `delete` — pass `auth = true` (default for most calls) to attach the token.

---

## 3. Route Map

### Public Routes
| Route | Description |
|-------|-------------|
| `/` | Landing page (Hero, Features, Subjects, Pricing, Testimonials, etc.) |
| `/login` | Student/tutor login form |
| `/signup` | Registration form |
| `/select-role` | Pick student or tutor after account creation |
| `/onboarding-1` | Choose interests |
| `/onboarding-2` | Set learning goals |
| `/welcome-back` | Post-login splash screen |
| `/about` | About page (stub) |
| `/register` | Alternate register route |

### Student Dashboard Routes (all under `/dashboard`)
| Route | Status | Description |
|-------|--------|-------------|
| `/dashboard` | ✅ Built | Home — study progress, weekly activity, recommended + recently viewed courses |
| `/dashboard/courses` | ✅ Built | Course browser with filters sidebar |
| `/dashboard/courses/[courseId]` | ✅ Built | Individual course viewer (video player, PDF viewer, course outline) |
| `/dashboard/ai-tutor/ai-hub` | ✅ Built | AI Hub — feature cards, suggestions, promo banner, learning streak |
| `/dashboard/ai-tutor/ai-chat` | ✅ Built | AI Chat session — live message thread, session summary panel |
| `/dashboard/notifications` | ✅ Built (UI only) | Grouped notification feed — Today, Yesterday, Older |
| `/dashboard/settings` | 🔧 Partial | Settings page scaffold — sections created but sub-components missing |
| `/dashboard/payments` | ❌ Not built | Payments page not yet created |

### Admin Routes (all under `/admin`)
| Route | Status | Description |
|-------|--------|-------------|
| `/admin/login` | ✅ Built | Admin-specific login |
| `/admin` | ✅ Built | Dashboard overview — live stats, pending course approvals |
| `/admin/courses` | ✅ Built | Course list with approve/reject actions |
| `/admin/users` | ✅ Built | User management table |
| `/admin/tutors` | ✅ Built | Tutor management with verify/unverify |
| `/admin/payments` | ✅ Built | Payment/transaction table |
| `/admin/analytics` | ✅ Built | Analytics view |
| `/admin/settings` | ✅ Built | Admin settings page |

---

## 4. Project & File Structure

```
readam-frontend/
├── src/
│   ├── app/                          # Next.js App Router pages
│   │   ├── layout.tsx                # Root layout — fonts, Toaster, NetworkProvider
│   │   ├── globals.css               # Tailwind base + CSS variables
│   │   ├── page.tsx                  # Landing page (/)
│   │   │
│   │   ├── login/                    # /login
│   │   ├── signup/                   # /signup
│   │   ├── register/                 # /register
│   │   ├── select-role/              # /select-role
│   │   ├── onboarding-1/             # /onboarding-1
│   │   ├── onboarding-2/             # /onboarding-2
│   │   ├── welcome-back/             # /welcome-back
│   │   ├── about/                    # /about
│   │   │
│   │   ├── dashboard/
│   │   │   ├── layout.tsx            # Shared sidebar + bg for all /dashboard/* routes
│   │   │   ├── page.tsx              # /dashboard home
│   │   │   ├── courses/
│   │   │   │   ├── page.tsx          # /dashboard/courses
│   │   │   │   └── [courseId]/
│   │   │   │       └── page.tsx      # /dashboard/courses/:id
│   │   │   ├── ai-tutor/
│   │   │   │   ├── ai-hub/
│   │   │   │   │   └── page.tsx      # /dashboard/ai-tutor/ai-hub
│   │   │   │   └── ai-chat/
│   │   │   │       └── page.tsx      # /dashboard/ai-tutor/ai-chat
│   │   │   ├── notifications/
│   │   │   │   └── page.tsx          # /dashboard/notifications
│   │   │   └── settings/
│   │   │       └── page.tsx          # /dashboard/settings (partial)
│   │   │
│   │   └── admin/
│   │       ├── layout.tsx            # Admin layout with its own sidebar
│   │       ├── page.tsx              # /admin dashboard
│   │       ├── login/
│   │       ├── courses/
│   │       ├── users/
│   │       ├── tutors/
│   │       ├── payments/
│   │       ├── analytics/
│   │       └── settings/
│   │
│   ├── components/
│   │   ├── admin/                    # Admin-specific UI
│   │   │   ├── Sidebar.tsx
│   │   │   ├── Topbar.tsx
│   │   │   ├── StatCards.tsx
│   │   │   ├── Chart.tsx
│   │   │   ├── DataTable.tsx
│   │   │   └── tables/               # CoursesTable, StudentsTable, TutorsTable, TransactionsTable
│   │   │
│   │   ├── auth/                     # Login/register UI
│   │   │   ├── LoginForm.tsx
│   │   │   ├── SignupForm.tsx
│   │   │   ├── LogoutButton.tsx
│   │   │   ├── AuthLayout.tsx
│   │   │   ├── AuthNavbar.tsx
│   │   │   └── UserDropdown.tsx
│   │   │
│   │   ├── dashboard/                # Student dashboard UI
│   │   │   ├── Sidebar.tsx           # ← PRIMARY NAV (student) — renders sub-nav for AI Tutor
│   │   │   ├── DashboardNavigation.tsx  # Routes between Sidebar and CourseFilters
│   │   │   ├── DashboardHeader.tsx   # Desktop header + mobile top bar with drawer
│   │   │   ├── DashboardMobileSidebar.tsx
│   │   │   ├── DashboardSearch.tsx
│   │   │   ├── DashboardGreeting.tsx # Time-based greeting with user name
│   │   │   ├── DashboardActions.tsx  # Bell + AI + avatar icons
│   │   │   ├── StudyProgress.tsx     # 3 stat cards
│   │   │   ├── WeeklyActivity.tsx    # Bar chart of daily study minutes
│   │   │   ├── RecommendedCourses.tsx
│   │   │   ├── RecentlyViewed.tsx
│   │   │   ├── DailyStreak.tsx
│   │   │   ├── ReadAmTutorBannerDashboard.tsx
│   │   │   │
│   │   │   ├── courses/              # Course browser + viewer components
│   │   │   │   ├── CourseFilters.tsx
│   │   │   │   ├── CourseCard.tsx
│   │   │   │   ├── CourseOutline.tsx
│   │   │   │   ├── VideoPlayer.tsx
│   │   │   │   ├── PDFViewer.tsx
│   │   │   │   └── CourseTopbar.tsx
│   │   │   │
│   │   │   ├── ai-hub/               # AI Hub page components
│   │   │   │   ├── AiHubHeader.tsx   # Greeting, badge, icon actions
│   │   │   │   ├── AiHubSuggestions.tsx  # "Suggested for you" pills
│   │   │   │   ├── AiHubFeatureCards.tsx # 4-card grid (Quick Revision etc.)
│   │   │   │   ├── AiHubBanner.tsx   # Blue gradient promo banner
│   │   │   │   └── AiHubLearningStreak.tsx # XP, streak, day dots, Claim Reward
│   │   │   │
│   │   │   ├── ai-chat/              # AI Chat session components
│   │   │   │   └── AiChatSession.tsx # Full chat UI: messages, input, session summary panel
│   │   │   │
│   │   │   ├── notifications/        # Notifications page components
│   │   │   │   ├── NotificationsSearch.tsx  # Sticky search bar + bell + avatar
│   │   │   │   ├── NotificationsHeader.tsx  # Title + "Mark all as read" + settings icon
│   │   │   │   └── NotificationsFeed.tsx    # Today / Yesterday / Older sections
│   │   │   │
│   │   │   └── settings/             # Settings page components (⚠️ incomplete — see §6)
│   │   │       └── [missing sub-components]
│   │   │
│   │   ├── layout/                   # Public landing page layout
│   │   │   ├── Navbar.tsx
│   │   │   ├── Footer.tsx
│   │   │   ├── MobileMenu.tsx
│   │   │   └── Sidebar.tsx
│   │   │
│   │   ├── sections/                 # Landing page sections
│   │   │   ├── Hero.tsx
│   │   │   ├── Features.tsx
│   │   │   ├── Subjects.jsx
│   │   │   ├── Pricing.tsx
│   │   │   ├── Testimonials.tsx
│   │   │   ├── Banner.tsx
│   │   │   ├── Stats.tsx
│   │   │   ├── Tutors.tsx
│   │   │   ├── Videos.tsx
│   │   │   └── Newsletter.tsx
│   │   │
│   │   ├── onboarding/               # Onboarding wizard steps
│   │   │   ├── OnboardingShell.tsx
│   │   │   ├── Welcome.tsx
│   │   │   ├── Goal.tsx
│   │   │   └── Interests.tsx
│   │   │
│   │   ├── shared/                   # Cross-cutting reusables
│   │   │   ├── Logo.tsx
│   │   │   ├── NetworkProvider.tsx   # Online/offline banner
│   │   │   ├── LoadingTimeout.tsx
│   │   │   ├── BackToTop.tsx
│   │   │   ├── LanguageToggle.tsx
│   │   │   └── ThemeToggle.tsx
│   │   │
│   │   ├── skeletons/                # Loading skeleton screens
│   │   │   └── [12 skeleton components]
│   │   │
│   │   └── ui/                       # shadcn/ui primitives
│   │       ├── avatar.tsx
│   │       ├── button.tsx
│   │       ├── dialog.tsx
│   │       ├── dropdown-menu.tsx
│   │       ├── progress.tsx
│   │       ├── sheet.tsx
│   │       ├── skeleton.tsx
│   │       ├── sonner.tsx            # Toast notifications
│   │       ├── Badge.tsx
│   │       ├── Card.tsx
│   │       └── Input.tsx
│   │
│   ├── constants/
│   │   ├── student-nav.ts            # STUDENT_NAV + AI_TUTOR_SUB_NAV arrays
│   │   ├── admin-nav.ts              # Admin sidebar nav items
│   │   ├── branding.ts               # BRAND.name, BRAND.primary, BRAND.accent
│   │   ├── navigation.ts             # Public site nav links
│   │   ├── pricing.ts                # Pricing plan data
│   │   └── languages.ts              # Available language options
│   │
│   ├── data/                         # Static mock/seed data (swap for API when ready)
│   │   ├── student-mock.ts           # STUDY_STATS, WEEKLY_ACTIVITY, RECENTLY_VIEWED, COURSE_OUTLINE
│   │   ├── admin-mock.ts             # Admin table seed data
│   │   ├── courses.ts                # Course list mock
│   │   ├── dashboard.ts              # Dashboard mock
│   │   ├── testimonials.ts
│   │   ├── tutors.ts
│   │   └── videos.ts
│   │
│   ├── hooks/
│   │   ├── use-auth.ts               # useAuth() — login, register, logout
│   │   ├── useDashboard.ts           # Fetches /student/dashboard
│   │   ├── useCurrentUser.ts         # Returns getStoredUser() reactively
│   │   ├── useGreeting.ts            # Time-based greeting string
│   │   ├── useLanguage.ts            # i18n language selection
│   │   ├── useNetworkStatus.ts       # Online/offline detection
│   │   ├── use-mobile.ts             # Breakpoint detection
│   │   └── use-theme.ts              # Theme (light/dark) toggle
│   │
│   ├── i18n/
│   │   ├── config.ts                 # i18next setup
│   │   ├── en.ts                     # English translations
│   │   ├── fr.ts                     # French translations (Cameroon bilingual support)
│   │   ├── index.ts
│   │   └── provider.tsx              # I18nProvider wrapping the app
│   │
│   ├── lib/
│   │   ├── api.ts                    # Fetch wrapper — api.get/post/patch/delete
│   │   ├── auth.ts                   # Session management — saveSession, getStoredUser, clearSession
│   │   ├── constants.ts              # API_BASE_URL, TOKEN_KEY, ROUTES
│   │   └── utils.ts                  # cn() (clsx + tailwind-merge)
│   │
│   ├── services/
│   │   ├── auth.service.ts           # register, login, setRole, me, refresh, google
│   │   ├── student.service.ts        # getRecommendedCourses, browseCourses, getCourse, enroll, getGamification, getProfile, getSubscriptions
│   │   ├── dashboard.service.ts      # getDashboard, getRecommendedCourses, getRecentlyViewed
│   │   └── admin.service.ts          # getStats, getUsers, updateUser, getTutors, verifyTutor, getCourses, approveCourse, rejectCourse, getStudents
│   │
│   └── types/
│       ├── user.types.ts             # User, AuthResponse, LoginPayload, RegisterPayload
│       ├── api.types.ts              # All API response shapes (courses, enrollments, gamification, admin)
│       ├── course.types.ts           # Course, Lesson, CourseModule, ContinueLearningItem
│       └── dashboard.types.ts        # StatCardData, NavItem, DataTableColumn, ChartPoint
```

---

## 5. Core Functions & Functionalities

### 5.1 API Layer — `src/lib/api.ts`
Single `fetch` wrapper. All requests go through this.
```ts
api.get<T>(path, auth?)          // GET — auth=true by default
api.post<T>(path, body, auth?)   // POST — auth=false by default (login/register)
api.patch<T>(path, body, auth?)  // PATCH
api.delete<T>(path, auth?)       // DELETE
```
Throws `ApiRequestError(status, detail)` on non-2xx. Error detail is extracted from the FastAPI `{ detail: string | [{msg}] }` shape.

### 5.2 Auth Session — `src/lib/auth.ts`
| Function | What it does |
|----------|-------------|
| `saveSession(data)` | Stores tokens + user in localStorage, writes role cookies for middleware |
| `getStoredUser()` | Reads `readam_user` from localStorage → returns `User \| null` |
| `updateStoredUser(user)` | Updates stored user without touching tokens |
| `clearSession()` | Wipes localStorage + expires cookies |
| `getToken()` | Returns the access token string |
| `isAuthenticated()` | Boolean — token present |
| `isAdmin(user)` | Checks `user.role` against `ADMIN_ROLES = ["admin"]` |
| `logout()` | Clears cookies + localStorage (direct, no router) |

### 5.3 Student Service — `src/services/student.service.ts`
All authenticated. Used across dashboard and course pages.
| Method | Endpoint | Purpose |
|--------|----------|---------|
| `getRecommendedCourses(page)` | `GET /v1/courses/recommended` | Personalized course suggestions |
| `browseCourses(params)` | `GET /v1/courses?search=&category=` | Course catalogue with filters |
| `getCourse(id)` | `GET /v1/courses/:id` | Full course detail with modules + lessons |
| `getEnrollments(page)` | `GET /v1/enrollments` | Student's enrolled courses |
| `enroll(courseId)` | `POST /v1/enrollments` | Enroll in a course |
| `getGamification()` | `GET /v1/ai/gamification` | Streak, XP, activity dates |
| `getProfile()` | `GET /v1/students/me` | Interests, goals, onboarding status |
| `getSubscriptions()` | `GET /v1/subscriptions/me` | AI session entitlements, plan details |

### 5.4 Navigation — `src/constants/student-nav.ts`
Two arrays drive the sidebar:
- `STUDENT_NAV` — top-level nav items (Home, Explore Courses, AI Tutor, Payments, Settings)
- `AI_TUTOR_SUB_NAV` — expands under AI Tutor when `pathname.startsWith("/dashboard/ai-tutor")`

The `Sidebar` component in `src/components/dashboard/Sidebar.tsx` renders both. `DashboardNavigation.tsx` switches between `Sidebar` and `CourseFilters` based on the current route.

### 5.5 AI Tutor — `/dashboard/ai-tutor/`
**AI Hub** (`ai-hub/page.tsx`) assembles five independent components:
- `AiHubHeader` — reads user name from `getStoredUser()` for personalised greeting
- `AiHubSuggestions` — static suggestion pills that deep-link to `/dashboard/ai-tutor/ai-chat?q=...`
- `AiHubFeatureCards` — four modes: Quick Revision, Adaptive Quiz, Past Questions, Study Plan
- `AiHubBanner` — marketing CTA linking to chat
- `AiHubLearningStreak` — renders streak/XP from **static data** (not yet wired to `getGamification()`)

**AI Chat** (`ai-chat/page.tsx`) renders `AiChatSession`:
- Maintains local `messages` state with seed data for the demo
- Live session timer (`elapsed` counts up every second)
- `sendMessage()` appends user message then fakes a tutor reply after 1.2s
- Right panel: `SessionSummary` shows Core Concept, Method Found, Confidence Level (65%), Next Actions
- **Not yet connected to a real AI backend endpoint**

### 5.6 Notifications — `/dashboard/notifications/`
Fully UI-only. Three components:
- `NotificationsSearch` — sticky top bar with search input, blue bell icon, user avatar
- `NotificationsHeader` — "Mark all as read" + settings gear
- `NotificationsFeed` — Today (2 unread: Assignment Graded, AI Tutor Reminder), Yesterday (Payment Failed, Discussion Reply), Older (System Maintenance, New Course). Uses static mock data. "Load more history" button is wired to expand state but loads nothing yet.

### 5.7 Admin Panel — `/admin/`
Fully connected to the live backend via `admin.service.ts`:
- **Overview (`/admin`)** — `Promise.all([getStats, getCourses(pending)])` on mount, renders live counts + approve/reject queue
- **Users** — paginated user table with role + active status
- **Tutors** — filter by verified/pending, verify/unverify actions
- **Courses** — status filter (pending_review, published, draft, rejected), approve/reject buttons
- **Payments** — transaction table
- **Analytics** — data visualisation

### 5.8 i18n — `src/i18n/`
English and French supported. Keys in `en.ts` and `fr.ts`. `useLanguage()` hook and `LanguageToggle` component allow switching. **Currently only the landing page is fully translated** — dashboard and AI pages are English-only strings.

---

## 6. What Is Left / What Is Incomplete

### 🔴 Missing — not started
| Item | Notes |
|------|-------|
| `/dashboard/payments` | Page does not exist. Nav link in `STUDENT_NAV` points to `/dashboard/payments` but no route or component exists. Needs: payment history table, subscription status, upgrade CTA — similar to the Settings billing section in the design mockup |
| AI Chat real backend | `AiChatSession` simulates tutor replies locally. Needs wiring to a real AI endpoint (likely a streaming API or websocket). The subscription check (`getSubscriptions().can_start_ai_session`) is not enforced on the frontend yet |
| Gamification live data | `AiHubLearningStreak` uses hardcoded XP (1,250) and streak (6 days). Should call `STUDENT.getGamification()` on mount |
| Notifications API | `NotificationsFeed` uses hardcoded mock data. No backend endpoint for notifications exists yet — this requires a backend feature to be built first |

### 🟡 Partial — started but incomplete
| Item | Notes |
|------|-------|
| Settings page | `src/app/dashboard/settings/page.tsx` imports 6 sub-components (`SettingsProfileSection`, `SettingsBillingSection`, `SettingsLanguageSection`, `SettingsPreferencesSection`, `SettingsSecuritySection`, `SettingsSidebarLinks`) that have **not been created yet**. The build will fail if these imports are uncommented. The page needs: profile editing (PATCH user), subscription display (getSubscriptions), language toggle, notification toggles, change password, session logout |
| Dashboard data fetching | `StudyProgress`, `WeeklyActivity`, `RecentlyViewed`, `RecommendedCourses` use data from `student-mock.ts`. They should call `STUDENT.getRecommendedCourses()`, `STUDENT.getEnrollments()`, and `STUDENT.getGamification()` respectively |
| Course enrollment | `CourseCard` UI exists but `STUDENT.enroll()` is not called from any button yet |
| `useDashboard` hook | Calls `getDashboard()` → `GET /student/dashboard` but the response type is `unknown` and the data is never consumed anywhere |
| Onboarding | Steps 1 and 2 exist but whether they correctly persist interests/goals to the API is unverified |
| i18n coverage | Dashboard, AI Tutor, and Settings pages have all strings hardcoded in English — not going through the i18n system |

### 🟢 Cleanup items
| Item | Notes |
|------|-------|
| Stale route files | `src/app/ai-tutor/` (hub and chat) — old pages from an earlier build attempt. Safe to delete. They duplicate `src/app/dashboard/ai-tutor/` |
| `student-nav.ts.bak` | Backup file from a migration. Safe to delete |
| `src/components/ai-tutor/` | Old component folder. Components were moved to `src/components/dashboard/ai-hub/` and `ai-chat/`. Safe to delete after verifying nothing imports from it |
| App metadata | `src/app/layout.tsx` still has `title: "Create Next App"` and default Next.js description — should be updated to ReadAM branding |
| `src/components/dashboard/DashboardSidebar.tsx` | Appears to be a legacy duplicate of `Sidebar.tsx`. Should be reviewed and removed if unused |

---

## 7. Environment & Local Setup

```bash
# 1. Clone
git clone https://github.com/Nyellie793/readam-frontend-.git
cd readam-frontend

# 2. Install
npm install

# 3. Environment (create .env.local)
NEXT_PUBLIC_API_URL=https://web-production-0dce.up.railway.app

# 4. Dev server
npm run dev          # http://localhost:3000

# 5. Build check
npm run build
```

**Windows/PowerShell notes:**
- Use `taskkill /f /im node.exe` before deleting `node_modules` (locked Rolldown binaries)
- Use `Remove-Item -Recurse -Force node_modules` instead of `rm -rf`

---

## 8. Design System Conventions

| Convention | Detail |
|-----------|--------|
| **Primary colour** | `#2563EB` (blue-600) — buttons, active nav, CTAs |
| **Accent colour** | `#F97316` (orange-500) — streaks, rewards, highlights |
| **Background** | `bg-blue-50` for dashboard canvas, `bg-white` for cards |
| **Border radius** | `rounded-xl` (cards), `rounded-2xl` (panels), `rounded-full` (avatars/badges) |
| **Shadows** | `shadow-sm` standard, `shadow-md` on hover |
| **Font** | Geist Sans (body), Geist Mono (code) via `next/font/google` |
| **Icons** | Lucide React throughout — no mixing with react-icons in dashboard |
| **Utility helper** | `cn()` from `src/lib/utils.ts` — always use this for conditional classnames |
| **Toast** | `sonner` — import `toast` and call `toast.success()` / `toast.error()` |
| **Component naming** | PascalCase files, grouped by feature under `components/dashboard/[feature]/` |

---

## 9. Key Data Flows (Quick Reference)

```
Login
  LoginForm → useAuth().login()
    → AUTH.login() → POST /v1/auth/login
    → saveSession() → localStorage + cookies
    → router.push(/welcome-back or /admin)

Student Dashboard Load
  DashboardPage mounts
    → StudyProgress reads STUDY_STATS (mock)        ← TODO: replace with API
    → WeeklyActivity reads WEEKLY_ACTIVITY (mock)   ← TODO: replace with API
    → RecommendedCourses reads mock data            ← TODO: STUDENT.getRecommendedCourses()

AI Hub
  AiHubHeader → getStoredUser() → displays first name
  AiHubLearningStreak → hardcoded XP + streak      ← TODO: STUDENT.getGamification()

AI Chat
  AiChatSession → local state messages
  sendMessage() → fake setTimeout reply             ← TODO: real AI API endpoint

Admin Dashboard Load
  AdminDashboardPage mounts
    → Promise.all([ADMIN.getStats(), ADMIN.getCourses(pending)])
    → live data renders immediately
```

---

*This document was generated by reading the full source tree of the ReadAM frontend repository. It reflects the state of the codebase as of the last session — July 2026.*