"use client";

export default function Newsletter() {
  return (
    <section className="bg-white py-16 lg:py-24">

      <div className="mx-auto max-w-7xl px-6">

        <div
          className="
          overflow-hidden
          rounded-[32px]

          bg-[#071B4D]

          px-6
          py-14

          text-center

          lg:px-20
          lg:py-20
          "
        >

          <h2
            className="
            text-3xl
            font-bold
            text-white

            lg:text-5xl
            "
          >
            Continue Your{" "}

            <span className="text-orange-500">
              Success Story
            </span>

          </h2>

          <p
            className="
            mx-auto
            mt-6
            max-w-2xl

            text-gray-300
            "
          >
            Join 1000+ students who get weekly insights
            on turning dreams into reality and attaining
            success through our platform.
          </p>

          <div
            className="
            mx-auto
            mt-10

            flex
            max-w-xl

            flex-col
            gap-4

            sm:flex-row
            "
          >

            <input
              type="email"
              placeholder="your@email.com"
              className="
              h-14
              flex-1

              rounded-xl

              border
              border-blue-900

              bg-[#0B245F]

              px-5

              text-white

              outline-none

              placeholder:text-gray-400
              "
            />

            <button
              className="
              h-14

              rounded-xl

              bg-orange-500

              px-8

              font-semibold
              text-white

              transition

              hover:bg-orange-600
              "
            >
              Subscribe
            </button>

          </div>

          <p className="mt-5 text-sm text-gray-400">
            No spam, just stories worth telling.
            Unsubscribe anytime.
          </p>

        </div>

      </div>

    </section>
  );
}