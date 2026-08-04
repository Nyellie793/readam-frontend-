import Link from "next/link";

import { Mail } from "lucide-react";

import {
  FaFacebook,
  FaInstagram,
  FaLinkedinIn,
  FaXTwitter,
} from "react-icons/fa6";

import { getTranslations } from "next-intl/server";
import Logo from "../shared/Logo";
import { CONTACT, FOOTER_NAV, SOCIAL_LINKS, type SocialKey } from "@/constants/branding";

const SOCIALS: { key: SocialKey; label: string; Icon: typeof FaFacebook }[] = [
  { key: "facebook",  label: "ReadAM on Facebook",  Icon: FaFacebook },
  { key: "instagram", label: "ReadAM on Instagram", Icon: FaInstagram },
  { key: "x",         label: "ReadAM on X",         Icon: FaXTwitter },
  { key: "linkedin",  label: "ReadAM on LinkedIn",  Icon: FaLinkedinIn },
];

const socialClass =
  "flex h-10 w-10 items-center justify-center rounded-xl bg-blue-900 transition-all hover:-translate-y-1 hover:bg-orange-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-400";

const linkClass =
  "w-fit transition-all hover:translate-x-1 hover:text-orange-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-400";

export default async function Footer() {
  const t = await getTranslations("footer");
  // Only render icons that have a real profile URL. An icon pointing at "#" is
  // a dead control. Fill in SOCIAL_LINKS and they appear automatically.
  const socials = SOCIALS.filter((s) => SOCIAL_LINKS[s.key]);

  return (
    <footer className="bg-[#071B4D] text-white safe-bottom">
      <div className="mx-auto max-w-7xl px-6 py-16">
        <div className="grid gap-12 lg:grid-cols-5">

          {/* Left */}
          <div className="lg:col-span-2">
            <Logo />

            <p className="mt-6 max-w-sm leading-7 text-gray-300">
              {t("tagline")}
            </p>

            <div className="mt-6 space-y-3">
              <a
                href={`mailto:${CONTACT.email}`}
                className="flex w-fit items-center gap-3 text-gray-300 transition-colors hover:text-orange-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-400"
              >
                <Mail className="size-4 shrink-0" />
                {CONTACT.email}
              </a>
            </div>

            {socials.length > 0 && (
              <div className="mt-8 flex gap-4">
                {socials.map(({ key, label, Icon }) => (
                  <a
                    key={key}
                    href={SOCIAL_LINKS[key]}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    className={socialClass}
                  >
                    <Icon size={18} aria-hidden="true" />
                  </a>
                ))}
              </div>
            )}
          </div>

          {/* Link columns */}
          {FOOTER_NAV.map((column) => (
            <div key={column.heading}>
              <h3 className="mb-6 font-bold text-orange-500">{t(column.heading)}</h3>

              <nav aria-label={t(column.heading)} className="flex flex-col gap-4">
                {column.links.map((link) => (
                  <Link key={link.label} href={link.href} className={linkClass}>
                    {t(link.label)}
                  </Link>
                ))}
              </nav>
            </div>
          ))}

        </div>

        {/* Bottom */}
        <div className="mt-14 flex flex-col gap-4 border-t border-blue-900 pt-8 text-sm text-gray-400 lg:flex-row lg:items-center lg:justify-between">
          <p>{t("rights", { year: new Date().getFullYear() })}</p>

          <div className="flex gap-8">
            <Link
              href="/privacy"
              className="transition hover:text-orange-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-400"
            >
              {t("privacyPolicy")}
            </Link>
            <Link
              href="/terms"
              className="transition hover:text-orange-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-400"
            >
              {t("termsOfService")}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
