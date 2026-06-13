import Image from "next/image";
import { TrendingUp } from "lucide-react";

export default function HeroImage() {
  return (
    <div className="relative flex h-full w-full items-end justify-center">

      {/* Blue radial glow — background right */}
      <div className="absolute bottom-0 left-0 h-[25%] w-full pointer-events-none bg-gradient-to-b from-transparent via-white/30 to-white"/>

      {/* Person image */}
      <Image
        src="/hero.png"
        alt="Student with laptop"
        width={520}
        height={600}
        className="relative z-10 w-[75%] object-contain sm:w-[60%] lg:w-[75%]"
        priority
      />

      {/* Stat card — bottom left */}
      <div className="absolute bottom-[15%] left-0 z-20 flex flex-col gap-1 rounded-2xl bg-white px-4 py-3 shadow-xl sm:left-[-12px]">
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
  );
}