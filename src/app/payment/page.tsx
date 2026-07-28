import Sidebar from "@/components/layout/Sidebar";
import Topbar from "@/components/layout/Topbar";
import PricingCard, { PricingPlan } from "@/components/payment/PricingCard";

const GCE_PLANS: PricingPlan[] = [
  {
    id: "gce-o-single",
    title: "O-Level Single",
    price: "5,000 XAF",
    period: "One-time payment",
    description: "Perfect for focusing on a single difficult topic or revision subject.",
    features: ["Access to 1 O-Level subject", "Step-by-step AI solutions", "10 mock exam practice sets", "Email support"],
    color: "blue",
  },
  {
    id: "gce-o-all",
    title: "O-Level All-Access",
    price: "10,000 XAF",
    period: "One-time payment",
    description: "Full coverage of all ordinary level exam papers and resources.",
    features: ["Access to all O-Level subjects", "Unlimited AI-assisted answers", "100+ past questions solved", "Study plan guide"],
    badge: "SAVE 20%",
    color: "purple",
  },
  {
    id: "gce-a-single",
    title: "A-Level Single",
    price: "8,000 XAF",
    period: "One-time payment",
    description: "Deep dive into your chosen advanced level exam curriculum.",
    features: ["Access to 1 A-Level subject", "Advanced AI guidance", "Practice worksheets & analysis", "Email support"],
    color: "green",
  },
  {
    id: "gce-a-all",
    title: "A-Level All-Access",
    price: "15,000 XAF",
    period: "One-time payment",
    description: "Comprehensive package for advanced level students aiming for top scores.",
    features: ["Access to all A-Level subjects", "Advanced level mock papers", "Interactive AI quiz & analytics", "Priority support"],
    badge: "BEST VALUE",
    color: "orange",
    popular: true,
  },
];

export default function GcePricingPage() {
  return (
    <div className="flex min-h-screen bg-gray-50/50">
      <aside className="hidden lg:block w-64 shrink-0">
        <div className="fixed h-screen w-64">
          <Sidebar />
        </div>
      </aside>
      <div className="flex-1 flex flex-col min-w-0">
        <Topbar />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-6xl space-y-6">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <h1 className="text-2xl font-black text-gray-900 sm:text-3xl">GCE Exam Prep Pricing</h1>
            <p className="text-xs text-gray-500">Choose a package tailored to your exam path. Get immediate access to all curriculum files, past questions, and AI tutoring helpers.</p>
          </div>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 pt-4">
            {GCE_PLANS.map((plan) => (
              <PricingCard key={plan.id} plan={plan} />
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}
