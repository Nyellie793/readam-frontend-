import HeroBadge from "./HeroBadge";
import HeroButtons from "./HeroButtons";
import HeroImage from "./HeroImage";
import HeroStats from "./HeroStats";
import SearchBar from "@/components/sections/SearchBar";
import Subjects from "./Subjects";

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-transparent">

      {/* Background glows */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute top-[-120px] left-1/2 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-blue-200/40 blur-[120px]" />
        <div className="absolute bottom-[-160px] right-[-120px] h-[450px] w-[450px] rounded-full bg-blue-300/30 blur-[140px]" />
      </div>

      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:py-12">

        {/* ── Two-column hero grid ─────────────────────────────── */}
        <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-2">

          {/* LEFT — text + buttons + stats */}
          <div className="pt-2 pb-6 text-left lg:py-0">
            <HeroBadge />

            <h1 className="mt-3 text-4xl font-black leading-[1.1] tracking-tight sm:text-5xl lg:text-6xl xl:text-7xl">
              Revolutionizing
              <br />
              Digital{" "}
              <span className="text-blue-600">Learning With AI</span>
            </h1>

            <p className="mt-4 max-w-md text-base leading-relaxed text-gray-500">
              Transforming the future of success and Education with an
              interactive trend first approach. Explore the beauty of learning
              at your full potential, and succeeding with half the effort.
            </p>

            <HeroButtons />
            <HeroStats />
          </div>

          {/* RIGHT — hero image */}
          <div className="relative flex items-end justify-center self-stretch">
            <HeroImage />
          </div>

        </div>

        {/* ── AI Search Bar — full width, centered under the image ── */}
        <div className="mx-auto mt-8 max-w-2xl sm:mt-10">
          <SearchBar />
        </div>

        {/* ── Subjects ─────────────────────────────────────────── */}
        <div className="mt-8 sm:mt-10">
          <Subjects />
        </div>

      </div>
    </section>
  );
}
