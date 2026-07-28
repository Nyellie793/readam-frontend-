
<div align="center">
  <h1>📚 ReadAM</h1>
  <p><strong>AI-Powered Learning Platform for Cameroonian Students</strong></p>
  <p>
    <img src="https://img.shields.io/badge/Next.js-16.2-black?logo=next.js" />
    <img src="https://img.shields.io/badge/React-19-blue?logo=react" />
    <img src="https://img.shields.io/badge/TypeScript-5-blue?logo=typescript" />
    <img src="https://img.shields.io/badge/Tailwind_CSS-4-38bdf8?logo=tailwindcss" />
    <img src="https://img.shields.io/badge/Backend-Railway-7c3aed" />
  </p>
</div>

---

## What Is ReadAM?

ReadAM is an edtech platform built for students in Cameroon. It gives students access to structured courses, an AI Tutor that explains concepts step by step, gamified progress tracking (XP, streaks, badges), and subscription-based access to premium content. Tutors can create and manage courses. Admins manage users, content, and payments from a dedicated panel.

The platform is designed around the Cameroonian curriculum — with support for GCE and WAEC past questions, French/English language toggle, and XAF (Central African Franc) pricing.

---

## Features

### For Students
- 🎓 **Course Library** — Browse and enroll in free and premium courses
- 🤖 **AI Tutor** — Subject-specific AI chat that explains concepts, quizzes, and builds study plans
- 📊 **Progress Tracking** — XP points, daily streaks, weekly activity charts
- 🔔 **Notifications** — Assignment grades, AI reminders, payment alerts
- ⚙️ **Settings** — Profile, password, subscription, language, notification preferences

### For Tutors
- Create and publish courses with video, PDF, and quiz lessons
- Manage enrolled students

