# AGENTS.md — ReadAM Frontend

> **Read this entire file before touching any code.**
> This file tells you exactly how this project is structured, what the rules are, and how to build new things without breaking what already exists.

---

## 1. What Is ReadAM?

ReadAM is a Cameroonian edtech platform. Students log in, browse courses, study with an AI Tutor, track their progress, manage their subscription, and adjust their settings. Tutors create and manage course content. Admins manage everything via a separate admin panel.

The frontend is a **Next.js 15 App Router** application written in **TypeScript**, styled with **Tailwind CSS v4**, and uses **shadcn/ui** for base UI primitives. It talks to a live **FastAPI backend** deployed on Railway.

**Brand colours:**
- Primary blue: `#2563EB` (Tailwind `blue-600`)
- Accent orange: `#F97316` (Tailwind `orange-400`)
- Dashboard background: `bg-blue-50`
- Settings/notifications background: `bg-gray-50`
- Auth pages background: `bg-[#F7F8FC]`

---

## 2. Tech Stack

| Layer | Choice |
|---|---|
| Framework | Next.js 15 (App Router, Turbopack) |
| Language | TypeScript (strict) |
| Styling | Tailwind CSS v4 — utility classes only, no custom CSS files |
| UI Primitives | shadcn/ui (`@/components/ui/*`) |
| Icons | `lucide-react` only — never heroicons or others |
| Fonts | Geist Sans + Geist Mono (loaded in `src/app/layout.tsx`) |
| Toast | `sonner` — import `toast` directly from `"sonner"` |
| HTTP | Custom `api` wrapper in `@/lib/api.ts` |
| Auth | `localStorage` + cookies — see `@/lib/auth.ts` |
| State | Local `useState`/`useEffect` — no Redux, no Zustand, no Context |
| i18n | `@/i18n/` — English/French toggle |
| Backend | FastAPI on Railway: `https://readam-api-production.up.railway.app` |

---

## 3. Repository Layout

