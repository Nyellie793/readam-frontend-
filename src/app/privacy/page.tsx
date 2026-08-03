import type { Metadata } from "next";
import Link from "next/link";
import PageShell, { Article } from "@/components/layout/PageShell";
import { CONTACT } from "@/constants/branding";

export const metadata: Metadata = {
  title: "Privacy Policy | ReadAM",
  description:
    "What data ReadAM collects, why we collect it, who we share it with, how long we keep it, and how to exercise your rights.",
};

export default function PrivacyPage() {
  return (
    <PageShell
      eyebrow="Legal"
      title={<>Privacy <span className="text-blue-600">Policy</span></>}
      intro="What we collect, why we collect it, and what you can do about it. We have written this in plain language rather than legal boilerplate."
      meta="Last updated 3 August 2026"
    >
      <div className="mb-8 rounded-2xl border border-orange-200 bg-orange-50 p-5">
        <p className="text-sm font-semibold text-orange-900">Draft pending legal review</p>
        <p className="mt-1.5 text-sm leading-relaxed text-orange-900/80">
          This policy describes ReadAM&apos;s actual data practices and is a working draft. It has
          not been reviewed by a qualified data-protection lawyer. Confirm it against Cameroon&apos;s
          Law No. 2024/017 on personal data protection before relying on it.
        </p>
      </div>

      <Article heading="1. What we collect">
        <p>We collect only what we need to run the platform:</p>
        <ul className="ml-5 list-disc space-y-1.5">
          <li>
            <strong className="text-gray-800">Account details</strong>: your name, email address,
            and optionally a phone number and profile photo.
          </li>
          <li>
            <strong className="text-gray-800">Learning activity</strong>: courses you enrol in,
            lessons you complete, your position in a video, XP, streaks and badges.
          </li>
          <li>
            <strong className="text-gray-800">AI tutor conversations</strong>: the messages you send
            and receive, and any file you attach to a session.
          </li>
          <li>
            <strong className="text-gray-800">Payment records</strong>: amount, currency, status,
            product and the mobile money network used. We do <em>not</em> receive or store your
            mobile money PIN, and we do not store full payment credentials.
          </li>
          <li>
            <strong className="text-gray-800">Onboarding preferences</strong>: the subjects and
            goals you select, used to recommend courses.
          </li>
          <li>
            <strong className="text-gray-800">Technical data</strong>: the information your browser
            sends with each request, such as device type and approximate location, used for security
            and to diagnose faults.
          </li>
        </ul>
      </Article>

      <Article heading="2. Why we use it">
        <ul className="ml-5 list-disc space-y-1.5">
          <li>To give you access to the courses and credits you have paid for.</li>
          <li>To generate AI tutoring responses, quizzes, revision notes and study plans.</li>
          <li>To recommend courses based on the interests you told us about.</li>
          <li>To track your progress, streaks and achievements.</li>
          <li>To process payments and keep the billing history you can see in Settings.</li>
          <li>To send service messages such as payment confirmations and study reminders.</li>
          <li>To keep accounts secure and investigate misuse.</li>
        </ul>
        <p>
          We do not sell your personal data, and we do not use your AI conversations to advertise to
          you.
        </p>
      </Article>

      <Article heading="3. AI processing">
        <p>
          When you use the AI tutor, your message and any attachment are sent to a third-party AI
          model provider to generate a response. Do not paste anything into the tutor you would not
          want processed by a third party, including identity documents, passwords or someone
          else&apos;s personal information.
        </p>
        <p>
          Your conversations are stored against your account so you can resume a session and review
          past summaries. You can ask us to delete them.
        </p>
      </Article>

      <Article heading="4. Who we share with">
        <p>We share data only with the providers that make the service work:</p>
        <ul className="ml-5 list-disc space-y-1.5">
          <li>Our mobile money payment provider, to take and confirm payments.</li>
          <li>Our AI model provider, to generate tutoring responses.</li>
          <li>Our cloud hosting and file storage providers, to run the platform and store uploads.</li>
          <li>Our email provider, to send service messages.</li>
        </ul>
        <p>
          We may also disclose data where the law requires it. If ReadAM is ever sold or merged, we
          will tell you before your data moves to a new controller.
        </p>
      </Article>

      <Article heading="5. Where your data is stored">
        <p>
          ReadAM runs on cloud infrastructure that may process and store data outside Cameroon.
          Where data leaves the country we rely on our providers&apos; contractual safeguards to keep
          it protected to the standard described here.
        </p>
      </Article>

      <Article heading="6. How long we keep it">
        <ul className="ml-5 list-disc space-y-1.5">
          <li><strong className="text-gray-800">Account and learning data</strong>: while your account is open.</li>
          <li><strong className="text-gray-800">AI conversations</strong>: while your account is open, or until you delete them.</li>
          <li><strong className="text-gray-800">Payment records</strong>: retained after account closure where accounting law requires it.</li>
          <li><strong className="text-gray-800">Technical logs</strong>: a short rolling window for security and diagnostics.</li>
        </ul>
        <p>When you close your account we delete or anonymise the rest.</p>
      </Article>

      <Article heading="7. Your rights">
        <p>You can ask us to:</p>
        <ul className="ml-5 list-disc space-y-1.5">
          <li>show you the personal data we hold about you;</li>
          <li>correct anything inaccurate (you can edit most of it yourself in Settings);</li>
          <li>delete your account and associated data;</li>
          <li>export your data in a portable format;</li>
          <li>stop sending you non-essential email.</li>
        </ul>
        <p>
          Email{" "}
          <a className="font-semibold text-blue-600 hover:underline" href={`mailto:${CONTACT.email}`}>
            {CONTACT.email}
          </a>{" "}
          and we will respond within 30 days. You can also complain to Cameroon&apos;s data
          protection authority.
        </p>
      </Article>

      <Article heading="8. Security">
        <p>
          Access to the platform requires authentication, traffic is encrypted in transit, and
          uploaded files are stored in access-controlled cloud storage. No system is perfectly
          secure, so please use a strong, unique password and tell us immediately if you think your
          account has been accessed by someone else.
        </p>
      </Article>

      <Article heading="9. Cookies and local storage">
        <p>
          We store a small amount of data in your browser to keep you signed in and remember your
          preferences. These are strictly necessary for the platform to function. We do not use
          advertising or cross-site tracking cookies. Clearing your browser storage signs you out.
        </p>
      </Article>

      <Article heading="10. Children">
        <p>
          ReadAM is built for secondary school students, and many are under 18. We collect the
          minimum needed to teach them. If you are a parent or guardian and want to review or delete
          your child&apos;s data, contact us and we will help.
        </p>
      </Article>

      <Article heading="11. Changes and contact">
        <p>
          If we make a material change to this policy we will tell you in the app or by email before
          it takes effect.
        </p>
        <p>
          Questions? Email{" "}
          <a className="font-semibold text-blue-600 hover:underline" href={`mailto:${CONTACT.email}`}>
            {CONTACT.email}
          </a>{" "}
          or see our{" "}
          <Link className="font-semibold text-blue-600 hover:underline" href="/terms">
            Terms of Use
          </Link>
          .
        </p>
      </Article>
    </PageShell>
  );
}
