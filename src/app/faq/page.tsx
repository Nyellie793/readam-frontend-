import type { Metadata } from "next";
import Link from "next/link";
import { ChevronDown } from "lucide-react";
import PageShell from "@/components/layout/PageShell";
import { CONTACT } from "@/constants/branding";

export const metadata: Metadata = {
  title: "Frequently Asked Questions | ReadAM",
  description:
    "Answers about ReadAM accounts, mobile money payments in XAF, AI tutor session credits, courses, streaks and tutoring.",
};

/** `id` is the anchor target used by /help and the footer. Keep them in sync. */
const GROUPS: { id: string; title: string; items: { q: string; a: React.ReactNode }[] }[] = [
  {
    id: "getting-started",
    title: "Getting started",
    items: [
      {
        q: "Is ReadAM free?",
        a: (
          <>
            Creating an account is free, and some courses and preview lessons are free to study.
            Paid courses, past-question bundles and AI tutor credits are bought separately, and every
            price is shown in XAF before you pay.
          </>
        ),
      },
      {
        q: "Which exams does ReadAM cover?",
        a: (
          <>
            Content is mapped to the Cameroonian curriculum, with a focus on GCE Ordinary and
            Advanced Level and the Baccalauréat. You can filter by subject and level on the{" "}
            <Link className="font-semibold text-blue-600 hover:underline" href="/courses">
              courses page
            </Link>
            .
          </>
        ),
      },
      {
        q: "Do I need a laptop?",
        a: <>No. ReadAM is built to work on a phone browser. A laptop is fine too, but not required.</>,
      },
    ],
  },
  {
    id: "payments",
    title: "Payments",
    items: [
      {
        q: "How do I pay?",
        a: (
          <>
            By mobile money, either MTN Mobile Money or Orange Money. You enter your number, then approve
            the payment prompt on your handset. We never ask for your PIN.
          </>
        ),
      },
      {
        q: "I paid but nothing happened. What now?",
        a: (
          <>
            Payments confirm through our provider, which occasionally takes a few minutes. The
            checkout screen keeps checking and will update itself. If you were debited and access
            has not opened within 24 hours, email{" "}
            <a className="font-semibold text-blue-600 hover:underline" href={`mailto:${CONTACT.email}`}>
              {CONTACT.email}
            </a>{" "}
            with your transaction reference.
          </>
        ),
      },
      {
        q: "Can I get a refund?",
        a: (
          <>
            Yes, in specific cases: double charges, a debit with no access, or content that is
            materially not as described. See section 5 of the{" "}
            <Link className="font-semibold text-blue-600 hover:underline" href="/terms">
              Terms of Use
            </Link>
            .
          </>
        ),
      },
      {
        q: "Where do I see what I have paid?",
        a: <>Your full billing history is in Settings, under Billing &amp; Plan.</>,
      },
    ],
  },
  {
    id: "the-ai-tutor",
    title: "The AI tutor",
    items: [
      {
        q: "How do AI credits work?",
        a: (
          <>
            One credit starts one study session, which runs for a fixed time shown in the app. Within
            a session you can ask as many questions as you like and generate quizzes, revision notes
            and study plans.
          </>
        ),
      },
      {
        q: "What happens if I close the tab mid-session?",
        a: (
          <>
            Nothing is lost. Returning to the AI chat resumes your active session rather than
            starting, and charging for, a new one.
          </>
        ),
      },
      {
        q: "Can I trust what the AI says?",
        a: (
          <>
            Treat it as a well-informed study partner, not a textbook. It explains method and
            reasoning well, but it can be wrong on specifics. Always check important facts against
            your syllabus before an exam.
          </>
        ),
      },
      {
        q: "Can I upload a photo of a question?",
        a: <>Yes. You can attach an image or PDF to a message and ask the tutor to work through it.</>,
      },
    ],
  },
  {
    id: "courses-and-progress",
    title: "Courses and progress",
    items: [
      {
        q: "How long do I keep access to a course I bought?",
        a: <>Access details are shown on the course before you buy. Where a course has an expiry date, you will see it in your enrolments.</>,
      },
      {
        q: "What are XP and streaks for?",
        a: (
          <>
            They track consistency. You earn XP for studying, and your streak counts consecutive days
            of activity. They are motivational, and do not affect what content you can access.
          </>
        ),
      },
      {
        q: "Can I download course videos?",
        a: <>No. Videos stream in the app. Downloading or re-uploading course content is not permitted.</>,
      },
    ],
  },
  {
    id: "teaching-on-readam",
    title: "Teaching on ReadAM",
    items: [
      {
        q: "How do I become a tutor?",
        a: (
          <>
            Create a{" "}
            <Link className="font-semibold text-blue-600 hover:underline" href="/signup?role=tutor">
              tutor account
            </Link>
            , complete onboarding, and submit your profile for verification. Once verified you can
            build and publish courses.
          </>
        ),
      },
      {
        q: "How and when do I get paid?",
        a: (
          <>
            You earn a share of each sale, net of the platform fee shown in your tutor dashboard.
            Earnings accumulate in your balance and you request a payout to your mobile money number.
          </>
        ),
      },
      {
        q: "Does my course get reviewed?",
        a: <>Yes. Submitted courses are reviewed by an admin before they go live to students.</>,
      },
    ],
  },
];

export default function FaqPage() {
  return (
    <PageShell
      eyebrow="Support"
      title={<>Frequently asked <span className="text-blue-600">questions</span></>}
      intro="The things students and tutors ask us most. If your question is not here, we are one email away."
    >
      <div className="space-y-12">
        {GROUPS.map((group) => (
          <div key={group.id} id={group.id} className="scroll-mt-24">
            <h2 className="text-xs font-bold uppercase tracking-widest text-orange-500">
              {group.title}
            </h2>

            <div className="mt-4 divide-y divide-gray-100 overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
              {group.items.map((item) => (
                <details key={item.q} className="group">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 text-sm font-semibold text-gray-900 transition-colors hover:bg-gray-50 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-blue-600">
                    {item.q}
                    <ChevronDown className="size-4 shrink-0 text-gray-400 transition-transform group-open:rotate-180" />
                  </summary>
                  <div className="px-5 pb-5 text-sm leading-relaxed text-gray-600">{item.a}</div>
                </details>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-14 rounded-2xl border border-gray-100 bg-white p-6 text-center shadow-sm">
        <h3 className="text-lg font-bold text-gray-900">Still stuck?</h3>
        <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-gray-500">
          Send us the details and we will get back to you within one working day.
        </p>
        <Link
          href="/contact"
          className="mt-5 inline-block rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-blue-700"
        >
          Contact support
        </Link>
      </div>
    </PageShell>
  );
}