```
readam-frontend/
├── src/
│   ├── app/                          # Next.js App Router pages
│   │   ├── layout.tsx                # Root layout (fonts, Toaster, NetworkProvider)
│   │   ├── page.tsx                  # Landing page (public)
│   │   ├── login/                    # /login
│   │   ├── signup/                   # /signup
│   │   ├── select-role/              # /select-role (student | tutor picker)
│   │   ├── onboarding-1/             # /onboarding-1
│   │   ├── onboarding-2/             # /onboarding-2
│   │   ├── welcome-back/             # /welcome-back
│   │   ├── about/                    # /about
│   │   ├── admin/                    # /admin/* (separate layout, role-guarded)
│   │   └── dashboard/                # /dashboard/* (student area)
│   │       ├── layout.tsx            # Dashboard shell: sidebar + <main> — DO NOT DUPLICATE
│   │       ├── page.tsx              # /dashboard (home)
│   │       ├── courses/              # /dashboard/courses + /dashboard/courses/[courseId]
│   │       ├── ai-hub/               # /dashboard/ai-hub  — AI Tutor landing
│   │       ├── ai-chat/              # /dashboard/ai-chat — AI chat session
│   │       ├── notifications/        # /dashboard/notifications
│   │       └── settings/             # /dashboard/settings
│   │
│   ├── components/
│   │   ├── admin/                    # Admin-only components (do not use in student pages)
│   │   ├── ai-tutor/                 # LEGACY — do not add new files here
│   │   ├── auth/                     # Login, signup, logout, navbar
│   │   ├── dashboard/                # ALL student dashboard components
│   │   │   ├── Sidebar.tsx           # THE navigation sidebar — edit for nav changes
│   │   │   ├── DashboardNavigation.tsx  # Switches between Sidebar and CourseFilters
│   │   │   ├── DashboardMobileSidebar.tsx
│   │   │   ├── DashboardHeader.tsx   # Desktop header + mobile top bar
│   │   │   ├── DashboardGreeting.tsx
│   │   │   ├── DashboardSearch.tsx
│   │   │   ├── DashboardActions.tsx
│   │   │   ├── StudyProgress.tsx     # Live XP/streak stats from API
│   │   │   ├── WeeklyActivity.tsx    # Chart + DailyStreak + RecentBadges
│   │   │   ├── RecommendedCourses.tsx
│   │   │   ├── RecentlyViewed.tsx
│   │   │   ├── DailyStreak.tsx
│   │   │   ├── RecentBadges.tsx
│   │   │   ├── ai-hub/               # AI Hub page components
│   │   │   │   ├── AiHubHeader.tsx
│   │   │   │   ├── AiHubSuggestions.tsx
│   │   │   │   ├── AiHubFeatureCards.tsx
│   │   │   │   ├── AiHubBanner.tsx
│   │   │   │   └── AiHubLearningStreak.tsx
│   │   │   ├── ai-chat/
│   │   │   │   └── AiChatSession.tsx
│   │   │   ├── courses/              # Course browsing + detail components
│   │   │   ├── notifications/
│   │   │   │   ├── NotificationsSearch.tsx
│   │   │   │   ├── NotificationsHeader.tsx
│   │   │   │   └── NotificationsFeed.tsx
│   │   │   └── shared/               # Reusable dashboard-scoped primitives
│   │   │       ├── SearchInput.tsx
│   │   │       ├── NotificationBell.tsx
│   │   │       ├── ThemeToggle.tsx
│   │   │       └── LanguageToggle.tsx
│   │   ├── shared/                   # App-wide shared components
│   │   │   ├── Logo.tsx              # ReadAM logo — blue "READ" + orange "AM"
│   │   │   └── NetworkProvider.tsx   # Offline detection
│   │   ├── skeletons/                # Loading skeleton components
│   │   └── ui/                       # shadcn/ui primitives — NEVER modify these files
│   │
│   ├── constants/
│   │   ├── student-nav.ts            # STUDENT_NAV + AI_TUTOR_SUB_NAV
│   │   ├── admin-nav.ts
│   │   ├── branding.ts               # BRAND.name / .primary / .accent
│   │   ├── languages.ts
│   │   ├── navigation.ts
│   │   └── pricing.ts
│   │
│   ├── data/
│   │   ├── student-mock.ts           # Placeholder data shaped to match real API types
│   │   ├── admin-mock.ts
│   │   ├── courses.ts
│   │   └── testimonials.ts
│   │
│   ├── hooks/
│   │   ├── use-auth.ts               # useAuth() — login, register, logout, loading, user
│   │   ├── useCurrentUser.ts         # useCurrentUser() — user, name, email, avatar
│   │   ├── useDashboard.ts           # useDashboard() — dashboard, loading
│   │   ├── useGreeting.ts
│   │   ├── useLanguage.ts
│   │   └── useNetworkStatus.ts
│   │
│   ├── i18n/
│   │   ├── en.ts / fr.ts             # String translations
│   │   ├── config.ts / index.ts
│   │   └── provider.tsx
│   │
│   ├── lib/
│   │   ├── api.ts                    # api.get / post / patch / delete
│   │   ├── auth.ts                   # getStoredUser, saveSession, clearSession, getToken
│   │   ├── constants.ts              # API_BASE_URL, TOKEN_KEY, ROUTES, ADMIN_ROLES
│   │   └── utils.ts                  # cn() — always use this for conditional classes
│   │
│   ├── services/
│   │   ├── auth.service.ts           # AUTH.login/register/setRole/me/refresh
│   │   ├── student.service.ts        # STUDENT.getRecommendedCourses/getEnrollments/etc.
│   │   ├── admin.service.ts
│   │   └── dashboard.service.ts
│   │
│   ├── types/
│   │   ├── user.types.ts             # User, AuthResponse, LoginPayload, RegisterPayload
│   │   ├── api.types.ts              # All API response shapes
│   │   ├── course.types.ts           # UI-side course/lesson shapes
│   │   └── dashboard.types.ts        # NavItem, StatCardData, ChartPoint
│   │
│   └── proxy.ts                      # Edge middleware — route protection via cookies
│
├── AGENTS.md                         ← you are here
├── next.config.ts
├── tsconfig.json
└── package.json
```

---

## 4. Routing Rules

### All student pages live under `/dashboard/*`

`src/app/dashboard/layout.tsx` wraps all children with the sidebar automatically. You never add a sidebar manually to a page.

| URL | Page file |
|---|---|
| `/dashboard` | `src/app/dashboard/page.tsx` |
| `/dashboard/courses` | `src/app/dashboard/courses/page.tsx` |
| `/dashboard/courses/[courseId]` | `src/app/dashboard/courses/[courseId]/page.tsx` |
| `/dashboard/ai-hub` | `src/app/dashboard/ai-hub/page.tsx` |
| `/dashboard/ai-chat` | `src/app/dashboard/ai-chat/page.tsx` |
| `/dashboard/notifications` | `src/app/dashboard/notifications/page.tsx` |
| `/dashboard/settings` | `src/app/dashboard/settings/page.tsx` |

