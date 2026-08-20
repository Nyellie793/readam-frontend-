import Image from "next/image";
import { getTranslations } from "next-intl/server";
import Link from "next/link";
import { Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getPublicTutors } from "@/lib/public-api";

const FALLBACK_TUTORS = [
  {
    id: "sarah-jenkins",
    name: "Sarah Jenkins",
    specialty: "English & Literature Specialist",
    image: "/Tutor.png",
    rating: 4.9,
    experience: "10+ Years",
  },
  {
    id: "mike-davis",
    name: "Mike Davis",
    specialty: "Physics & Mathematics Pro",
    image: "/Tutor 2.png",
    rating: 5.0,
    experience: "8+ Years",
  },
  {
    id: "linda-carter",
    name: "Linda Carter",
    specialty: "Biology & Life Sciences",
    image: "/Tutor 3.png",
    rating: 4.8,
    experience: "12+ Years",
  },
];

interface TutorCard {
  id: string;
  name: string;
  specialty: string;
  image: string;
  rating: number;
  experience: string;
}

/** Photos for the carried-over profiles, keyed by name. */
const KNOWN_PHOTOS: Record<string, string> = Object.fromEntries(
  FALLBACK_TUTORS.map((t) => [t.name, t.image])
);

const EXPERIENCE_LABEL: Record<string, string> = {
  less_than_1: "New",
  one_to_three: "1-3 Years",
  three_to_five: "3-5 Years",
  five_to_ten: "5-10 Years",
  ten_plus: "10+ Years",
};

export default async function Tutors() {
  const t = await getTranslations("home");
  // Live verified tutors when the API has them, otherwise the existing cards,
  // so this section never renders empty at launch.
  const { items } = await getPublicTutors({ pageSize: 3 });

  const tutors: TutorCard[] =
    items.length > 0
      ? items.map((t, i) => ({
          id: t.user_id,
          name: t.display_name ?? "ReadAM Tutor",
          specialty: t.title ?? t.subject ?? "Tutor",
          image:
            t.avatar_url ||
            KNOWN_PHOTOS[t.display_name ?? ""] ||
            FALLBACK_TUTORS[i % FALLBACK_TUTORS.length].image,
          rating: 0,
          experience: t.experience_years ? EXPERIENCE_LABEL[t.experience_years] ?? "" : "",
        }))
      : FALLBACK_TUTORS;

  return (
    <section className="mx-auto max-w-7xl px-4 sm:px-6 py-12 sm:py-20 bg-[#F8F9FC]">
      <div className="mb-8 sm:mb-10 text-center">
        <h2 className="text-2xl sm:text-3xl font-black text-gray-900">{t("tutorsTitle")}</h2>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3 lg:gap-6">
        {tutors.map((tutor) => (
          <div
            key={tutor.id}
            className="group overflow-hidden rounded-xl sm:rounded-2xl border border-gray-100 bg-white shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
          >
            {/* Tutor image */}
            <div className="relative h-44 sm:h-52 w-full bg-gray-100 overflow-hidden">
              <Image
                src={tutor.image}
                alt={tutor.name}
                fill
                sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                className="object-cover group-hover:scale-105 transition-transform duration-500"
              />
              {/* Subtle bottom fade */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
            </div>

            {/* Card body */}
            <div className="p-3 sm:p-4">
              <h3 className="text-sm sm:text-base font-bold text-gray-900">{tutor.name}</h3>
              <p className="mt-0.5 text-[11px] sm:text-xs text-gray-400">{tutor.specialty}</p>

              <div className="mt-3 sm:mt-4 flex items-center justify-between gap-2">
                {/* Rating */}
                {tutor.rating > 0 && (
                  <div className="flex items-center gap-1">
                    <Star className="h-3 w-3 sm:h-3.5 sm:w-3.5 fill-orange-400 text-orange-400" />
                    <span className="text-[11px] sm:text-xs font-semibold text-gray-700">{tutor.rating}</span>
                  </div>
                )}

                {/* Experience */}
                {tutor.experience && (
                  <span className="rounded-full bg-gray-100 px-2.5 py-0.5 text-[11px] sm:text-xs text-gray-500">
                    {tutor.experience}
                  </span>
                )}

                {/* Follow */}
                <Link href={`/tutors/${tutor.id}`}>
                  <Button
                    size="sm"
                    className="rounded-lg sm:rounded-xl bg-blue-600 px-3 sm:px-4 text-white hover:bg-blue-700 text-xs h-7 sm:h-8"
                  >
                    {t("viewProfile")}
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-10 flex justify-center">
        <Link href="/tutors">
          <Button
            size="lg"
            className="rounded-xl bg-blue-600 px-6 sm:px-8 text-sm sm:text-base text-white hover:bg-blue-700 shadow-lg"
          >
            {t("viewAllTutors")}
          </Button>
        </Link>
      </div>
    </section>
  );
}