import type { Metadata } from "next";
import Link from "next/link";
import { PenLine, Mail } from "lucide-react";
import PageShell from "@/components/layout/PageShell";
import { CONTACT } from "@/constants/branding";

export const metadata: Metadata = {
  title: "Blog | ReadAM",
  description:
    "Study guides, exam technique and product updates from the ReadAM team. The first articles are on the way.",
};

/**
 * No posts yet. Rather than shipping invented articles, this is an honest empty
 * state that points readers at the study material that does exist. Replace the
 * empty state with a post list once the first articles are written.
 */
const PLANNED = [
  "How to build a GCE revision timetable that survives contact with real life",
  "Past questions: the right way and the wrong way to use them",
  "Getting better answers out of an AI tutor: five prompts that work",
  "What examiners actually reward in Baccalauréat essay questions",
];

export default function BlogPage() {
  return (
    <PageShell
      eyebrow="Blog"
      title={<>Study guides and <span className="text-blue-600">exam technique</span></>}
      intro="Practical writing on how to revise, how to use past questions, and how to get the most out of studying with an AI tutor."
    >
      <div className="rounded-2xl border border-gray-100 bg-white p-8 text-center shadow-sm sm:p-12">
        <span className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
          <PenLine className="size-6" />
        </span>

        <h2 className="mt-5 text-2xl font-black text-gray-900">The first posts are being written</h2>
        <p className="mx-auto mt-3 max-w-lg text-sm leading-relaxed text-gray-500">
          We would rather publish nothing than publish filler. Our teaching team is writing the first
          set of guides now. Here is what is coming:
        </p>

        <ul className="mx-auto mt-7 max-w-lg space-y-3 text-left">
          {PLANNED.map((title) => (
            <li
              key={title}
              className="rounded-xl border border-gray-100 bg-gray-50/60 px-4 py-3 text-sm font-medium text-gray-700"
            >
              {title}
            </li>
          ))}
        </ul>

        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <a
            href={`mailto:${CONTACT.email}?subject=${encodeURIComponent("Tell me when the ReadAM blog launches")}`}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-blue-700"
          >
            <Mail className="size-4" />
            Tell me when it launches
          </a>
          <Link
            href="/courses"
            className="inline-flex items-center justify-center rounded-xl border border-gray-200 px-6 py-3 text-sm font-semibold text-gray-700 transition-colors hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700"
          >
            Browse courses instead
          </Link>
        </div>
      </div>

      <div className="mt-8 rounded-2xl border border-orange-200 bg-orange-50 p-6">
        <h3 className="text-sm font-bold text-orange-900">Want to write for us?</h3>
        <p className="mt-1.5 text-sm leading-relaxed text-orange-900/80">
          If you teach the Cameroonian curriculum and have something useful to say to students, we
          will publish it and credit you. Email{" "}
          <a className="font-semibold text-orange-900 hover:underline" href={`mailto:${CONTACT.email}`}>
            {CONTACT.email}
          </a>{" "}
          with a short pitch.
        </p>
      </div>
    </PageShell>
  );
}
