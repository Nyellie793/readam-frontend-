import HeroBadge from "./HeroBadge";
import HeroButtons from "./HeroButtons";
import HeroImage from "./HeroImage";
import HeroStats from "./HeroStats";
import SearchBar from "@/components/sections/SearchBar";

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-transparent">
      <div className="mx-auto max-w-7xl px-6">

        {/* Hero grid */}
        <div className="grid min-h-[calc(100vh-64px)] grid-cols-1 items-center gap-8 lg:grid-cols-2">

          {/* LEFT */}
          <div className="pb-12 pt-10 text-left lg:py-0">
            <HeroBadge />
            <h1 className="mt-5 text-5xl font-black leading-[1.1] tracking-tight sm:text-6xl lg:text-6xl xl:text-7xl">
              Revolutionizing
              <br />
              Digital{" "}
              <span className="text-blue-600">Learning With AI</span>
            </h1>
            <p className="mt-5 max-w-md text-base leading-relaxed text-gray-500">
              Transforming the future of success and Education with an
              interactive trend first approach. Explore the beauty of learning
              at your full potential, and succeeding with half the effort.
            </p>
            <HeroButtons />
            <HeroStats />
          </div>

          {/* RIGHT */}
          <div className="relative flex items-end justify-center self-stretch">
            <HeroImage />
          </div>

        </div>

        {/* SearchBar — below hero grid, above subjects */}
        <div className="pb-16">
          <SearchBar />
        </div>

      </div>
    </section>
  );
}