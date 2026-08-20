import type { Metadata } from "next";
import Link from "next/link";
import PageShell, { Article } from "@/components/layout/PageShell";
import { CONTACT } from "@/constants/branding";
import { getTranslations, setRequestLocale } from "next-intl/server";

export const metadata: Metadata = {
  title: "Terms of Use",
  description:
    "The terms governing your use of ReadAM, including accounts, payments in XAF, AI session credits, tutor obligations and refunds.",
};

export default async function TermsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  // Opts this page into static rendering. next-intl renders per request
  // unless it is told the locale up front.
  setRequestLocale(locale);
  const tm = await getTranslations("misc");
  const t = await getTranslations("terms");

  // Shared inline-link renderers for the paragraphs that contain them.
  const mail = () => (
    <a className="font-semibold text-blue-600 hover:underline" href={`mailto:${CONTACT.email}`}>
      {CONTACT.email}
    </a>
  );

  return (
    <PageShell
      eyebrow={t("eyebrow")}
      title={
        <>
          {t("titleLead")} <span className="text-blue-600">{t("titleAccent")}</span>
        </>
      }
      intro={t("intro")}
      meta={t("meta")}
    >
      <div className="mb-8 rounded-2xl border border-orange-200 bg-orange-50 p-5">
        <p className="text-sm font-semibold text-orange-900">{tm("draftReview")}</p>
        <p className="mt-1.5 text-sm leading-relaxed text-orange-900/80">{t("draftBody")}</p>
      </div>

      <Article heading={t("h1")}>
        <p>{t("p1a")}</p>
      </Article>

      <Article heading={t("h2")}>
        <p>{t("p2a")}</p>
        <p>{t("p2b")}</p>
        <p>{t("p2c")}</p>
      </Article>

      <Article heading={t("h3")}>
        <p>{t("p3a")}</p>
        <p>{t.rich("p3b", { mail })}</p>
        <p>{t("p3c")}</p>
      </Article>

      <Article heading={t("h4")}>
        <p>{t("p4a")}</p>
        <p>{t("p4b")}</p>
        <p>{t("p4c")}</p>
      </Article>

      <Article id="refunds" heading={t("h5")}>
        <p>{t("p5a")}</p>
        <ul className="ml-5 list-disc space-y-1.5">
          <li>{t("l5a")}</li>
          <li>{t("l5b")}</li>
          <li>{t("l5c")}</li>
        </ul>
        <p>{t("p5b")}</p>
      </Article>

      <Article heading={t("h6")}>
        <p>{t("p6a")}</p>
        <p>{t("p6b")}</p>
        <p>{t("p6c")}</p>
      </Article>

      <Article heading={t("h7")}>
        <ul className="ml-5 list-disc space-y-1.5">
          <li>{tm("tNoResell")}</li>
          <li>{tm("tNoShare")}</li>
          <li>{tm("tNoBypass")}</li>
          <li>{tm("tNoUnlawful")}</li>
          <li>{tm("tNoScrape")}</li>
        </ul>
      </Article>

      <Article heading={t("h8")}>
        <p>{t("p8a")}</p>
      </Article>

      <Article heading={t("h9")}>
        <p>{t("p9a")}</p>
      </Article>

      <Article heading={t("h10")}>
        <p>
          {t.rich("p10a", {
            privacy: (chunks) => (
              <Link className="font-semibold text-blue-600 hover:underline" href="/privacy">
                {chunks}
              </Link>
            ),
          })}
        </p>
      </Article>

      <Article heading={t("h11")}>
        <p>{t("p11a")}</p>
        <p>{t("p11b")}</p>
      </Article>

      <Article heading={t("h12")}>
        <p>
          {t.rich("p12a", {
            mail,
            contact: (chunks) => (
              <Link className="font-semibold text-blue-600 hover:underline" href="/contact">
                {chunks}
              </Link>
            ),
          })}
        </p>
      </Article>
    </PageShell>
  );
}
