import Image from "next/image";
import Link from "next/link";
import { Star } from "lucide-react";
import { Button } from "@/components/ui/button";

const tutors = [
  {
    id: "sarah-jenkins",
    name: "Sarah Jenkins",
    specialty: "English & Literature Specialist",
    image: "/tutor1.jpg",
    rating: 4.9,
    experience: "10+ Years",
  },
  {
    id: "mike-davis",
    name: "Mike Davis",
    specialty: "Physics & Mathematics Pro",
    image: "/tutor2.jpg",
    rating: 5.0,
    experience: "8+ Years",
  },
  {
    id: "linda-carter",
    name: "Linda Carter",
    specialty: "Biology & Life Sciences",
    image: "/tutor3.jpg",
    rating: 4.8,
    experience: "12+ Years",
  },
];

export default function Tutors() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-20 bg-[#F8F9FC]">

      {/* Header */}
      <div className="mb-10 text-center">
        <h2 className="text-3xl font-black text-gray-900">Meet Our Top Tutors</h2>
      </div>

      {/* Cards grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {tutors.map((tutor) => (
          <div
            key={tutor.id}
            className="overflow-hidden rounded-2xl border border-gray-200 bg-white"
          >
            {/* Tutor image */}
            <div className="relative h-52 w-full bg-gray-100">
              <Image
                src={tutor.image}
                alt={tutor.name}
                fill
                className="object-cover"
              />
            </div>

            {/* Card body */}
            <div className="p-4">
              <h3 className="text-base font-bold text-gray-900">{tutor.name}</h3>
              <p className="mt-0.5 text-xs text-gray-500">{tutor.specialty}</p>

              {/* Stats + Follow row */}
              <div className="mt-4 flex items-center justify-between gap-2">

                {/* Rating */}
                <div className="flex items-center gap-1">
                  <Star className="h-3.5 w-3.5 fill-orange-400 text-orange-400" />
                  <span className="text-xs font-semibold text-gray-700">{tutor.rating}</span>
                </div>

                {/* Experience */}
                <span className="rounded-full bg-gray-100 px-3 py-1 text-xs text-gray-500">
                  {tutor.experience}
                </span>

                {/* Follow button */}
                <Link href={`/tutors/${tutor.id}`}>
                  <Button
                    size="sm"
                    className="rounded-xl bg-blue-600 px-4 text-white hover:bg-blue-700"
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