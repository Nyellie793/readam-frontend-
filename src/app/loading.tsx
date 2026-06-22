/**
 * Root-level loading.tsx — intentionally minimal.
 *
 * In Next.js App Router, this file intercepts EVERY route under /app/
 * (including /login, /signup, /admin, etc.) while the next page's JS
 * chunk loads. Rendering a full HomeSkeleton here made every page feel
 * slow. Instead we use a slim top-bar pulse that's near-instant to paint
 * and doesn't look wrong on any page.
 *
 * Page-specific skeletons live in route-level loading.tsx files:
 *   src/app/login/loading.tsx
 *   src/app/signup/loading.tsx
 *   src/app/admin/loading.tsx   (already in place)
 */
export default function GlobalLoading() {
  return (
    <div
      aria-label="Loading"
      role="status"
      className="fixed inset-x-0 top-0 z-[9999] h-0.5 overflow-hidden bg-transparent"
    >
      <div className="h-full w-full animate-[shimmer_1.2s_ease-in-out_infinite] bg-gradient-to-r from-blue-400 via-blue-600 to-orange-400 bg-[length:200%_100%]" />
    </div>
  );
}
