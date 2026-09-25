import { api } from "@/lib/api";
import type { PromoCodeStatsPage } from "@/types/api.types";

const PROMO = {
  // GET /v1/promo-codes/stats/:token — public. What a promo code has earned,
  // for the influencer who holds it; the token in the link is the only key.
  getStats: (token: string, page = 1, pageSize = 20) =>
    api.get<PromoCodeStatsPage>(
      `/v1/promo-codes/stats/${encodeURIComponent(token)}?page=${page}&page_size=${pageSize}`,
      false
    ),
};

export default PROMO;
