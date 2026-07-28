import { OrderItem } from "@/components/payment/OrderSummary";

export interface PlanDetail {
  items: OrderItem[];
  tax: string;
  total: string;
}

export const PLAN_DETAILS: Record<string, PlanDetail> = {
  "gce-o-single": { items: [{ name: "GCE O-Level Prep (Single Subject)", subtitle: "Full Course Access", price: "5,000 XAF" }], tax: "963 XAF", total: "5,963 XAF" },
  "gce-o-all": { items: [{ name: "GCE O-Level Prep (All-Access)", subtitle: "Full Course Access", price: "10,000 XAF" }], tax: "1,925 XAF", total: "11,925 XAF" },
  "gce-a-single": { items: [{ name: "GCE A-Level Prep (Single Subject)", subtitle: "Full Course Access", price: "8,000 XAF" }], tax: "1,540 XAF", total: "9,540 XAF" },
  "gce-a-all": { items: [{ name: "Advanced Mathematics for Baccalauréat (Series C)", subtitle: "Full Course Access", price: "15,000 XAF" }], tax: "2,887 XAF", total: "17,887 XAF" },
  "ai-single": { items: [{ name: "AI Study Sessions: Single", subtitle: "1 Session of 45 mins", price: "1,000 XAF" }], tax: "193 XAF", total: "1,193 XAF" },
  "ai-starter": { items: [{ name: "AI Study Sessions: Starter Bundle", subtitle: "5 Sessions + Study Plan", price: "4,000 XAF" }], tax: "770 XAF", total: "4,770 XAF" },
  "ai-study": { items: [{ name: "AI Study Sessions: Study Bundle", subtitle: "10 Sessions + Mastery", price: "7,000 XAF" }], tax: "1,348 XAF", total: "8,348 XAF" },
  "ai-monthly": { items: [{ name: "AI Study Sessions: Unlimited Monthly", subtitle: "30 Days Access", price: "15,000 XAF" }], tax: "2,887 XAF", total: "17,887 XAF" },
  "ai-annual": { items: [{ name: "AI Study Sessions: Unlimited Annual", subtitle: "365 Days Access", price: "100,000 XAF" }], tax: "19,250 XAF", total: "119,250 XAF" },
};
