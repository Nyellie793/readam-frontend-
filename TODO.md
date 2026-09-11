# ReadAM — client QA list

Working tracker. Check items off as they ship. Updated as we go.

---

## Not started

- [ ] **Course detail page — no lesson preview.** The marketing `/courses/[courseId]` page
  shows a locked outline with no way to sample a free-preview lesson before buying.
  **Backend unblocked:** `GET /v1/courses/{id}/lessons/{lesson_id}` now accepts anonymous
  callers — serves the lesson when it's `is_preview=True` on a published course, 404
  otherwise (readam commit `ada6cff`). Ready to wire: a player + calling that endpoint
  for anonymous/not-enrolled visitors.

- [ ] **Continue exactly where I left off, across a whole course.** Per-lesson resume
  already works (`last_position_seconds`). Nothing tracks *which lesson* was last active
  for a given enrollment — needs a backend field/query (not started) plus a new frontend
  "my courses, resume" surface.

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
- Lesson preview on `/courses/[courseId]` is now unblocked — see "Not started" above.
- At some point, once enough of this list has shipped, do an end-to-end pass actually
  testing these rather than just reading the diffs: Google login device cap, preview
  playback, purchase/completion emails landing in a real inbox, continue-where-left-off,
  auto-advance, referrals once built.
