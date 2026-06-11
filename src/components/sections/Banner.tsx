import { Diamond } from "lucide-react";

export default function Banner() {
  return (
    <section className="bg-[#0f1b35] py-16 px-6">
      <div className="mx-auto max-w-2xl text-center">

        {/* Orange diamond icon */}
        <div className="mb-5 flex justify-center">
          <Diamond className="h-8 w-8 text-orange-400 fill-orange-400" />
        </div>

        {/* Heading */}
        <h2 className="text-2xl font-black leading-snug text-white sm:text-3xl">
          Stop searching for notes. Stop guessing past questions.
        </h2>

        {/* Subtext */}
        <p className="mx-auto mt-4 max-w-md text-sm leading-relaxed text-gray-400">
          Cameroonian students deserve a centralized tool that makes exam
          preparation simple and effective. No more expensive photocopies or
          outdated resources.
        </p>

        {/* Orange underline */}
        <div className="mx-auto mt-6 h-0.5 w-12 bg-orange-400" />

      </div>
    </section>
  );
}