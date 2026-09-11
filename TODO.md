# ReadAM — client QA list

Working tracker. Check items off as they ship. Updated as we go.

---

## Not started

- [ ] **Referral commissions.** Zero code exists anywhere — fully greenfield, backend not
  started.
  **Decided:** percentage of the *platform's* cut, not the tutor's share or the full price.
  **Decided:** tracked only for now — no payout mechanism wired yet.
  **Decided:** only the referred person's very first purchase ever counts, not renewals
  (including GCE annual renewals).
  Will also need a frontend piece once the backend lands: capture the referral code at
  signup and pass it through.

---

## In progress / blocked

- [ ] **AI session switching bug.** Clicking a different session in the history list
  doesn't load it — only the first session ever opened on that page visit works.
  A fix was shipped (the effect that loads a session only ran once per mount; now compares
  the URL against the last one actually acted on) but the user confirmed **in incognito**
  that it's still broken, which rules out caching. Diagnosis paused mid-way — was waiting
  to hear exactly what happens on screen the moment you click a different session
  (nothing / a flicker / something else) before digging further.

- [ ] **AI chat sidebar redesign** (not on the original list, came up while fixing the
  above). Replace the history popup with a permanent left-hand rail listing every thread,
  live status per row (active / paused / expired), like Claude's own site. Agreed as the
  right direction. One thread open at a time, same as now — the rail is just a switcher,
  nothing forces you out of the chat you're in unless you click a different thread.
  **Not started — no go-ahead given yet.**

---

## Done

- [x] **Signing in on a used browser could bounce straight to login** (readam-frontend-
  commit `527eab3`, regression from the previous fix below, caught same session). Two bugs:
  `clearSession()` never wiped `readam_active_ai_session` (the remembered last-AI-session
  pointer), so a second account signing in on the same browser inherited the previous
  account's session id; and the paused-session fix's backend status check would then 401 on
  that foreign id, which `api.ts` treated as "your session died" and hard-redirected the
  whole tab to `/login`, even with a perfectly valid token. Fixed both: `clearSession()` now
  clears the AI session pointer too, and that lookup opts into a new `silentAuthFailure`
  request flag so a 401 there just falls through to starting a fresh session instead of
  nuking global auth state. Explicit `?session=` links (History) unaffected.

- [x] **Paused AI session wrongly treated as expired, blocking a student with
  no new-session credits but usable paused ones** (readam-frontend- commit `84f785e`).
  Backend's credit model was confirmed correct — a credit is spent once at session
  creation, pause/resume never touch it. The bug was the plain-visit resume check
  trusting a locally-cached `expires_at`, which freezes the moment a session is
  paused (only resume moves it forward). Time passing made a perfectly resumable
  paused session look expired client-side, so a plain nav skipped straight to
  starting a new session and hit 402, even with paused sessions sitting there
  already paid for. Now asks the backend for the real status before trusting a
  locally-remembered session; an explicit `?session=` link (from History) is
  unchanged. The 402 screen also now leads with "Resume your paused session" when
  one exists, instead of only "Buy More Credits".

- [x] **Free-preview lesson player on the public course page** (readam-frontend- commit
  `5dd5463`). Backend unblocked anonymous access in `ada6cff`. New `PreviewLessonRow`
  makes an `is_preview` lesson row a button that opens a dialog and plays the video / renders
  the PDF via `STUDENT.getLessonContent`, which already omits the Authorization header when
  there's no token, so the same call works signed out. Non-preview lessons unchanged.

- [x] **Continue exactly where I left off, across a whole course** (readam commit `a28a563`
  backend, readam-frontend- commit `565adb1` frontend). `CourseDetailResponse` and
  `RecentlyViewedItem` now carry `resume_lesson_id`/`resume_position_seconds`; null means no
  resume point (never started, or finished — a finished course resets to lesson 1 on
  purpose). The course page opens that lesson instead of always the first one. Recently-viewed
  card needed no change, it already links to the course page and inherits the fix.

- [x] **Video auto-advance didn't autoplay** (readam-frontend- commit `820765f`, found while
  testing auto-advance above). `VideoPlayer` remounts a fresh `<video>` on every lesson change
  (auto-advance, Up Next, outline click) but nothing called `.play()` on it — it loaded
  seeked to the resume position and just sat there paused. Fixed in `onLoadedMetadata`.

- [x] **Dashboard sidebars couldn't collapse** (readam-frontend- commit `418e75e`, came up
  while testing on a narrow viewport). Left nav: `useSidebarCollapsed` hook (localStorage +
  window event, same pattern as `readam_auth_change`) toggles `Sidebar` between full and
  icon-only, persisted across navigation; the course-filter panel on `/dashboard/courses` is
  unaffected. Right course-outline panel on the lesson page: page-local collapse to just a
  toggle button, not persisted, since it's about one video at a time.

