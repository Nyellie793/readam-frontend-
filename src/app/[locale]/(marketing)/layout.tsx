import Navbar from "@/components/layout/Navbar";

/**
 * Shared shell for the public marketing routes (/, /features, /about,
 * /courses, /tutors, and their dynamic detail pages).
 *
 * Navbar used to be imported and rendered inside every one of those page.tsx
 * files individually, so navigating between them fully unmounted and
 * remounted it on every click — including its `sticky` + `backdrop-blur-md`
 * header. WebKit recomposites backdrop-filter layers far more expensively
 * than Chromium, so that remount was the main cause of Safari feeling
 * sluggish when switching between these pages. Rendering it once here keeps
 * it mounted across navigations within this group; only `children` swaps.
 */
export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Navbar />
      {children}
    </>
  );
}
