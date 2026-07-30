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
};
