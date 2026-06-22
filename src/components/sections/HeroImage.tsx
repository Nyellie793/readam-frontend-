import Image from "next/image";
import { TrendingUp, Sparkles } from "lucide-react";

export default function HeroImage() {
  return (
    <div className="relative flex h-full w-full items-end justify-center">

      {/* Gradient ring / glassmorphism frame behind the photo */}
      <div className="absolute inset-x-[6%] top-[4%] bottom-0 -z-10 rounded-[2.5rem] bg-gradient-to-br from-blue-200/60 via-white/40 to-orange-200/50 blur-2xl" />

      <div className="relative w-[78%] sm:w-[64%] lg:w-[78%]">

        {/* Modern rounded frame with gradient border + soft shadow */}
        <div className="relative rounded-[2rem] bg-gradient-to-br from-blue-400/40 via-white/60 to-orange-300/40 p-[3px] shadow-[0_30px_60px_-15px_rgba(37,99,235,0.35)]">
          <div className="relative overflow-hidden rounded-[calc(2rem-3px)] bg-white/40 backdrop-blur-sm">

            {/* Blue radial glow — background */}
            <div className="pointer-events-none absolute bottom-0 left-0 h-[25%] w-full bg-gradient-to-b from-transparent via-white/30 to-white" />

            <Image
              src="/hero.png"
              alt="Student with laptop"
              width={520}
              height={600}
              className="relative z-10 w-full object-contain"
              priority
            />
          </div>
        </div>

        {/* Floating decoration — top right sparkle chip */}
        <div className="absolute -top-4 -right-3 z-20 flex items-center gap-1.5 rounded-2xl bg-white/90 px-3 py-2 shadow-lg ring-1 ring-black/5 backdrop-blur-sm animate-bounce [animation-duration:3s]">
          <Sparkles className="h-3.5 w-3.5 text-orange-400" />
          <span className="text-[11px] font-bold text-gray-700">AI Powered</span>
        </div>

        {/* Stat card — bottom left, floating over the frame */}
        <div className="absolute bottom-[12%] left-[-8%] z-20 flex flex-col gap-1 rounded-2xl bg-white/95 px-4 py-3 shadow-xl ring-1 ring-black/5 backdrop-blur-sm sm:left-[-14px]">
          <div className="flex items-center gap-1.5">
            <TrendingUp className="h-4 w-4 text-green-500" />
            <span className="text-base font-black text-gray-900">94%</span>
          </div>
          <p className="text-[11px] leading-tight text-gray-500">
            Success rate for active
            <br />
            READAM students
          </p>
        </div>

        {/* Soft white glow — bottom right */}
        <div
          className="absolute bottom-[5%] right-[-5%] z-10 h-[160px] w-[55%] pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse at center, rgba(255,255,255,1) 0%, rgba(255,255,255,0.6) 40%, transparent 70%)",
            filter: "blur(20px)",
          }}
        />
      </div>
    </div>
  );
}
