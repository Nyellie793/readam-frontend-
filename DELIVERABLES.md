# ReadAM Frontend — UI Refactor Deliverables

## 1. Summary of UI Improvements

### Task 1 — Language Toggle
- Replaced the plain text EN/FR switch with a pill-style button group: active language gets blue background + white text + `shadow-sm`; inactive gets transparent + hover highlight. Smooth 250ms transition.

### Task 2 — Theme Toggle (UI Only)
- New `ThemeToggle` pill switch placed directly beside `LanguageToggle` in desktop Navbar, `MobileMenu`, and `AuthMobileMenu`. Animated sliding thumb with Sun/Moon icons. Placeholder `useState` is clearly commented with exact steps to wire up `next-themes` later.

### Task 3 — Skeleton Loading
- Replaced all bare spinners and blank pages with shimmer skeleton screens. `globals.css` now overrides `animate-pulse` with a true directional shimmer sweep (LinkedIn style). `src/app/loading.tsx` now renders the full `HomeSkeleton` composed from section-level skeletons. `src/app/admin/loading.tsx` uses `SkeletonDashboard`.

### Task 4 — Hero Section
- **Hero Image**: Rounded `2rem` frame with gradient border, glassmorphism backing, soft drop-shadow, animated "AI Powered" sparkle chip top-right, floating 94% stat card bottom-left.
- **SearchBar**: Moved above CTA buttons in the left column — now the second element users see. Prominent gradient-ring frame, blue glow, larger send button with an orange shadow.

### Task 5 — Homepage SaaS Redesign
- `Stats` section: added icons, hover-lift on each stat card, icon background colour swap on hover.
- Typography, spacing and visual rhythm were already strong in existing sections — changes targeted the weakest points (Stats, Hero) without breaking existing well-designed sections (Features bento grid, Pricing, Newsletter).

### Task 6 — Mobile Responsiveness
- `safe-top` on Navbar header via `env(safe-area-inset-top)` (iPhone notch/Dynamic Island support).
- `safe-bottom` on Footer (iPhone home-bar support).
- All new admin pages use responsive `grid-cols-1 sm:grid-cols-2 lg:grid-cols-4` and `p-4 sm:p-6` patterns.
- `DataTable` has `overflow-x-auto` + `min-w-[640px]` so tables scroll cleanly on small phones without breaking layout.
- Admin Topbar hamburger triggers a `Sheet` (slide-in drawer) on mobile; desktop shows fixed sidebar.

### Task 7 — Reusable Component Improvements
- `Subjects` cards: `hover:-translate-y-1 hover:shadow-lg duration-300` (up from `hover:shadow-md transition-shadow`).
- `StatCards` admin widget: `hover:-translate-y-0.5 hover:shadow-md` micro-lift.
- `DataTable`: row `hover:bg-gray-50/60` highlight.
- `Chart`: interactive tooltip on hover, active bar turns blue.

### Task 8 — Admin Dashboard
Full enterprise-grade dashboard wired from `src/data/admin-mock.ts` (easy to swap for API later):
- `/admin` — Dashboard Home (overview stats, revenue chart, recent activity feed, pending approvals)
- `/admin/courses` — Courses Management (stats, searchable/paginated table, status badges)
- `/admin/tutors` — Tutors Management (stats, rating column, avatar initials, status)
- `/admin/users` — Students Management (stats, enrolment count, joined date, status)
- `/admin/payments` — Financial Overview (4 payment stats, line chart, transactions table)
- `/admin/analytics` — AI Insights (top questions, struggle-topic bars, at-risk predictions, rising demand, danger zone)
- `/admin/settings` — Admin Settings (platform identity, appearance, notification toggles, role management table, academic structure, danger zone)

### Task 9 — Code Quality
- All mock data centralised in `src/data/admin-mock.ts` — one file to replace when APIs are ready.
- All admin types centralised in `src/types/dashboard.types.ts`.
- Admin nav config in `src/constants/admin-nav.ts`.
- `DataTable<T>` is fully generic — works with any `id: string` row type.
- `StatCards` accepts any `StatCardData[]` — reused across 5 admin pages without duplication.
- Duplicate `Toaster` removed from admin layout (root layout already renders it).
- `useIsMobile` hook added to `src/hooks/use-mobile.ts` (was an empty stub).

