import { CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";

const plans = [
  {
    name: "Free",
    price: "0",
    highlight: false,
    buttonLabel: "Start for Free",
    buttonStyle: "outline",
    features: [
      "Access to core PDF notes",
      "5 AI questions per day",
      "Limited past questions",
    ],
    bold: [],
  },
  {
    name: "Standard",
    price: "2,500",
    highlight: true,
    buttonLabel: "Choose Standard",
    buttonStyle: "solid",
    features: [
      "Everything in Free",
      "Unlimited PDF notes",
      "50 AI questions per day",
      "All past questions for your exam",
      "Basic video courses",
    ],
    bold: ["Everything in Free"],
  },
  {
    name: "Premium",
    price: "5,000",
    highlight: false,
    buttonLabel: "Go Premium",
    buttonStyle: "outline-teal",
    features: [
      "Everything in Standard",
      "Unlimited AI Study Assistant",
      "All premium video courses",
      "Tutor priority support",
      "Offline access",
    ],
    bold: ["Everything in Standard"],
  },
];

export default function Pricing() {
  return (
    <section className="mx-auto max-w-7xl px-4 sm:px-6 py-12 sm:py-20 bg-[#F8F9FC]">
      <div className="mb-10 sm:mb-12 text-center">
        <h2 className="text-2xl sm:text-3xl font-black text-gray-900">Simple, Affordable Pricing</h2>
        <p className="mt-2 text-xs sm:text-sm text-gray-500">
          Choose the plan that fits your study goals.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3 lg:gap-6 lg:items-start">
        {plans.map((plan) => (
          <div
            key={plan.name}
            className={`relative flex flex-col rounded-xl sm:rounded-2xl border p-5 sm:p-7 transition-all duration-300 ${
              plan.highlight
                ? "border-blue-500 bg-white shadow-2xl shadow-blue-100 lg:scale-[1.03] hover:shadow-blue-200"
                : "border-gray-100 bg-white shadow-sm hover:shadow-lg hover:-translate-y-0.5"
            }`}
          >
            {/* Most popular badge */}
            {plan.highlight && (
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                <span className="rounded-full bg-orange-500 px-3 sm:px-4 py-1 text-[10px] sm:text-xs font-bold text-white shadow-sm">
                  MOST POPULAR
                </span>
              </div>
            )}

            <p className="text-sm sm:text-base font-semibold text-gray-600">{plan.name}</p>

            <div className="mt-1 sm:mt-2 flex items-baseline gap-1">
              <span className="text-4xl sm:text-5xl font-black text-gray-900">{plan.price}</span>
              <span className="text-xs sm:text-sm text-gray-400">FCFA/month</span>
            </div>

            <div className="my-4 sm:my-6 h-px bg-gray-100" />

            <ul className="flex flex-col gap-2 sm:gap-3">
              {plan.features.map((feature) => (
                <li key={feature} className="flex items-start gap-2">
                  <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 sm:h-4 sm:w-4 shrink-0 text-blue-500" />
                  <span className={`text-xs sm:text-sm ${plan.bold.includes(feature) ? "font-bold text-gray-900" : "text-gray-500"}`}>
                    {feature}
                  </span>
                </li>
              ))}
            </ul>

            <div className="mt-6 sm:mt-8">
              {plan.buttonStyle === "solid" ? (
                <Button className="w-full rounded-lg sm:rounded-xl bg-blue-600 text-white hover:bg-blue-700 text-xs sm:text-sm h-9 sm:h-10 shadow-md shadow-blue-200">
                  {plan.buttonLabel}
                </Button>
              ) : plan.buttonStyle === "outline-teal" ? (
                <Button variant="outline" className="w-full rounded-lg sm:rounded-xl border-teal-400 text-teal-600 hover:bg-teal-50 text-xs sm:text-sm h-9 sm:h-10">
                  {plan.buttonLabel}
                </Button>
              ) : (
                <Button variant="outline" className="w-full rounded-lg sm:rounded-xl border-orange-300 text-orange-500 hover:bg-orange-50 text-xs sm:text-sm h-9 sm:h-10">
                  {plan.buttonLabel}
                </Button>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}