### Adding a new student page

1. Create `src/app/dashboard/<page-name>/page.tsx`
2. Add to `STUDENT_NAV` in `src/constants/student-nav.ts` with `href: "/dashboard/<page-name>"`
3. Create components in `src/components/dashboard/<page-name>/`
4. **Do not create a new `layout.tsx`** — it is inherited

### Admin routes

Completely separate. Live under `/admin/*` with their own layout. Never mix admin and student components.

---

## 5. Navigation — How the Sidebar Works

**`src/components/dashboard/Sidebar.tsx`** maps over `STUDENT_NAV`. The "AI Tutor" item is special — when `pathname` starts with `/dashboard/ai-hub` or `/dashboard/ai-chat`, a sub-nav expands beneath it showing AI Hub and AI Chat links.

```ts
// src/constants/student-nav.ts — current state
export const STUDENT_NAV: NavItem[] = [
  { label: "Home",            href: "/dashboard",               icon: Home },
  { label: "Explore Courses", href: "/dashboard/courses",       icon: BookOpen },
  { label: "AI Tutor",        href: "/dashboard/ai-hub",        icon: Sparkles },
  { label: "Payments",        href: "/dashboard/payments",      icon: CreditCard },
  { label: "Settings",        href: "/dashboard/settings",      icon: Settings },
];

export const AI_TUTOR_SUB_NAV: NavItem[] = [
  { label: "AI Hub",  href: "/dashboard/ai-hub",  icon: LayoutGrid },
  { label: "AI Chat", href: "/dashboard/ai-chat", icon: MessageCircle },
];
```

**To add a nav item:** add the object to `STUDENT_NAV`. Do not edit `Sidebar.tsx` unless you are changing expansion or active-state logic.

**Active state logic:**
- AI Tutor parent: active when `pathname.startsWith("/dashboard/ai-hub") || pathname.startsWith("/dashboard/ai-chat")`
- All others: `pathname === item.href || pathname.startsWith(item.href + "/")`

---

## 6. Authentication & Session

**`src/lib/auth.ts`** — the only place that reads/writes auth state.

```ts
getStoredUser()        // User | null — reads localStorage["readam_user"]
getToken()             // string | null — reads localStorage["readam_access_token"]
saveSession(data)      // saves tokens + user to localStorage, writes cookies
clearSession()         // wipes localStorage + expires cookies
updateStoredUser(user) // updates the stored user object without full re-login
```

**Cookies set on login (for Edge middleware):**
- `readam_auth=1` — used to guard auth-required routes
- `readam_role=student|admin` — used to guard admin routes

**User shape:**
```ts
interface User {
  id: string;
  full_name: string;
  email: string;
  role?: string;
  avatar?: string;
}
```

**Pattern — reading the user in a client component:**
```tsx
"use client";
import { useEffect, useState } from "react";
import { getStoredUser } from "@/lib/auth";
import type { User } from "@/types/user.types";

const [user, setUser] = useState<User | null>(null);
useEffect(() => { setUser(getStoredUser()); }, []);
```

Do not call `getStoredUser()` at module level or in server components — `localStorage` only exists in the browser.

---

## 7. API Layer

**`src/lib/api.ts`** — thin fetch wrapper. All requests go through this.

```ts
api.get<T>(path, auth?)           // auth defaults true
api.post<T>(path, body, auth?)    // auth defaults false
api.patch<T>(path, body, auth?)   // auth defaults true
api.delete<T>(path, auth?)        // auth defaults true
```

Base URL: `https://readam-api-production.up.railway.app` (override with `NEXT_PUBLIC_API_URL`)

Throws `ApiRequestError` with `.status` and `.detail` on non-2xx responses.

**Standard fetch pattern:**
```tsx
"use client";
import { useEffect, useState } from "react";
import STUDENT from "@/services/student.service";
import type { GamificationResponse } from "@/types/api.types";

const [data, setData] = useState<GamificationResponse | null>(null);
const [loading, setLoading] = useState(true);
const [error, setError] = useState<string | null>(null);

useEffect(() => {
  STUDENT.getGamification()
    .then(setData)
    .catch((e) => setError(e.message))
    .finally(() => setLoading(false));
}, []);
```

