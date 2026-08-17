import type { Metadata } from "next";
import Link from "next/link";
import { Mail, MapPin, LifeBuoy, GraduationCap, CreditCard } from "lucide-react";
import PageShell from "@/components/layout/PageShell";
import { CONTACT } from "@/constants/branding";
import { getTranslations } from "next-intl/server";

export const metadata: Metadata = {
  title: "Contact ReadAM",
  description:
    "Reach the ReadAM team about your account, a payment, becoming a tutor, or anything else. Email support for students across Cameroon.",
};



export default async function ContactPage() {
  const t = await getTranslations("contact");
  const CHANNELS = [
    {
      icon: Mail,
      label: t("emailUs"),
      value: CONTACT.email,
      href: `mailto:${CONTACT.email}`,
      note: t("emailNote"),
      tone: "bg-blue-50 text-blue-600",
    },
    {
      icon: MapPin,
      label: t("whereWeAre"),
      value: CONTACT.location,
      href: null,
      note: t("whereNote"),
      tone: "bg-teal-50 text-teal-600",
    },
  ];
  const ROUTES = [
    {
      icon: CreditCard,
      title: t("r1"),
      body: t("r1b"),
      action: { label: t("r1c"), href: "/terms#refunds" },
    },
    {
      icon: GraduationCap,
      title: t("r2"),
      body: t("r2b"),
      action: { label: t("r2c"), href: "/signup?role=tutor" },
    },
    {
      icon: LifeBuoy,
      title: t("r3"),
      body: t("r3b"),
      action: { label: t("r3c"), href: "/help" },
    },
  ];
  return (
    <PageShell
      eyebrow={t("eyebrow")}
      title={<>{t("titleLead")} <span className="text-blue-600">{t("titleAccent")}</span></>}
      intro={t("intro")}
    >
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {CHANNELS.map((c) => {
          const Icon = c.icon;
          const inner = (
            <>
              <span className={`flex size-11 items-center justify-center rounded-xl ${c.tone}`}>
                <Icon className="size-5" />
              </span>
              <p className="mt-4 text-xs font-semibold uppercase tracking-widest text-gray-400">
                {c.label}
              </p>
              <p className="mt-1.5 text-base font-bold text-gray-900 break-words">{c.value}</p>
              <p className="mt-2 text-sm leading-relaxed text-gray-500">{c.note}</p>
            </>
          );

          return c.href ? (
            <a
              key={c.label}
              href={c.href}
              className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition-all hover:-translate-y-1 hover:border-blue-200 hover:shadow-md"
            >
              {inner}
            </a>
          ) : (
            <div key={c.label} className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
              {inner}
            </div>
          );
        })}
      </div>

      <h2 className="mt-14 text-2xl font-black text-gray-900">{t("fasterTitle")}</h2>
      <div className="mt-5 space-y-4">
        {ROUTES.map((r) => {
          const Icon = r.icon;
          return (
            <div
              key={r.title}
              className="flex flex-col gap-4 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm sm:flex-row sm:items-center"
            >
              <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-gray-50 text-gray-500">
                <Icon className="size-5" />
              </span>
              <div className="min-w-0 flex-1">
                <h3 className="text-base font-bold text-gray-900">{r.title}</h3>
                <p className="mt-1 text-sm leading-relaxed text-gray-500">{r.body}</p>
              </div>
              <Link
                href={r.action.href}
                className="shrink-0 rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-semibold text-gray-700 transition-colors hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700"
              >
                {r.action.label}
              </Link>
            </div>
          );
        })}
      </div>

      <div className="mt-12 rounded-2xl border border-blue-100 bg-blue-50/50 p-6">
        <h3 className="text-sm font-bold text-blue-950">{t("safetyTitle")}</h3>
        <p className="mt-1.5 text-sm leading-relaxed text-blue-900/80">
          ReadAM will never ask for your mobile money PIN, your password, or a payment sent to a
          personal number. If someone contacts you claiming to be from ReadAM and asks for any of
          those, it is a scam. Please report it to{" "}
          <a className="font-semibold text-blue-700 hover:underline" href={`mailto:${CONTACT.email}`}>
            {CONTACT.email}
          </a>
          .
        </p>
      </div>
    </PageShell>
  );
}