---

## 2. New Reusable Components

| Component | Path | Purpose |
|---|---|---|
| `ThemeToggle` | `src/components/shared/ThemeToggle.tsx` | UI-only light/dark pill switch |
| `SkeletonCard` | `src/components/skeletons/SkeletonCard.tsx` | Generic feature card skeleton |
| `SkeletonHero` | `src/components/skeletons/SkeletonHero.tsx` | Full hero section skeleton |
| `SkeletonTable` | `src/components/skeletons/SkeletonTable.tsx` | Configurable rows/cols table skeleton |
| `SkeletonDashboard` | `src/components/skeletons/SkeletonDashboard.tsx` | Full dashboard skeleton |
| `SkeletonProfile` | `src/components/skeletons/SkeletonProfile.tsx` | User profile row skeleton |
| `SkeletonList` | `src/components/skeletons/SkeletonList.tsx` | Item list skeleton |
| `SkeletonImage` | `src/components/skeletons/SkeletonImage.tsx` | Aspect-ratio image placeholder |
| `SkeletonStats` | `src/components/skeletons/SkeletonStats.tsx` | Stats grid skeleton (configurable count) |
| `HomeSkeleton` | `src/components/skeletons/HomeSkeleton.tsx` | Full homepage skeleton |
| `BannerSkeleton` | `src/components/skeletons/BannerSkeleton.tsx` | Banner section skeleton |
| `FeaturesSkeleton` | `src/components/skeletons/FeaturesSkeleton.tsx` | Features grid skeleton |
| `VideosSkeleton` | `src/components/skeletons/VideosSkeleton.tsx` | Video cards skeleton |
| `TutorSkeleton` | `src/components/skeletons/TutorSkeleton.tsx` | Tutor cards skeleton |
| `TestimonialSkeleton` | `src/components/skeletons/TestimonialSkeleton.tsx` | Testimonial cards skeleton |
| `StatsSkeleton` | `src/components/skeletons/StatsSkeleton.tsx` | Stats section skeleton |
| `PricingSkeleton` | `src/components/skeletons/PricingSkeleton.tsx` | Pricing cards skeleton |
| `NewsletterSkeleton` | `src/components/skeletons/NewletterSkeleton.tsx` | Newsletter section skeleton |
| `StatCards` | `src/components/admin/StatCards.tsx` | Admin metric grid (dark/accent/default tones) |
| `Chart` | `src/components/admin/Chart.tsx` | Dependency-free bar/line chart placeholder |
| `DataTable<T>` | `src/components/admin/DataTable.tsx` | Generic searchable paginated table |
| `Sidebar` | `src/components/admin/Sidebar.tsx` | Admin nav rail (desktop + mobile Sheet) |
| `Topbar` | `src/components/admin/Topbar.tsx` | Admin top bar (search, bell, profile, mobile hamburger) |
| `Badge` | `src/components/ui/Badge.tsx` | CVA-based status badge (6 variants) |
| `SectionTitle` | `src/components/shared/SectionTitle.tsx` | Reusable eyebrow + heading + description block |

---

## 3. Modified Files

```
src/app/globals.css                           shimmer animation, safe-area utilities
src/app/loading.tsx                           HomeSkeleton instead of HeroSkeleton
src/app/admin/layout.tsx                      responsive sidebar + no duplicate Toaster
src/app/admin/page.tsx                        full Dashboard Home
src/app/admin/courses/page.tsx                Courses Management page
src/app/admin/analytics/page.tsx              AI Insights page
src/app/page.tsx                              (unchanged — all sections already assembled)
src/components/layout/Navbar.tsx              ThemeToggle, safe-top
src/components/layout/MobileMenu.tsx          ThemeToggle
src/components/auth/AuthMobileMenu.tsx        ThemeToggle
src/components/layout/Footer.tsx              safe-bottom
src/components/sections/Hero.tsx              SearchBar repositioned, layout cleanup
src/components/sections/HeroImage.tsx         complete redesign
src/components/sections/SearchBar.tsx         complete redesign (gradient ring, glow)
src/components/sections/HeroButtons.tsx       spacing tightened
src/components/sections/Stats.tsx             icons + hover-lift micro-interactions
src/components/sections/Subjects.jsx          stronger hover animation
src/components/shared/LanguageToggle.tsx      pill styling rewrite
src/hooks/use-mobile.ts                       implemented (was empty stub)
```

