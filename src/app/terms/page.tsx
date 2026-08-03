import type { Metadata } from "next";
import Link from "next/link";
import PageShell, { Article } from "@/components/layout/PageShell";
import { CONTACT } from "@/constants/branding";

export const metadata: Metadata = {
  title: "Terms of Use | ReadAM",
  description:
    "The terms governing your use of ReadAM, including accounts, payments in XAF, AI session credits, tutor obligations and refunds.",
};

export default function TermsPage() {
  return (
    <PageShell
      eyebrow="Legal"
      title={<>Terms of <span className="text-blue-600">Use</span></>}
      intro="These terms govern your use of ReadAM. By creating an account you agree to them, so please read them before you sign up."
      meta="Last updated 3 August 2026"
    >
      <div className="mb-8 rounded-2xl border border-orange-200 bg-orange-50 p-5">
        <p className="text-sm font-semibold text-orange-900">Draft pending legal review</p>
        <p className="mt-1.5 text-sm leading-relaxed text-orange-900/80">
          This document describes how ReadAM actually operates and is a working draft. It has not yet
          been reviewed by a qualified lawyer admitted in Cameroon. Have it reviewed before you rely
          on it commercially.
        </p>
      </div>

      <Article heading="1. Who we are">
        <p>
          ReadAM is an online learning platform for students in Cameroon, offering courses, past
          questions and an AI study tutor mapped to the GCE and Baccalauréat syllabi. In these terms,
          &ldquo;we&rdquo;, &ldquo;us&rdquo; and &ldquo;ReadAM&rdquo; mean the operator of this
          platform, and &ldquo;you&rdquo; means the person using it.
        </p>
      </Article>

      <Article heading="2. Your account">
        <p>
          You need an account to access most of ReadAM. You agree to give accurate information, keep
          your password confidential, and tell us promptly if you believe someone else has accessed
          your account.
        </p>
        <p>
          Accounts are personal. Sharing your login so that others can use content you paid for is a
          breach of these terms and may result in suspension.
        </p>
        <p>
          If you are under 18, you may use ReadAM with the knowledge of a parent or guardian, who
          accepts these terms on your behalf.
        </p>
      </Article>

      <Article heading="3. Payments and pricing">
        <p>
          All prices are shown in Central African Francs (XAF) and include any taxes we are required
          to collect. Payments are taken by mobile money through our payment provider, MTN Mobile
          Money or Orange Money, and you authorise each payment on your own handset.
        </p>
        <p>
          A payment is only complete once our payment provider confirms it. Until then the
          transaction shows as pending. If you are debited but your access does not open within
          24 hours, contact us at{" "}
          <a className="font-semibold text-blue-600 hover:underline" href={`mailto:${CONTACT.email}`}>
            {CONTACT.email}
          </a>{" "}
          with your transaction reference and we will resolve it.
        </p>
        <p>
          We never ask for your mobile money PIN. Anyone who does is not acting for ReadAM.
        </p>
      </Article>

      <Article heading="4. AI study sessions">
        <p>
          AI tutoring is sold as session credits. A credit is consumed when a session starts, and
          each session runs for a fixed period shown in the app before it expires. Unused credits
          remain on your account until their stated expiry date.
        </p>
        <p>
          The AI tutor is a study aid, not a substitute for your teacher or your own work. It can be
          wrong. Always verify important facts before relying on them in an examination or
          assessment. We are not responsible for examination outcomes.
        </p>
        <p>
          Do not use the AI tutor to produce work you will present as your own where your school
          prohibits it. Academic-honesty rules are set by your institution, not by us.
        </p>
      </Article>

      <Article id="refunds" heading="5. Refunds">
        <p>
          Because course content and AI credits are delivered immediately, purchases are generally
          final. We will, however, refund you where:
        </p>
        <ul className="ml-5 list-disc space-y-1.5">
          <li>you were charged more than once for the same purchase;</li>
          <li>you were debited but access never opened and we cannot fix it;</li>
          <li>the content you bought is materially not as described.</li>
        </ul>
        <p>
          Request a refund within 14 days of the charge by emailing us with your transaction
          reference. Approved refunds are returned to the mobile money account used to pay.
        </p>
      </Article>

      <Article heading="6. Tutors and course content">
        <p>
          Tutors publish courses on ReadAM and keep ownership of the material they upload. By
          publishing, a tutor grants us a licence to host, display and distribute that material to
          students on the platform.
        </p>
        <p>
          Tutors must have the right to everything they upload. Uploading material that infringes
          someone else&apos;s copyright will result in its removal and may end the tutor&apos;s
          account.
        </p>
        <p>
          Courses are reviewed before publication, but review is not a guarantee of accuracy. Tutor
          earnings, the platform fee and payout timing are set out in the tutor dashboard.
        </p>
      </Article>

      <Article heading="7. What you may not do">
        <ul className="ml-5 list-disc space-y-1.5">
          <li>Download, record, re-upload or resell course content you did not create.</li>
          <li>Share account credentials, or use one account for several people.</li>
          <li>Attempt to bypass payment, access controls or usage limits.</li>
          <li>Upload unlawful, harmful or infringing material.</li>
          <li>Scrape, probe or disrupt the platform or its infrastructure.</li>
        </ul>
      </Article>

      <Article heading="8. Availability">
        <p>
          We work to keep ReadAM available, but we do not promise uninterrupted service. We may
          suspend access for maintenance, and we may change or withdraw features. Where a change
          materially reduces something you have paid for, we will offer a pro-rata refund.
        </p>
      </Article>

      <Article heading="9. Liability">
        <p>
          Nothing here limits liability that cannot lawfully be limited. Subject to that, our total
          liability to you in connection with ReadAM is limited to the amount you paid us in the
          twelve months before the claim, and we are not liable for indirect or consequential loss,
          including examination results.
        </p>
      </Article>

      <Article heading="10. Ending your access">
        <p>
          You may stop using ReadAM at any time and ask us to delete your account. See our{" "}
          <Link className="font-semibold text-blue-600 hover:underline" href="/privacy">
            Privacy Policy
          </Link>
          . We may suspend or end access if you materially breach these terms, and we will tell you
          why unless we are legally prevented from doing so.
        </p>
      </Article>

      <Article heading="11. Changes and governing law">
        <p>
          We may update these terms. If a change is material we will notify you in the app or by
          email before it takes effect. Continuing to use ReadAM after that means you accept the
          updated terms.
        </p>
        <p>
          These terms are governed by the laws of the Republic of Cameroon, and the courts of
          Cameroon have jurisdiction over any dispute.
        </p>
      </Article>

      <Article heading="12. Contact">
        <p>
          Questions about these terms? Email{" "}
          <a className="font-semibold text-blue-600 hover:underline" href={`mailto:${CONTACT.email}`}>
            {CONTACT.email}
          </a>{" "}
          or visit our{" "}
          <Link className="font-semibold text-blue-600 hover:underline" href="/contact">
            contact page
          </Link>
          .
        </p>
      </Article>
    </PageShell>
  );
}
