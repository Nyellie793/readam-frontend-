import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Tutors",
  description:
    "Meet the tutors teaching on ReadAM, with their subjects, experience and published courses.",
  alternates: { canonical: "/tutors" },
};

export default function TutorsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