---

## 4. Responsive Improvements

- **iOS notch/Dynamic Island**: `safe-top` on Navbar via `env(safe-area-inset-top)`
- **iPhone home bar**: `safe-bottom` on Footer via `env(safe-area-inset-bottom)`
- **Admin dashboard**: `p-4 sm:p-6` padding, stat grids go `grid-cols-2 → grid-cols-4`
- **DataTable**: `overflow-x-auto` wrapper + `min-w-[640px]` keeps tables usable on 320px phones
- **Admin Topbar**: hamburger → Sheet drawer on `< lg`; desktop search hidden on `< md`
- **Admin Sidebar**: desktop-only fixed rail; mobile access via Topbar Sheet
- **Hero**: always full-width on mobile, two-column on `lg`

---

## 5. Accessibility Improvements

- `LanguageToggle`: `role="group"` + `aria-label` on container; `aria-pressed` on each button
- `ThemeToggle`: `role="switch"` + `aria-checked` + `aria-label`
- `DataTable`: semantic `<table>/<thead>/<tbody>/<th>/<td>` with scope
- `Topbar` bell button: `aria-label="Notifications"`
- Quick-action FAB: `aria-label="Quick action"`
- All new icon-only buttons have `aria-label` or `<span className="sr-only">`
- Badge uses `<span>` not `<div>` — correct for inline status labels

---

## 6. Backend Integration Suggestions

| Widget | What to replace |
|---|---|
| `OVERVIEW_STATS` in `admin-mock.ts` | `GET /api/admin/stats` |
| `REVENUE_TRENDS` | `GET /api/admin/revenue?period=weekly` |
| `RECENT_ACTIVITY` | `GET /api/admin/activity?limit=5` |
| `COURSES` | `GET /api/admin/courses?page=1&q=` |
| `TUTORS` | `GET /api/admin/tutors` |
| `STUDENTS` | `GET /api/admin/students` |
| `TRANSACTIONS` | `GET /api/admin/payments/transactions` |
| `TOP_QUESTIONS` | `GET /api/ai/top-questions` |
| `STRUGGLE_TOPICS` | `GET /api/ai/struggle-topics` |
| `LanguageToggle` state | Wire to `next-intl` / `i18next` context |
| `ThemeToggle` state | Replace `useState` with `useTheme()` from `next-themes` |

---

## 7. Future Animation Suggestions

- **Hero image**: CSS `animation: float 4s ease-in-out infinite` on the floating stat card
- **Stats section**: Intersection Observer → count-up animation on numbers when scrolled into view
- **Admin Chart**: bars animate from 0 → full height on mount (`transform: scaleY(0) → 1`)
- **Page transitions**: `next-view-transitions` for cross-route slide/fade
- **Skeleton → content**: `animate-in fade-in slide-in-from-bottom-2` on section mount
- **Sidebar nav items**: staggered `delay-[Nms]` entrance animation

---

## 8. Performance Optimisation Suggestions

- **Turbopack**: already the default dev server in Next.js 15 — no action needed
- **`next/image` priority**: Add `priority` to above-the-fold images (hero, first tutor card)
- **Route segment config**: Add `export const dynamic = 'force-static'` to homepage for full SSG
- **Admin data**: Use React `Suspense` boundaries per section so stats/tables stream independently
- **Chart library**: When ready for real charts, use `recharts` (already a dep) — the current `Chart` component is designed to be a drop-in replacement target
- **Bundle**: Audit with `@next/bundle-analyzer`; tree-shake any unused `lucide-react` icons by importing individually (already done throughout this codebase)
- **Fonts**: `Geist` is already subset to `latin` — no action needed
