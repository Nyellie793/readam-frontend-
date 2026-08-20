import Image from "next/image";
import { getTranslations } from "next-intl/server";

const avatars = [
  { src: "/pic(1).png", alt: "Student 1" },
  { src: "/pic 2.png", alt: "Student 2" },
  { src: "/Img_margin.png", alt: "Student 3" },
];

export default async function HeroStats() {
  const t = await getTranslations("home");
  return (
    <div className="mt-8 flex items-center gap-3">
      <div className="flex -space-x-2.5">
        {avatars.map((avatar, i) => (
          <div
            key={i}
            className="relative h-10 w-10 overflow-hidden rounded-full border-2 border-white bg-gray-200 shadow-sm"
          >
            <Image src={avatar.src} alt={avatar.alt} fill sizes="40px" className="object-cover" />
          </div>
        ))}
      </div>
      <p className="text-sm leading-snug text-gray-500">
        {t("trustedByLead")}{" "}
        <span className="font-semibold text-blue-600">2,500+</span>{" "}
        {t("trustedByTail")}
      </p>
    </div>
  );
}