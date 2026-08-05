import type { Metadata } from "next";
import Link from "next/link";
import PageShell, { Article } from "@/components/layout/PageShell";
import { CONTACT } from "@/constants/branding";
import { getTranslations } from "next-intl/server";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "What data ReadAM collects, why we collect it, who we share it with, how long we keep it, and how to exercise your rights.",
};

export default async function PrivacyPage() {
  const tm = await getTranslations("misc");
  const t = await getTranslations("privacy");

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
        <p>{tm("pCollectIntro")}</p>
        <ul className="ml-5 list-disc space-y-1.5">
          <li>
            <strong className="text-gray-800">{tm("pAccount")}</strong>: {t("c1")}
          </li>
          <li>
            <strong className="text-gray-800">{tm("pLearning")}</strong>: {t("c2")}
          </li>
          <li>
            <strong className="text-gray-800">{tm("pConversations")}</strong>: {t("c3")}
          </li>
          <li>
            <strong className="text-gray-800">{tm("pPayments")}</strong>: {t("c4pre")}{" "}
            <em>{t("c4em")}</em> {t("c4post")}
          </li>
          <li>
            <strong className="text-gray-800">{tm("pOnboarding")}</strong>: {t("c5")}
          </li>
          <li>
            <strong className="text-gray-800">{tm("pTechnical")}</strong>: {t("c6")}
          </li>
        </ul>
      </Article>

      <Article heading={t("h2")}>
        <ul className="ml-5 list-disc space-y-1.5">
          <li>{tm("pUse1")}</li>
          <li>{tm("pUse2")}</li>
          <li>{tm("pUse3")}</li>
          <li>{tm("pUse4")}</li>
          <li>{tm("pUse5")}</li>
          <li>{tm("pUse6")}</li>
          <li>{tm("pUse7")}</li>
        </ul>
        <p>{t("p2a")}</p>
      </Article>

      <Article heading={t("h3")}>
        <p>{t("p3a")}</p>
        <p>{t("p3b")}</p>
      </Article>

      <Article heading={t("h4")}>
        <p>{tm("pShareIntro")}</p>
        <ul className="ml-5 list-disc space-y-1.5">
          <li>{tm("pShare1")}</li>
          <li>{tm("pShare2")}</li>
          <li>{tm("pShare3")}</li>
          <li>{tm("pShare4")}</li>
        </ul>
        <p>{t("p4a")}</p>
      </Article>

      <Article heading={t("h5")}>
        <p>{t("p5a")}</p>
      </Article>

      <Article heading={t("h6")}>
        <ul className="ml-5 list-disc space-y-1.5">
          <li>
            <strong className="text-gray-800">{tm("pKeep1")}</strong>: {t("k1")}
          </li>
          <li>
            <strong className="text-gray-800">{tm("pKeep2")}</strong>: {t("k2")}
          </li>
          <li>
            <strong className="text-gray-800">{tm("pPayments")}</strong>: {t("k3")}
          </li>
          <li>
            <strong className="text-gray-800">{tm("pKeep4")}</strong>: {t("k4")}
          </li>
        </ul>
        <p>{tm("pDeleteRest")}</p>
      </Article>

      <Article heading={t("h7")}>
        <p>{tm("pRightsIntro")}</p>
        <ul className="ml-5 list-disc space-y-1.5">
          <li>{t("r1")}</li>
          <li>{t("r2")}</li>
          <li>{t("r3")}</li>
          <li>{t("r4")}</li>
          <li>{t("r5")}</li>
        </ul>
        <p>{t.rich("p7a", { mail })}</p>
      </Article>

      <Article heading={t("h8")}>
        <p>{t("p8a")}</p>
      </Article>

      <Article heading={t("h9")}>
        <p>{t("p9a")}</p>
      </Article>

      <Article heading={t("h10")}>
        <p>{t("p10a")}</p>
      </Article>

      <Article heading={t("h11")}>
        <p>{t("p11a")}</p>
        <p>
          {t.rich("p11b", {
            mail,
            terms: (chunks) => (
              <Link className="font-semibold text-blue-600 hover:underline" href="/terms">
                {chunks}
              </Link>
            ),
          })}
        </p>
      </Article>
    </PageShell>
  );
}
