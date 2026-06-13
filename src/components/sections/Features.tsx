import { BookOpen, Sparkles, Clock, Video, BarChart2 } from "lucide-react";

export default function Features() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-20 bg-[#F8F9FC]">

      {/* Section header */}
      <div className="mb-12 text-center">
        <h2 className="text-3xl font-black text-gray-900">Master Your Curriculum</h2>
        <p className="mt-2 text-sm text-gray-500">
          Built specifically for the Cameroonian educational landscape.
        </p>
      </div>

      {/* Flat bento grid — 3 equal columns */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">

        {/* PDF Library — spans 2 cols on large */}
        <div className="group relative overflow-hidden rounded-2xl border border-gray-200 bg-white p-6 lg:col-span-2 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300">
          {/* Ghost watermark — animates on hover */}
          <div className="pointer-events-none absolute right-8 top-1/2 -translate-y-1/2 opacity-[0.07] group-hover:opacity-[0.12] group-hover:scale-110 transition-all duration-500">
            <BookOpen className="h-36 w-36 text-gray-900" />
          </div>

          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-100 group-hover:bg-blue-200 group-hover:scale-110 transition-all duration-300">
            <BookOpen className="h-5 w-5 text-blue-500" />
          </div>

          <h3 className="mt-4 text-lg font-bold text-gray-900">PDF Library</h3>
          <p className="mt-1 max-w-xs text-sm leading-relaxed text-gray-500">
            Thousands of curriculum-aligned notes from top schools across
            Cameroon. Download and study offline.
          </p>

          <div className="mt-5 flex flex-wrap gap-2">
            {["Physics", "Philosophy", "+12 more"].map((tag) => (
              <span
                key={tag}
                className="rounded-full border border-gray-200 px-3 py-1 text-xs text-gray-500 hover:border-blue-300 hover:text-blue-500 hover:bg-blue-50 transition-colors duration-200 cursor-pointer"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* AI Study Assistant — dark navy */}
        <div className="group relative overflow-hidden rounded-2xl bg-[#0f1b35] p-6 lg:col-span-1 hover:shadow-xl hover:shadow-blue-900/30 hover:-translate-y-0.5 transition-all duration-300">
          {/* Subtle glow on hover */}
          <div className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
            style={{ background: "radial-gradient(ellipse at top right, rgba(251,146,60,0.08) 0%, transparent 70%)" }}
          />

          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-500/20 group-hover:bg-orange-500/30 group-hover:scale-110 transition-all duration-300">
            <Sparkles className="h-5 w-5 text-orange-400" />
          </div>

          <h3 className="mt-4 text-lg font-bold text-white">AI Study Assistant</h3>
          <p className="mt-1 text-sm leading-relaxed text-gray-400">
            Get instant, bilingual explanations for any topic 24/7.
          </p>

          <div className="mt-6 rounded-xl bg-white/10 px-4 py-3 group-hover:bg-white/15 transition-colors duration-300">
            <p className="text-sm italic text-gray-300">
              &ldquo;Explain the krebs cycle in French...&rdquo;
            </p>
          </div>
        </div>

        {/* Past Questions — purple gradient */}
        <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-600 via-purple-600 to-purple-700 p-6 lg:col-span-1 hover:shadow-xl hover:shadow-purple-500/30 hover:-translate-y-0.5 transition-all duration-300">
          {/* Shimmer overlay */}
          <div className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
            style={{ background: "radial-gradient(ellipse at bottom left, rgba(255,255,255,0.08) 0%, transparent 70%)" }}
          />

          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/20 group-hover:bg-white/30 group-hover:scale-110 transition-all duration-300">
            <Clock className="h-5 w-5 text-white" />
          </div>
          <h3 className="mt-16 text-lg font-bold text-white">Past Questions</h3>
          <p className="mt-1 text-sm leading-relaxed text-blue-100">
            Practice with 10 years of real GCE and Baccalauréat exam papers.
          </p>
        </div>

        {/* Video Courses */}
        <div className="group relative overflow-hidden rounded-2xl border border-orange-200 bg-white p-6 lg:col-span-1 hover:shadow-lg hover:shadow-orange-100 hover:-translate-y-0.5 transition-all duration-300">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-100 group-hover:bg-orange-200 group-hover:scale-110 transition-all duration-300">
            <Video className="h-5 w-5 text-orange-400" />
          </div>
          <h3 className="mt-16 text-lg font-bold text-gray-900">Video Courses</h3>
          <p className="mt-1 text-sm leading-relaxed text-gray-500">
            Watch high quality lessons from the most requested tutors in the country.
          </p>
        </div>

        {/* Progress Tracking */}
        <div className="group relative overflow-hidden rounded-2xl border border-teal-200 bg-white p-6 lg:col-span-1 hover:shadow-lg hover:shadow-teal-100 hover:-translate-y-0.5 transition-all duration-300">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-100 group-hover:bg-teal-200 group-hover:scale-110 transition-all duration-300">
            <BarChart2 className="h-5 w-5 text-teal-500" />
          </div>
          <h3 className="mt-4 text-lg font-bold text-gray-900">Progress Tracking</h3>
          <p className="mt-1 text-sm leading-relaxed text-gray-500">
            Visualize your mastery of each subject and predict your exam results.
          </p>
          {/* Animated progress bar */}
          <div className="mt-5 h-2 w-full overflow-hidden rounded-full bg-gray-100">
            <div className="h-full w-2/3 rounded-full bg-green-400 group-hover:w-[80%] transition-all duration-700 ease-out" />
          </div>
        </div>

      </div>
    </section>
  );
}