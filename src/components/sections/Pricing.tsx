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
    <section className="mx-auto max-w-7xl px-6 py-20 bg-[#F8F9FC]">

      {/* Header */}
      <div className="mb-12 text-center">
        <h2 className="text-3xl font-black text-gray-900">Simple, Affordable Pricing</h2>
        <p className="mt-2 text-sm text-gray-500">
          Choose the plan that fits your study goals.
        </p>
      </div>

      {/* Plans */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {plans.map((plan) => (
          <div
            key={plan.name}
            className={`relative flex flex-col rounded-2xl border p-7 ${
              plan.highlight
                ? "border-blue-600 bg-white shadow-xl scale-[1.02]"
                : "border-gray-200 bg-white"
            }`}
          >
            {/* Most popular badge */}
            {plan.highlight && (
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                <span className="rounded-full bg-orange-500 px-4 py-1 text-xs font-bold text-white">
                  MOST POPULAR
                </span>
              </div>
            )}

            {/* Plan name */}
            <p className="text-base font-semibold text-gray-700">{plan.name}</p>

            {/* Price */}
            <div className="mt-2 flex items-baseline gap-1">
              <span className="text-5xl font-black text-gray-900">{plan.price}</span>
              <span className="text-sm text-gray-400">FCFA/month</span>
            </div>

            {/* Divider */}
            <div className="my-6 h-px bg-gray-100" />

            {/* Features */}
            <ul className="flex flex-col gap-3">
              {plan.features.map((feature) => (
                <li key={feature} className="flex items-start gap-2">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-blue-500" />
                  <span
                    className={`text-sm ${
                      plan.bold.includes(feature)
                        ? "font-bold text-gray-900"
                        : "text-gray-500"
                    }`}
                  >
                    {feature}
                  </span>
                </li>
              ))}
            </ul>

            {/* CTA */}
            <div className="mt-8">
              {plan.buttonStyle === "solid" ? (
                <Button className="w-full rounded-xl bg-blue-600 text-white hover:bg-blue-700">
                  {plan.buttonLabel}
                </Button>
              ) : plan.buttonStyle === "outline-teal" ? (
                <Button
                  variant="outline"
                  className="w-full rounded-xl border-teal-500 text-teal-600 hover:bg-teal-50"
                >
                  {plan.buttonLabel}
                </Button>
              ) : (
                <Button
                  variant="outline"
                  className="w-full rounded-xl border-orange-400 text-orange-500 hover:bg-orange-50"
                >
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