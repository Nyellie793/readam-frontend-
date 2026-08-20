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
import { getTranslations, setRequestLocale } from "next-intl/server";

export const metadata: Metadata = {
  title: "Help Center",
  description:
    "Guides for getting started on ReadAM, paying with mobile money, using AI study credits, studying courses, teaching, and keeping your account secure.",
};


export default async function HelpPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  // Opts this page into static rendering. next-intl renders per request
  // unless it is told the locale up front.
  setRequestLocale(locale);
  const tm = await getTranslations("misc");
  const th = await getTranslations("help");
  const TOPICS = [
    {
      icon: Rocket,
      tone: "bg-blue-50 text-blue-600",
      title: th("t1"),
      desc: th("t1d"),
      links: [
        { label: th("t1a"), href: "/signup" },
        { label: th("t1b"), href: "/courses" },
        { label: th("t1c"), href: "/features" },
      ],
    },
    {
      icon: CreditCard,
      tone: "bg-orange-50 text-orange-500",
      title: th("t2"),
      desc: th("t2d"),
      links: [
        { label: th("t2a"), href: "/faq#payments" },
        { label: th("t2b"), href: "/terms" },
        { label: th("t2c"), href: "/contact" },
      ],
    },
    {
      icon: Sparkles,
      tone: "bg-violet-50 text-violet-600",
      title: th("t3"),
      desc: th("t3d"),
      links: [
        { label: th("t3a"), href: "/faq#the-ai-tutor" },
        { label: th("t3b"), href: "/payment/ai-sessions" },
        { label: th("t3c"), href: "/dashboard/ai-tutor/ai-hub" },
      ],
    },
    {
      icon: BookOpen,
      tone: "bg-teal-50 text-teal-600",
      title: th("t4"),
      desc: th("t4d"),
      links: [
        { label: th("t4a"), href: "/dashboard/courses" },
        { label: th("t4b"), href: "/faq#courses-and-progress" },
      ],
    },
    {
      icon: GraduationCap,
      tone: "bg-emerald-50 text-emerald-600",
      title: th("t5"),
      desc: th("t5d"),
      links: [
        { label: th("t5a"), href: "/signup?role=tutor" },
        { label: th("t5b"), href: "/faq#teaching-on-readam" },
      ],
    },
    {
      icon: ShieldCheck,
      tone: "bg-rose-50 text-rose-600",
      title: th("t6"),
      desc: th("t6d"),
      links: [
        { label: th("t6a"), href: "/forgot-password" },
        { label: th("t6b"), href: "/privacy" },
        { label: th("t6c"), href: "/settings" },
      ],
    },
  ];
  return (
    <PageShell
      eyebrow={th("eyebrow")}
      title={<>{tm("helpTitleLead")} <span className="text-blue-600">{tm("helpTitleAccent")}</span></>}
      intro={th("intro")}
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
          <h3 className="text-lg font-bold text-gray-900">{tm("cannotFind")}</h3>
          <p className="mt-1.5 text-sm leading-relaxed text-gray-500">
            {th("emailOr")}{" "}
            <a className="font-semibold text-blue-600 hover:underline" href={`mailto:${CONTACT.email}`}>
              {CONTACT.email}
            </a>
            .
          </p>
        </div>
        <Link
          href="/contact"
          className="shrink-0 rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-blue-700"
        >
          {th("contactUs")}
        </Link>
      </div>
    </PageShell>
  );
}
