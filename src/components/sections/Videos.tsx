import Image from "next/image";
import Link from "next/link";
import { PlayCircle, Star } from "lucide-react";
import { Button } from "@/components/ui/button";

const videos = [
  {
    id: 1,
    thumbnail: "/Rectangle 12.png",
    title: "Cybersecurity",
    tutor: "Mr. Tabi Samuel",
    tutorAvatar: "/Background.png",
    rating: 4.8,
    count: "12 Videos",
  },
  {
    id: 2,
    thumbnail: "/Rectangle 13.png",
    title: "Chemistry",
    tutor: "Dr. Micheal Une",
    tutorAvatar: "/Background 2.png",
    rating: 4.9,
    count: "9 Videos",
  },
  {
    id: 3,
    thumbnail: "/Rectangle 14.png",
    title: "Principles of Dynamics",
    tutor: "Mr. Tolowei Matt",
    tutorAvatar: "/Background 3.png",
    rating: 4.7,
    count: "15 Videos",
  },
];

export default function Videos() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-20">

      {/* Header */}
      <div className="mb-10 text-center">
        <h2 className="text-3xl font-black text-gray-900">Browse Tutorial Videos</h2>
      </div>

      {/* Cards grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {videos.map((video) => (
          <div
            key={video.id}
            className="overflow-hidden rounded-2xl border border-gray-200 bg-white"
          >
            {/* Thumbnail */}
            <div className="relative h-44 w-full bg-gray-900">
              <Image
                src={video.thumbnail}
                alt={video.title}
                fill
                className="object-cover opacity-80"
              />
              {/* Play button overlay */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 shadow-lg">
                  <PlayCircle className="h-5 w-5 text-white" />
                </div>
              </div>
            </div>

            {/* Card body */}
            <div className="p-4">
              <h3 className="text-base font-bold text-gray-900">{video.title}</h3>

              {/* Tutor row */}
              <div className="mt-2 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="relative h-6 w-6 overflow-hidden rounded-full bg-gray-200">
                    <Image src={video.tutorAvatar} alt={video.tutor} fill className="object-cover" />
                  </div>
                  <span className="text-xs text-gray-500">{video.tutor}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Star className="h-3 w-3 fill-orange-400 text-orange-400" />
                  <span className="text-xs font-semibold text-gray-700">{video.rating}</span>
                  <span className="text-xs text-gray-400">{video.count}</span>
                </div>
              </div>

              {/* CTA button */}
              <Link href="/courses" className="mt-4 block">
                <Button className="w-full rounded-xl bg-blue-600 text-white hover:bg-blue-700">
                  View Courses
                </Button>
              </Link>
            </div>
          </div>
        ))}
      </div>

    </section>
  );
}