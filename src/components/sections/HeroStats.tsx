import Image from "next/image";

const avatars = [
  { src: "/pic(1).png", alt: "Student 1" },
  { src: "/pic 2.png", alt: "Student 2" },
  { src: "/Img_margin.png", alt: "Student 3" },
];

export default function HeroStats() {
  return (
    <div className="mt-8 flex items-center gap-3">
      <div className="flex -space-x-2.5">
        {avatars.map((avatar, i) => (
          <div
            key={i}
            className="relative h-10 w-10 overflow-hidden rounded-full border-2 border-white bg-gray-200 shadow-sm"
          >
            <Image src={avatar.src} alt={avatar.alt} fill className="object-cover" />
          </div>
        ))}
      </div>
      <p className="text-sm leading-snug text-gray-500">
        Trusted by{" "}
        <span className="font-semibold text-blue-600">2,500+</span>{" "}
        students across Cameroon&apos;s top institutions.
      </p>
    </div>
  );
}