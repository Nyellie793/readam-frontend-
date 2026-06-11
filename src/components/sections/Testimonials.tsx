import { Star } from "lucide-react";

const testimonials = [
  {
    id: 1,
    quote:
      "Edugo's AI-powered summaries have cut my study time in half. The accuracy of the explanations is simply mind blowing!",
    name: "Ayuk Collins",
    role: "University Student",
    initial: "A",
    color: "bg-blue-600",
  },
  {
    id: 2,
    quote:
      "The video tutorials combined with the instant AI chat makes learning so much more interactive than just reading a textbook.",
    name: "Favour Ngwa",
    role: "STEM Student",
    initial: "F",
    color: "bg-blue-600",
  },
  {
    id: 3,
    quote:
      "As a tutor, I recommend Edugo to all my students. It's the perfect companion for self paced learning and revision.",
    name: "James Tabi",
    role: "Private Tutor",
    initial: "J",
    color: "bg-gray-800",
  },
];

function Stars() {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star key={i} className="h-4 w-4 fill-orange-400 text-orange-400" />
      ))}
    </div>
  );
}

export default function Testimonials() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-20 bg-gray-100">

      {/* Header */}
      <div className="mb-10 text-center">
        <h2 className="text-3xl font-black text-gray-900">
          Hear What Our Users Have To Say
        </h2>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {testimonials.map((t) => (
          <div
            key={t.id}
            className="flex flex-col justify-between rounded-2xl border border-gray-200 bg-white p-6"
          >
            <div>
              <Stars />
              <p className="mt-4 text-sm italic leading-relaxed text-gray-600">
                &ldquo;{t.quote}&rdquo;
              </p>
            </div>

            {/* Avatar row */}
            <div className="mt-6 flex items-center gap-3">
              <div
                className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${t.color}`}
              >
                <span className="text-sm font-bold text-white">{t.initial}</span>
              </div>
              <div>
                <p className="text-sm font-bold text-gray-900">{t.name}</p>
                <p className="text-xs text-gray-400">{t.role}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

    </section>
  );
}