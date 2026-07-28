import Sidebar from "@/components/layout/Sidebar";
import Topbar from "@/components/layout/Topbar";
import AiSessionPricingCard, { AiSessionPlan } from "@/components/payment/AiSessionPricingCard";
import { ShieldCheck } from "lucide-react";

const AI_SESSIONS_PLANS: AiSessionPlan[] = [
  { id: "ai-single", title: "Single Session", price: "1,000 XAF", features: ["1 session of 45 minutes", "AI feedback"], color: "blue" },
  { id: "ai-starter", title: "Starter Bundle", price: "4,000 XAF", subBadge: "SAVE 1,000 XAF", features: ["5 sessions (45 mins each)", "Personal study plan"], color: "purple" },
  { id: "ai-study", title: "Study Bundle", price: "7,000 XAF", subBadge: "SAVE 3,000 XAF", features: ["10 sessions (45 mins each)", "Full subject mastery"], color: "pink" },
  { id: "ai-monthly", title: "Unlimited Monthly", price: "15,000 XAF", description: "RECOMMENDED", badge: "BEST VALUE", features: ["Unlimited sessions for 30 days", "24/7 AI tutor access", "Advanced analytics"], color: "orange", popular: true },
  { id: "ai-annual", title: "Unlimited Annual", price: "100,000 XAF", subBadge: "FOR PROFESSIONALS", features: ["Unlimited sessions for 365 days", "VIP Support access"], color: "green" },
];

export default function AiSessionsPricingPage() {
  return (
    <div className="flex min-h-screen bg-gray-50/50">
      <aside className="hidden lg:block w-64 shrink-0">
        <div className="fixed h-screen w-64"><Sidebar /></div>
      </aside>
      <div className="flex-1 flex flex-col min-w-0">
        <Topbar />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-6xl space-y-8">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <h1 className="text-3xl font-black text-gray-900">AI Study Sessions</h1>
            <p className="text-xs text-gray-500 max-w-2xl mx-auto leading-relaxed">
              Accelerate your learning with personalized AI-driven study sessions. Each session is designed to tackle your specific exam challenges and provide instant mastery over complex subjects.
            </p>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5 pt-2">
            {AI_SESSIONS_PLANS.map((plan) => (
              <AiSessionPricingCard key={plan.id} plan={plan} />
            ))}
          </div>
          <div className="flex gap-4 items-center rounded-2xl bg-blue-50/40 border border-blue-100 p-5 text-xs text-blue-900 max-w-5xl mx-auto">
            <ShieldCheck className="size-6 text-blue-600 shrink-0" />
            <div>
              <h4 className="font-bold text-blue-950">Secure Transactions</h4>
              <p className="text-[11px] text-gray-500 mt-0.5 leading-relaxed">All payments are encrypted and processed through local gateways to ensure your financial data remains 100% private and protected.</p>
            </div>
          </div>
          <div className="text-center pt-4 pb-6 space-y-2 border-t border-gray-200/60 max-w-5xl mx-auto">
            <p className="text-[9px] font-black text-gray-400 tracking-[0.25em] uppercase">Secured by Cameroon Interbank Systems</p>
            <p className="text-[10px] text-gray-400">© 2026 ReadAM Education. All rights reserved. Registered Educational Provider.</p>
          </div>
        </main>
      </div>
    </div>
  );
}