---

## 8. Available API Endpoints

### Student — `src/services/student.service.ts`

| Method | Path | What it returns |
|---|---|---|
| GET | `/v1/courses/recommended?page=` | Paginated recommended courses |
| GET | `/v1/courses?search=&category=&page=` | Browse all published courses |
| GET | `/v1/courses/:id` | Course detail with modules and lessons |
| GET | `/v1/enrollments?page=` | Student's enrolled courses |
| POST | `/v1/enrollments` | Enroll `{ course_id }` |
| GET | `/v1/ai/gamification` | `{ total_xp, current_streak_days, longest_streak_days }` |
| GET | `/v1/students/me` | Student profile (interests, goals, onboarding status) |
| GET | `/v1/subscriptions/me` | `{ can_start_ai_session, entitlements[] }` |

### Auth — `src/services/auth.service.ts`

| Method | Path | Notes |
|---|---|---|
| POST | `/v1/auth/register` | Returns `AuthResponse` (tokens + user with role=null) |
| POST | `/v1/auth/login` | Returns `AuthResponse` |
| POST | `/v1/auth/role` | Set role after register — requires Bearer token |
| GET | `/v1/auth/me` | Returns current `User` |
| POST | `/v1/auth/refresh` | `{ refresh_token }` → new `AuthResponse` |
| POST | `/v1/auth/google` | `{ google_id_token }` → `AuthResponse` |

---

## 9. Component Patterns

### Page file — always thin

```tsx
// src/app/dashboard/example/page.tsx
import ExampleHeader from "@/components/dashboard/example/ExampleHeader";
import ExampleContent from "@/components/dashboard/example/ExampleContent";

export default function ExamplePage() {
  return (
    <div className="min-h-screen bg-blue-50">
      <div className="mx-auto max-w-6xl space-y-6 px-4 py-6 sm:px-6 lg:px-10">
        <ExampleHeader />
        <ExampleContent />
      </div>
    </div>
  );
}
```

### "use client" — when to add it

Add `"use client"` to any file that uses:
- `useState`, `useEffect`, `useCallback`, `useRef`
- `useRouter`, `usePathname`, `useSearchParams`
- `localStorage`, `document.cookie`
- Event handlers (`onClick`, `onChange`, etc.)

Do **not** add it to `page.tsx` or `layout.tsx` unless absolutely necessary.

### Path aliases — always use `@/`

```ts
import { cn } from "@/lib/utils";          // ✅
import STUDENT from "@/services/student.service"; // ✅
import { cn } from "../../lib/utils";       // ❌ never
```

### Styling — the design language

```
Cards:       rounded-2xl border border-gray-100 bg-white shadow-sm
Sections:    space-y-6 px-4 py-6 sm:px-6 lg:px-10
Headings:    text-2xl font-extrabold text-gray-900
Body text:   text-sm text-gray-500 leading-relaxed
Primary btn: bg-blue-600 text-white hover:bg-blue-700 rounded-xl px-4 py-2.5 font-semibold
Ghost btn:   border border-gray-200 bg-white hover:bg-gray-50 rounded-xl px-4 py-2 text-sm font-medium
Pill badge:  rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-medium text-blue-600
Danger text: text-red-500 / text-red-600
Success:     text-teal-600 / bg-teal-50
Warning:     text-orange-500 / bg-orange-50
```

### Conditional classes — always use `cn()`

```tsx
import { cn } from "@/lib/utils";

<div className={cn("base-classes", isActive && "active-classes", variant === "x" && "x-classes")} />
```

### Loading states

Always show a skeleton while data loads — never show an empty list or blank space.

```tsx
{loading
  ? Array.from({ length: 3 }).map((_, i) => <SkeletonCard key={i} />)
  : items.map((item) => <RealCard key={item.id} item={item} />)
}
```

### Error states

Show an inline error, do not crash the page:
```tsx
{error && <p className="text-sm text-red-500">{error}</p>}
```

### Currency

All prices are integers in XAF (Central African Franc). Display as:
```tsx
{price === 0 ? "Free" : `${price.toLocaleString()} XAF`}
```

---

## 10. shadcn/ui — What Is Available

These are in `src/components/ui/`. Import from there. Do not reinstall.

```ts
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner"; // use sonner directly, not the ui wrapper
```

If you need a component not in this list, run `npx shadcn add <component>`. Never copy-paste shadcn components manually.

