import Image from "next/image";
import { TrendingUp, Sparkles } from "lucide-react";

export default function HeroImage() {
  return (
    <div className="relative flex h-full w-full items-center justify-center py-6 lg:py-0">
      <div className="absolute inset-x-[4%] inset-y-[2%] -z-10 rounded-[3rem] bg-gradient-to-br from-blue-200/60 via-white/30 to-orange-200/50 blur-2xl" />
      <div className="relative w-[88%] sm:w-[72%] md:w-[60%] lg:w-[86%] xl:w-[78%]">
        <div className="relative rounded-[2rem] bg-gradient-to-br from-blue-400/50 via-white/70 to-orange-300/40 p-[3px] shadow-[0_32px_64px_-16px_rgba(37,99,235,0.30)]">
          <div className="relative overflow-hidden rounded-[calc(2rem-3px)] bg-white/50 backdrop-blur-sm">
            <Image src="/hero.png" alt="Student using ReadAM on a laptop" width={520} height={580}
              className="relative z-10 h-[300px] w-full object-cover object-[center_15%] sm:h-[380px] md:h-[420px] lg:h-[460px]"
              priority />
            <div className="pointer-events-none absolute bottom-0 left-0 h-[18%] w-full bg-gradient-to-b from-transparent to-white/50" />
          </div>
        </div>
        <div className="absolute -right-3 -top-4 z-20 flex animate-bounce items-center gap-1.5 rounded-2xl bg-white/95 px-3 py-2 shadow-lg ring-1 ring-black/5 backdrop-blur-sm [animation-duration:3.5s]">
          <Sparkles className="h-3.5 w-3.5 text-orange-400" />
          <span className="text-[11px] font-bold text-gray-700">AI Powered</span>
        </div>
        <div className="absolute -left-4 bottom-[16%] z-20 flex flex-col gap-1 rounded-2xl bg-white/95 px-4 py-3 shadow-xl ring-1 ring-black/5 backdrop-blur-sm sm:-left-5">
          <div className="flex items-center gap-1.5">
            <TrendingUp className="h-4 w-4 text-green-500" />
            <span className="text-base font-black text-gray-900">94%</span>
          </div>
          <p className="text-[11px] leading-tight text-gray-500">Success rate for active<br />READAM students</p>
        </div>
      </div>
    </div>
  );
}
