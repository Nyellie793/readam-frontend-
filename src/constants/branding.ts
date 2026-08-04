export const BRAND = {
    name: "ReadAm",
    primary: "#2563EB",
    accent: "#F97316"
}

/** Where to reach us. Rendered as real mailto:/tel: links, not plain text. */
export const CONTACT = {
  email: "hello@readam.ai",
  phone: "+237 679 545 186",
  /** tel: needs the number with no spaces or separators. */
  phoneHref: "+237679545186",
  location: "Douala, Cameroon",
} as const;

/**
 * Social profiles. Leave a value empty and the footer skips that icon entirely,
 * because an icon linking to "#" is a dead control.
 * Paste the real profile URLs here and they appear automatically.
 */
export const SOCIAL_LINKS = {
  facebook: "",  // TODO: https://facebook.com/…
  instagram: "", // TODO: https://instagram.com/…
  x: "",         // TODO: https://x.com/…
  linkedin: "",  // TODO: https://linkedin.com/company/…
} as const;

export type SocialKey = keyof typeof SOCIAL_LINKS;

/**
 * Footer navigation. Every href here must resolve to a real route. If a
 * destination does not exist yet, leave the entry out rather than pointing it
 * at "#".
 */
/** `heading` and `label` are i18n keys under the `footer` namespace. */
export const FOOTER_NAV: { heading: string; links: { label: string; href: string }[] }[] = [
  {
    heading: "platform",
    links: [
      { label: "aiAssistant",   href: "/features#ai-tutor" },
      { label: "pastQuestions", href: "/features#past-questions" },
      { label: "pdfLibrary",    href: "/courses" },
      { label: "videoCourses",  href: "/courses" },
    ],
  },
  {
    heading: "company",
    links: [
      { label: "aboutUs",       href: "/about" },
      { label: "becomeTutor", href: "/signup?role=tutor" },
      { label: "blog",           href: "/blog" },
      { label: "contact",        href: "/contact" },
    ],
  },
  {
    heading: "support",
    links: [
      { label: "helpCenter",    href: "/help" },
      { label: "termsOfUse",   href: "/terms" },
      { label: "privacyPolicy", href: "/privacy" },
      { label: "faq",            href: "/faq" },
    ],
  },
];