### For Admins
- Full admin panel: users, tutors, courses, payments, analytics
- Role-based access — students and admins are separated at the middleware level

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | [Next.js 16](https://nextjs.org) — App Router, Turbopack |
| Language | TypeScript 5 (strict) |
| Styling | [Tailwind CSS v4](https://tailwindcss.com) |
| UI Components | [shadcn/ui](https://ui.shadcn.com) + [Radix UI](https://radix-ui.com) |
| Icons | [Lucide React](https://lucide.dev) |
| Animations | [Framer Motion](https://framer.motion.com) |
| Forms | [React Hook Form](https://react-hook-form.com) + [Zod](https://zod.dev) |
| Toasts | [Sonner](https://sonner.emilkowal.ski) |
| i18n | next-intl + i18next (English / French) |
| HTTP Client | Custom `fetch` wrapper (`src/lib/api.ts`) |
| Auth | JWT via `localStorage` + cookies (Edge Middleware route guard) |
| Backend | FastAPI — deployed on [Railway](https://railway.app) |

---

## Project Structure

```
src/
├── app/                        # Next.js App Router
│   ├── layout.tsx              # Root layout — fonts, toaster, network monitor
│   ├── page.tsx                # Public landing page
│   ├── login/                  # /login
│   ├── signup/                 # /signup
│   ├── select-role/            # /select-role — student or tutor
│   ├── onboarding-1/           # /onboarding-1
│   ├── onboarding-2/           # /onboarding-2
│   ├── welcome-back/           # /welcome-back
│   ├── admin/                  # /admin/* — admin panel (role-guarded)
│   └── dashboard/              # /dashboard/* — student portal
│       ├── layout.tsx          # Sidebar + main shell (inherited by all children)
│       ├── page.tsx            # Dashboard home
│       ├── courses/            # Course browser + course detail
│       ├── ai-hub/             # AI Tutor landing
│       ├── ai-chat/            # AI Chat session
│       ├── notifications/      # Notifications feed
│       └── settings/           # Account settings
│
├── components/
│   ├── dashboard/              # All student-facing UI components
│   │   ├── Sidebar.tsx         # Main navigation sidebar
│   │   ├── ai-hub/             # AI Hub page components
│   │   ├── ai-chat/            # AI Chat components
│   │   ├── courses/            # Course cards, filters, video/PDF viewer
│   │   ├── notifications/      # Notification feed components
│   │   └── shared/             # Search, bell, language toggle, theme toggle
│   ├── admin/                  # Admin panel components
│   ├── auth/                   # Login form, signup form, auth navbar
│   ├── shared/                 # App-wide: Logo, NetworkProvider
│   ├── skeletons/              # Loading skeletons
│   └── ui/                     # shadcn/ui primitives (do not edit manually)
│
├── constants/
│   ├── student-nav.ts          # Student sidebar nav items
│   └── branding.ts             # Brand name, primary colour, accent colour
│
├── data/
│   └── student-mock.ts         # Placeholder data shaped to match real API types
│
├── hooks/
│   ├── use-auth.ts             # useAuth() — login, register, logout
│   ├── useCurrentUser.ts       # useCurrentUser() — name, email, avatar
│   └── useNetworkStatus.ts     # Offline detection toast
│
├── i18n/
│   ├── en.ts / fr.ts           # English and French strings
│   └── provider.tsx            # Language context provider
│
├── lib/
│   ├── api.ts                  # fetch wrapper: api.get/post/patch/delete
│   ├── auth.ts                 # Session read/write: getStoredUser, saveSession, clearSession
│   ├── constants.ts            # API_BASE_URL, TOKEN_KEY, ROUTES, ADMIN_ROLES
│   └── utils.ts                # cn() — conditional class helper
│
├── services/
│   ├── auth.service.ts         # AUTH.login/register/setRole/me
│   └── student.service.ts      # STUDENT.getRecommendedCourses/getEnrollments/getGamification/etc.
│
├── types/
│   ├── user.types.ts           # User, AuthResponse, LoginPayload
│   ├── api.types.ts            # All API response shapes
│   └── dashboard.types.ts      # NavItem, StatCardData, ChartPoint
│
└── proxy.ts                    # Edge Middleware — route protection
```

---

## Getting Started

### Prerequisites

- Node.js 18+
- npm 9+

### Installation

```bash
git clone https://github.com/Nyellie793/readam-frontend-.git
cd readam-frontend-
npm install
```

### Environment Variables

Create a `.env.local` file in the project root:

```bash
NEXT_PUBLIC_API_URL=https://web-production-0dce.up.railway.app
```

> The app falls back to the Railway URL if this variable is not set, so local development works without `.env.local`.

### Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### Other Commands

```bash
npm run build        # Production build
npm start            # Serve the production build
npm run lint         # Run ESLint
npx tsc --noEmit     # Type check without emitting files
```

---

## Authentication Flow

1. User visits `/select-role` → picks **Student** or **Tutor**
2. Redirected to `/signup` with `?role=` param → fills in name, email, password
3. Frontend calls `POST /v1/auth/register` → gets tokens back
4. Frontend calls `POST /v1/auth/role` with Bearer token → sets the role
5. Tokens + user stored in `localStorage` and role written to a cookie (`readam_role`)
6. Edge Middleware reads the cookie to guard `/admin/*` and auth-required routes
7. On logout — `clearSession()` wipes `localStorage` and expires both cookies

---

## Route Protection

The Edge Middleware in `src/proxy.ts` enforces:

| Route | Rule |
|---|---|
| `/admin/*` | Must be authenticated **and** have role `admin` |
| `/onboarding-*`, `/welcome-back` | Must be authenticated |
| `/login`, `/signup` | Redirects to home if already authenticated |
| `/dashboard/*` | Currently unguarded at the edge — component-level check via `getStoredUser()` |

---

## API Integration

All HTTP calls go through the thin wrapper in `src/lib/api.ts`:

```ts
api.get<T>(path)              // authenticated GET
api.post<T>(path, body)       // unauthenticated POST (login, register)
api.patch<T>(path, body)      // authenticated PATCH
api.delete<T>(path)           // authenticated DELETE
```

Errors throw `ApiRequestError` with `.status` and `.detail`. Surface them with `toast.error()` from `sonner`.

**Backend base URL:** `https://web-production-0dce.up.railway.app`

---

## Current Status

| Area | Status |
|---|---|
| Auth (login, register, role, onboarding) | ✅ Live |
| Dashboard home | ✅ Live API |
| Course browser + course detail | ✅ Live API |
| AI Hub | ✅ Built — mock data |
| AI Chat | ✅ Built — mock messages |
| Notifications | ✅ Built — static mock |
| Settings | 🔧 Structure built — API wiring in progress |
| Payments page | 🔲 Not started |
| Admin panel (7 pages) | ✅ Live API |

---

## Contributing & Development Notes

- **All student pages** live under `src/app/dashboard/` and inherit the sidebar from `dashboard/layout.tsx` — never add a sidebar manually to a page
- **All imports** use `@/` path aliases — never relative paths
- **Icons** come from `lucide-react` only
- **`src/components/ui/`** is managed by shadcn — do not edit files there manually; run `npx shadcn add <component>` to add new ones
- **Mock data** goes in `src/data/student-mock.ts`, shaped to match the real API type so swapping to a live fetch is a one-line change
- **Currency** is XAF — display as `{price.toLocaleString()} XAF`
- **Language** — the platform supports English and French via `src/i18n/`

For AI agent contributors, read `AGENTS.md` in the repo root before making changes.

---

## License

Private — University of Buea final year project. All rights reserved.
