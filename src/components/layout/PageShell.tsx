import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

interface PageShellProps {
  /** Small uppercase pill above the title. */
  eyebrow: string;
  title: React.ReactNode;
  /** One or two sentences under the title. */
  intro?: React.ReactNode;
  /** Shown under the intro, e.g. "Last updated 3 August 2026". */
  meta?: string;
  children: React.ReactNode;
}

/**
 * Shared chrome for the standalone public pages (legal, help, contact, blog).
 * Matches the hero treatment used on /about and /features so these pages do
 * not read as bolted on.
 */
export default function PageShell({ eyebrow, title, intro, meta, children }: PageShellProps) {
  return (
    <div className="relative min-h-screen bg-white">
      <div className="pointer-events-none absolute right-0 top-0 z-0 h-[50vh] w-[55vw] rounded-full bg-blue-100/40 blur-[120px]" />

      <div className="relative z-10">
        <Navbar />

        <main>
          <section className="mx-auto max-w-4xl px-6 pb-10 pt-16 sm:pt-20">
            <span className="inline-block rounded-full border border-orange-200 bg-orange-50 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-orange-500">
              {eyebrow}
            </span>

            <h1 className="mt-5 text-4xl font-black leading-tight text-gray-900 sm:text-5xl">
              {title}
            </h1>

            {intro && (
              <p className="mt-5 text-base leading-relaxed text-gray-500">{intro}</p>
            )}

            {meta && (
              <p className="mt-6 border-t border-gray-100 pt-5 text-xs font-medium uppercase tracking-widest text-gray-400">
                {meta}
              </p>
            )}
          </section>

          <section className="mx-auto max-w-4xl px-6 pb-20">{children}</section>
        </main>

        <Footer />
      </div>
    </div>
  );
}

/** A titled block of legal or explanatory copy. */
export function Article({
  id,
  heading,
  children,
}: {
  id?: string;
  heading: string;
  children: React.ReactNode;
}) {
  return (
    <div id={id} className="scroll-mt-24 border-t border-gray-100 py-8 first:border-t-0 first:pt-0">
      <h2 className="text-xl font-bold text-gray-900">{heading}</h2>
      <div className="mt-3 space-y-3 text-sm leading-relaxed text-gray-600">{children}</div>
    </div>
  );
}
