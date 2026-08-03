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
export const FOOTER_NAV: { heading: string; links: { label: string; href: string }[] }[] = [
  {
    heading: "PLATFORM",
    links: [
      { label: "AI Assistant",   href: "/features#ai-tutor" },
      { label: "Past Questions", href: "/features#past-questions" },
      { label: "PDF Library",    href: "/courses" },
      { label: "Video Courses",  href: "/courses" },
    ],
  },
  {
    heading: "COMPANY",
    links: [
      { label: "About Us",       href: "/about" },
      { label: "Become a Tutor", href: "/signup?role=tutor" },
      { label: "Blog",           href: "/blog" },
      { label: "Contact",        href: "/contact" },
    ],
  },
  {
    heading: "SUPPORT",
    links: [
      { label: "Help Center",    href: "/help" },
      { label: "Terms of Use",   href: "/terms" },
      { label: "Privacy Policy", href: "/privacy" },
      { label: "FAQ",            href: "/faq" },
    ],
  },
];
