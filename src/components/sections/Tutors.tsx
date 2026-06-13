import Image from "next/image";
import Link from "next/link";
import { Star } from "lucide-react";
import { Button } from "@/components/ui/button";

const tutors = [
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

export default function Tutors() {
  return (
    <section className="mx-auto max-w-7xl px-4 sm:px-6 py-12 sm:py-20 bg-[#F8F9FC]">
      <div className="mb-8 sm:mb-10 text-center">
        <h2 className="text-2xl sm:text-3xl font-black text-gray-900">Meet Our Top Tutors</h2>
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
                <div className="flex items-center gap-1">
                  <Star className="h-3 w-3 sm:h-3.5 sm:w-3.5 fill-orange-400 text-orange-400" />
                  <span className="text-[11px] sm:text-xs font-semibold text-gray-700">{tutor.rating}</span>
                </div>

                {/* Experience */}
                <span className="rounded-full bg-gray-100 px-2.5 py-0.5 text-[11px] sm:text-xs text-gray-500">
                  {tutor.experience}
                </span>

                {/* Follow */}
                <Link href={`/tutors/${tutor.id}`}>
                  <Button
                    size="sm"
                    className="rounded-lg sm:rounded-xl bg-blue-600 px-3 sm:px-4 text-white hover:bg-blue-700 text-xs h-7 sm:h-8"
                  >
                    Follow
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}