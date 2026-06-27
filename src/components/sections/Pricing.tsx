import { CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";

const plans = [
  {
    name: "Single Subject",
    price: "3,000",
    color: "blue",
    popular: false,
    features: [
      "Past questions & answers for 1 subject",
      "Detailed study explanations",
    ],
  },

  {
    name: "Small Bundle",
    price: "7,500",
    color: "orange",
    popular: false,
    features: [
      "Past questions & answers for 3 subjects",
      "Access to core study notes",
    ],
  },

  {
    name: "Medium Bundle",
    price: "11,000",
    color: "purple",
    popular: true,
    features: [
      "Past questions & answers for 5 subjects",
      "AI Study Assistant (50 queries/day)",
      "Priority forum support",
    ],
  },

  {
    name: "Full Access Bundle",
    price: "18,000",
    color: "green",
    popular: false,
    features: [
      "Past questions & answers for all subjects",
      "Offline access to all materials",
      "1-on-1 tutor support",
    ],
  },
];

export default function Pricing() {
  return (
    <section className="bg-[#F8F9FC] py-24">
      <div className="mx-auto max-w-7xl px-6">

        {/* Heading */}
        <div className="mb-16 text-center">
          <h2 className="text-4xl font-black text-gray-900">
            Simple, Affordable Pricing
          </h2>

          <p className="mt-3 text-gray-500">
            Choose the plan that fits your study goals.
          </p>
        </div>

        {/* Cards */}
        <div className="grid gap-6 lg:grid-cols-4">

          {plans.map((plan) => {

            const styles = {
              blue: {
                border: "border-blue-200",
                text: "text-blue-600",
                bg: "bg-blue-600",
                button:
                  "border-blue-600 text-blue-600 hover:bg-blue-50",
              },

              orange: {
                border: "border-orange-200",
                text: "text-orange-500",
                bg: "bg-orange-500",
                button:
                  "border-orange-500 text-orange-500 hover:bg-orange-50",
              },

              purple: {
                border: "border-purple-300",
                text: "text-purple-600",
                bg: "bg-purple-600",
                button:
                  "bg-purple-600 text-white hover:bg-purple-700",
              },

              green: {
                border: "border-emerald-200",
                text: "text-emerald-600",
                bg: "bg-emerald-600",
                button:
                  "border-emerald-600 text-emerald-600 hover:bg-emerald-50",
              },
            };

            const color =
              styles[plan.color as keyof typeof styles];

            return (
              <div
                key={plan.name}
                className={`
                  relative
                  flex
                  min-h-[430px]
                  flex-col
                  rounded-3xl
                  border
                  bg-white
                  p-8
                  shadow-sm
                  transition-all
                  duration-300

                  ${
                    plan.popular
                      ? "scale-105 shadow-xl"
                      : "hover:-translate-y-1 hover:shadow-lg"
                  }

                  ${color.border}
                `}
              >

                {/* Badge */}
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">

                    <span
                      className="
                        rounded-full
                        bg-purple-600
                        px-4
                        py-1.5
                        text-xs
                        font-bold
                        uppercase
                        text-white
                        shadow-lg
                      "
                    >
                      Most Popular
                    </span>

                  </div>
                )}

                {/* Title */}
                <div className="flex items-center gap-3">

                  <div
                    className={`
                      h-6
                      w-1
                      rounded-full
                      ${color.bg}
                    `}
                  />

                  <h3
                    className={`
                      text-lg
                      font-bold
                      ${color.text}
                    `}
                  >
                    {plan.name}
                  </h3>

                </div>

                {/* Price */}
                <div className="mt-6">

                  <span className="text-5xl font-black text-gray-900">
                    {plan.price}
                  </span>

                  <span className="ml-2 text-sm font-semibold text-gray-500">
                    XAF/year
                  </span>

                </div>

                {/* Features */}
                <ul className="mt-8 flex-1 space-y-5">

                  {plan.features.map((feature) => (
                    <li
                      key={feature}
                      className="flex items-start gap-3"
                    >

                      <CheckCircle2
                        className={`
                          mt-1
                          h-5
                          w-5
                          shrink-0
                          ${color.text}
                        `}
                      />

                      <span className="text-gray-600">
                        {feature}
                      </span>

                    </li>
                  ))}

                </ul>

                {/* Button */}
                <Button
                  variant={plan.popular ? "default" : "outline"}
                  className={`
                    mt-8
                    h-12
                    rounded-xl
                    font-semibold

                    ${
                      plan.popular
                        ? color.button
                        : color.button
                    }
                  `}
                >
                  {plan.popular
                    ? "Subscribe Now"
                    : "Subscribe"}
                </Button>

              </div>
            );
          })}

        </div>

      </div>
    </section>
  );
}