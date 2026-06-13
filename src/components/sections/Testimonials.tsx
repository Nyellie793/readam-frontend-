import { Star } from "lucide-react";

const testimonials = [
  {
    id: 1,
    quote: "Edugo's AI-powered summaries have cut my study time in half. The accuracy of the explanations is simply mind blowing!",
    name: "Ayuk Collins",
    role: "University Student",
    initial: "A",
    color: "bg-blue-600",
  },
  {
    id: 2,
    quote: "The video tutorials combined with the instant AI chat makes learning so much more interactive than just reading a textbook.",
    name: "Favour Ngwa",
    role: "STEM Student",
    initial: "F",
    color: "bg-blue-600",
  },
  {
    id: 3,
    quote: "As a tutor, I recommend Edugo to all my students. It's the perfect companion for self paced learning and revision.",
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
        <Star key={i} className="h-3.5 w-3.5 sm:h-4 sm:w-4 fill-orange-400 text-orange-400" />
      ))}
    </div>
  );
}

export default function Testimonials() {
  return (
    <section className="mx-auto max-w-7xl px-4 sm:px-6 py-12 sm:py-20 bg-gray-50">
      <div className="mb-8 sm:mb-10 text-center">
        <h2 className="text-2xl sm:text-3xl font-black text-gray-900">
          Hear What Our Users Have To Say
        </h2>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3 lg:gap-5">
        {testimonials.map((t) => (
          <div
            key={t.id}
            className="group flex flex-col justify-between rounded-xl sm:rounded-2xl border border-gray-100 bg-white p-4 sm:p-6 shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300"
          >
            <div>
              <Stars />
              <p className="mt-3 sm:mt-4 text-xs sm:text-sm italic leading-relaxed text-gray-600">
                &ldquo;{t.quote}&rdquo;
              </p>
            </div>

            {/* Avatar row */}
            <div className="mt-4 sm:mt-6 flex items-center gap-2 sm:gap-3">
              <div className={`flex h-8 w-8 sm:h-10 sm:w-10 shrink-0 items-center justify-center rounded-full ${t.color} ring-2 ring-offset-1 ring-gray-100`}>
                <span className="text-xs sm:text-sm font-bold text-white">{t.initial}</span>
              </div>
              <div>
                <p className="text-xs sm:text-sm font-bold text-gray-900">{t.name}</p>
                <p className="text-[10px] sm:text-xs text-gray-400">{t.role}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}