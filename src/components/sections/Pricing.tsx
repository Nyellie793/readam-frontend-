import { CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";

const plans = [
  {
    name: "Starter",
    price: "1,000",
    highlight: false,
    buttonLabel: "Choose Starter",
    buttonStyle: "outline-orange",
    borderColor: "border-orange-400",
    checkColor: "text-orange-400",
    features: [
      "Unlimited PDF note views",
      "15 AI questions per day",
      "Selected past exam papers",
      "Email support",
    ],
    bold: [],
  },
  {
    name: "Standard",
    price: "2,500",
    highlight: true,
    buttonLabel: "Choose Standard",
    buttonStyle: "solid",
    borderColor: "border-blue-600",
    checkColor: "text-blue-600",
    features: [
      "Everything in Starter",
      "Unlimited PDF notes",
      "50 AI questions per day",
      "All past questions for your exam",
      "Basic video courses",
    ],
    bold: ["Everything in Starter"],
  },
  {
    name: "Premium",
    price: "5,000",
    highlight: false,
    buttonLabel: "Go Premium",
    buttonStyle: "outline-teal",
    borderColor: "border-teal-400",
    checkColor: "text-teal-500",
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
    <section className="w-full bg-[#F8F9FC] py-12 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">

        <div className="mb-10 sm:mb-12 text-center">
          <h2 className="text-2xl sm:text-3xl font-black text-gray-900">
            Simple, Affordable Pricing
          </h2>
          <p className="mt-2 text-xs sm:text-sm text-gray-500">
            Choose the plan that fits your study goals.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 sm:gap-5 lg:gap-6 lg:items-center">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`relative flex flex-col rounded-2xl border-2 bg-white p-4 transition-all duration-300
                ${plan.borderColor}
                ${plan.highlight
                  ? "shadow-2xl shadow-blue-100 lg:scale-[1.05] z-10"
                  : "shadow-sm hover:shadow-md hover:-translate-y-0.5"
                }`}
            >
              {/* Most popular badge */}
              {plan.highlight && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <span className="rounded-full bg-orange-500 px-4 py-1.5 text-[11px] font-black uppercase tracking-wide text-white shadow-sm">
                    Most Popular
                  </span>
                </div>
              )}

              {/* Plan name */}
              <p className="text-sm font-bold text-gray-800">{plan.name}</p>

              {/* Price */}
              <div className="mt-1 flex items-baseline gap-1">
                <span className="text-3xl font-black text-gray-900">{plan.price}</span>
                <span className="text-[10px] font-semibold uppercase tracking-wide text-gray-400">
                  FCFA/month
                </span>
              </div>

              {/* Divider */}
              <div className="my-3 h-px bg-gray-100" />

              {/* Features */}
              <ul className="flex flex-col gap-2">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2">
                    <CheckCircle2
                      className={`mt-0.5 h-3.5 w-3.5 shrink-0 ${plan.checkColor}`}
                    />
                    <span
                      className={`text-xs leading-snug ${
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
              <div className="mt-4">
                {plan.buttonStyle === "solid" ? (
                  <Button className="w-full rounded-xl bg-blue-600 text-white hover:bg-blue-700 h-9 shadow-md shadow-blue-200 font-bold text-xs">
                    {plan.buttonLabel}
                  </Button>
                ) : plan.buttonStyle === "outline-teal" ? (
                  <Button
                    variant="outline"
                    className="w-full rounded-xl border-teal-400 text-teal-600 hover:bg-teal-50 h-9 font-bold text-xs"
                  >
                    {plan.buttonLabel}
                  </Button>
                ) : (
                  <Button
                    variant="outline"
                    className="w-full rounded-xl border-orange-400 text-orange-500 hover:bg-orange-50 h-9 font-bold text-xs"
                  >
                    {plan.buttonLabel}
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}