import type { Metadata } from "next";
import Link from "next/link";
import {
  Rocket,
  CreditCard,
  Sparkles,
  BookOpen,
  GraduationCap,
  ShieldCheck,
  ArrowRight,
} from "lucide-react";
import PageShell from "@/components/layout/PageShell";
import { CONTACT } from "@/constants/branding";

export const metadata: Metadata = {
  title: "Help Center | ReadAM",
  description:
    "Guides for getting started on ReadAM, paying with mobile money, using AI study credits, studying courses, teaching, and keeping your account secure.",
};

const TOPICS = [
  {
    icon: Rocket,
    tone: "bg-blue-50 text-blue-600",
    title: "Getting started",
    desc: "Create an account, choose your subjects, and find your way around the dashboard.",
    links: [
      { label: "Create a student account", href: "/signup" },
      { label: "Browse the course library", href: "/courses" },
      { label: "What ReadAM includes", href: "/features" },
    ],
  },
  {
    icon: CreditCard,
    tone: "bg-orange-50 text-orange-500",
    title: "Payments & billing",
    desc: "Paying with MTN MoMo or Orange Money, checking a pending payment, and refunds.",
    links: [
      { label: "Payment questions", href: "/faq#payments" },
      { label: "Refund terms", href: "/terms" },
      { label: "Report a failed payment", href: "/contact" },
    ],
  },
  {
    icon: Sparkles,
    tone: "bg-violet-50 text-violet-600",
    title: "The AI tutor",
    desc: "How session credits work, resuming a session, and getting better answers.",
    links: [
      { label: "How credits work", href: "/faq#the-ai-tutor" },
      { label: "Buy more credits", href: "/payment/ai-sessions" },
      { label: "Open the AI Hub", href: "/dashboard/ai-tutor/ai-hub" },
    ],
  },
  {
    icon: BookOpen,
    tone: "bg-teal-50 text-teal-600",
    title: "Courses & progress",
    desc: "Enrolling, resuming a lesson, and how XP, streaks and badges are calculated.",
    links: [
      { label: "Explore courses", href: "/dashboard/courses" },
      { label: "Progress questions", href: "/faq#courses-and-progress" },
    ],
  },
  {
    icon: GraduationCap,
    tone: "bg-emerald-50 text-emerald-600",
    title: "Teaching on ReadAM",
    desc: "Getting verified, building a course, submitting for review, and requesting payouts.",
    links: [
      { label: "Become a tutor", href: "/signup?role=tutor" },
      { label: "Tutor questions", href: "/faq#teaching-on-readam" },
    ],
  },
  {
    icon: ShieldCheck,
    tone: "bg-rose-50 text-rose-600",
    title: "Account & security",
    desc: "Passwords, keeping your account safe, and controlling your personal data.",
    links: [
      { label: "Reset your password", href: "/forgot-password" },
      { label: "Your privacy rights", href: "/privacy" },
      { label: "Account settings", href: "/settings" },
    ],
  },
];

export default function HelpPage() {
  return (
    <PageShell
      eyebrow="Help Center"
      title={<>How can we <span className="text-blue-600">help?</span></>}
      intro="Pick a topic below, or jump straight to the FAQ. Anything we have not covered, our team will answer directly."
    >
      <div className="grid gap-5 sm:grid-cols-2">
        {TOPICS.map((t) => {
          const Icon = t.icon;
          return (
            <div
              key={t.title}
              className="flex flex-col rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition-all hover:-translate-y-1 hover:shadow-md"
            >
              <span className={`flex size-11 items-center justify-center rounded-xl ${t.tone}`}>
                <Icon className="size-5" />
              </span>
              <h2 className="mt-4 text-base font-bold text-gray-900">{t.title}</h2>
              <p className="mt-1.5 text-sm leading-relaxed text-gray-500">{t.desc}</p>

              <div className="mt-4 flex flex-col gap-2 border-t border-gray-50 pt-4">
                {t.links.map((l) => (
                  <Link
                    key={l.href + l.label}
                    href={l.href}
                    className="group inline-flex items-center gap-1.5 text-sm font-semibold text-blue-600 transition-colors hover:text-blue-700"
                  >
                    {l.label}
                    <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
                  </Link>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-12 flex flex-col items-center gap-4 rounded-2xl border border-gray-100 bg-white p-8 text-center shadow-sm sm:flex-row sm:justify-between sm:text-left">
        <div>
          <h3 className="text-lg font-bold text-gray-900">Cannot find what you need?</h3>
          <p className="mt-1.5 text-sm leading-relaxed text-gray-500">
            Email{" "}
            <a className="font-semibold text-blue-600 hover:underline" href={`mailto:${CONTACT.email}`}>
              {CONTACT.email}
            </a>{" "}
            or call {CONTACT.phone}, Monday to Saturday.
          </p>
        </div>
        <Link
          href="/contact"
          className="shrink-0 rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-blue-700"
        >
          Contact us
        </Link>
      </div>
    </PageShell>
  );
}