- [x] **GCE pricing mixed into the AI Study Sessions page, and priced twice via Past
  Questions** (readam-frontend- commits `3702458`, `dba2f28`). `/payment/ai-sessions` fetched
  every product with no filter, so the single 5,000 XAF GCE package showed up as one more AI
  plan; it now filters `entitlement_type !== "gce_content"` and GCE gets its own Plans-hub
  tile straight to checkout. Separately, the whole Past Questions bundle flow
  (3,000/7,500/11,000/18,000 XAF by subject count) sold only official/admin-authored
  courses — content the 5,000 XAF GCE subscription already grants outright — so it was
  pricing the same content again for up to 3.6x GCE's price. Removed entirely: the page, its
  checkout branch, the three components and service methods behind it, the nav/hub entry
  points. Past Questions courses are still browsable via Explore Courses' "Official" filter
  and covered by GCE. Backend still has the now-unused `PAST_QUESTIONS_PRODUCTS` catalog and
  its two routes — harmless dead code, flagged for the backend session, not removed here.

- [x] **Auto-advance to next video** (readam-frontend- commit `12d1255`, landed while this
  session was on Saved courses). `handleProgress` now advances to the next lesson in
  `allLessons` whenever `VideoPlayer`'s `onEnded` reports `completed`. No check for whether
  the next lesson is locked — clicking a locked "Up Next" card already lands on the same
  paywall via the lesson endpoint's 403, so auto-advancing into one behaves the same as a
  manual click there.

- [x] **Saved courses — view-your-list half.** Backend was already done. Added the frontend:
  `/dashboard/saved` (`src/app/[locale]/dashboard/saved/page.tsx` +
  `src/components/dashboard/saved/SavedCoursesList.tsx`) calling `getSavedCourses` with
  load-more pagination, skeletons, error/retry and an empty state; a "Saved" nav entry in
  `student-nav.ts` (Bookmark icon, between Explore Courses and AI Tutor — also bumped
  `CourseFilters` nav slice to keep AI Tutor visible); a reusable
  `SaveCourseButton.tsx` now on the dashboard course detail page (right column, above the
  outline). Un-saving from the Saved page drops the card immediately via a new optional
  `onUnsave` prop on `CourseCard`. `tsc` + `build` clean.

- [x] **Course detail page routing bug.** A signed-in, already-enrolled student clicking a
  course was sent to `/signup` or checkout instead of into the course. The marketing detail
  page is a server component with no view of the session, so its CTA always pointed at
  signup/checkout. Added `src/components/sections/CoursePurchaseCta.tsx` — a client CTA that
  reads the session and sweeps every page of `/v1/enrollments`: enrolled → "Go to my course"
  (`/dashboard/courses/[id]`); signed in + free + not enrolled → enrol then straight into the
  lessons; signed in + paid + not enrolled → checkout with no sign-in prompt; signed out →
  unchanged. Fails open to the paid path. `npx tsc --noEmit` and `npm run build` both clean;
  the route stays `ƒ` (correctly dynamic).

- [x] **Past AI sessions / history.** Was already fully built (backend + popup dialog)
  before this list existed. Fixed gap: ended/expired sessions had no way to open them —
  added a "View" action next to "Resume".

- [x] **Admin tool to grant free AI session credits.** For QA testing without spending real
  money, and reusable going forward for support/goodwill grants. `POST
  /v1/admin/students/{id}/grant-ai-sessions`.

- [x] **No AI timer on mobile** — investigated, already fixed in a commit predating this
  list. Nothing to do unless reproduced on a specific device.

- [x] **Google login bypasses the two-device cap** (backend-only, readam commit `6dac841`).
  Every refresh-token-minting path — Google sign-in, register, role selection, password
  change, not just login — now creates a `UserSession` row and binds the token to it, so
  all of them count against the same 2-device cap. No frontend change needed. Worth a
  manual check: sign in with Google on a 3rd device and confirm the oldest session gets
  signed out on its next refresh.

- [x] **Purchase and completion emails** (backend-only, readam commit `95cade2`). All three
  successful-payment webhook paths (course, past-questions bundle, subscription) now send
  a receipt email after commit; finishing every lesson in an enrolled course sends a
  one-time congratulations email (`Enrollment.completed_at` gates it so it can't re-fire).
  No frontend change needed — these are server-sent. Worth a manual check once Resend is
  configured: buy a course and finish one, confirm both emails land.

---

## Notes for next session

- The session-switching bug is the live thread — pick this back up first unless told
  otherwise. Still need to hear what happens on screen when a different session is clicked.
- Referral commissions is the only "Not started" item left, and it's fully greenfield —
  backend hasn't begun.
- At some point, once enough of this list has shipped, do an end-to-end pass actually
  testing these rather than just reading the diffs: Google login device cap, preview
  playback, purchase/completion emails landing in a real inbox, continue-where-left-off on a
  finished course specifically, referrals once built.