---

## 11. What Is Built vs What Needs Work

### ✅ Built and working

| Page | Route | Data source |
|---|---|---|
| Landing | `/` | Static |
| Login | `/login` | Live API |
| Sign up + role select | `/signup`, `/select-role` | Live API |
| Onboarding | `/onboarding-1`, `/onboarding-2` | Live API |
| Dashboard home | `/dashboard` | Live API (XP, streak, courses) |
| Course browser | `/dashboard/courses` | Live API |
| Course detail | `/dashboard/courses/[courseId]` | Live API |
| AI Hub | `/dashboard/ai-hub` | Mock/static |
| AI Chat | `/dashboard/ai-chat` | Mock messages |
| Notifications | `/dashboard/notifications` | Static mock |
| Settings (structure) | `/dashboard/settings` | Partially wired |
| Admin panel | `/admin/*` | Live API |

### 🔧 Built but needs API wiring

| Feature | What to connect |
|---|---|
| AI Chat | AI session endpoint (TBD) |
| Notifications | Notification feed endpoint (TBD) |
| Settings — save profile | `PATCH /v1/auth/me` or `PATCH /v1/students/me` |
| Settings — change password | `POST /v1/auth/change-password` (confirm endpoint) |
| Settings — language | Persist to `localStorage` via `useLanguage` hook |

### 🔲 Not yet built

| Feature | Route | Notes |
|---|---|---|
| Payments page | `/dashboard/payments` | Nav entry exists, page not created |
| Student public profile | TBD | |
| Quiz / assessment flow | TBD | Referenced in AI Hub feature cards |
| Past questions browser | TBD | Referenced in AI Hub feature cards |

---

## 12. The 10 Rules — Never Break These

1. **Never add files to `src/components/ui/`** — shadcn owns those files.

2. **Never create `layout.tsx` inside a dashboard sub-route** — `src/app/dashboard/layout.tsx` already wraps all children.

3. **Never use HTML `<form>` elements** — use `onClick`/`onChange` + state. No native form submission.

4. **Never import from relative paths** — always use `@/` aliases.

5. **Never put logic in `page.tsx`** — pages only compose and lay out components.

6. **Never add to `src/components/ai-tutor/`** — that is legacy. New AI components go in `src/components/dashboard/ai-hub/` or `src/components/dashboard/ai-chat/`.

7. **Always run `npx tsc --noEmit` before declaring work done** — zero type errors is the bar.

8. **Mock data goes in `src/data/student-mock.ts`** — not inline in components. Shape it to the real API type so the swap to a live fetch is a one-liner.

9. **Never change `src/proxy.ts` matcher** without understanding it guards `/admin/*`, `/onboarding-*`, `/welcome-back`, `/login`, `/signup` — and currently does NOT guard `/dashboard/*` routes.

10. **Always check `src/constants/student-nav.ts`** when adding a page — the nav entry and the page file must match.

---

## 13. Step-by-Step: Adding a New Dashboard Page

Example: building **Payments** at `/dashboard/payments`.

```
1. Create the page
   src/app/dashboard/payments/page.tsx
   → thin file, imports and composes section components only

2. Create the components folder
   src/components/dashboard/payments/
     PaymentsHeader.tsx
     PaymentsHistory.tsx
     PaymentsUpgrade.tsx

3. Update the nav (already has a Payments entry — just verify the href matches)
   src/constants/student-nav.ts
   { label: "Payments", href: "/dashboard/payments", icon: CreditCard }

4. Fetch real data using the existing service
   STUDENT.getSubscriptions() → MySubscriptionsResponse

5. Show skeleton while loading, error text on failure

6. Typecheck
   npx tsc --noEmit

7. Build check
   npm run build
```

---

## 14. Environment Variables

```bash
NEXT_PUBLIC_API_URL=https://readam-api-production.up.railway.app
```

Set in `.env.local` for local dev. The `src/lib/constants.ts` fallback points to the live Railway URL so the app works without a local env file.

---

## 15. Running the Project

```bash
npm install          # install dependencies
npm run dev          # start dev server (Turbopack, port 3000)
npx tsc --noEmit     # type check
npm run build        # production build — must pass before any PR
npm start            # serve production build
```

**Windows / PowerShell users:**
```powershell
taskkill /f /im node.exe          # kill locked dev server before deleting node_modules
Remove-Item -Recurse -Force node_modules   # instead of rm -rf
```