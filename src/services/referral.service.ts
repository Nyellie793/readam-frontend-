import { api } from "@/lib/api";
import type {
  ReferralCheckResponse,
  ReferralOverview,
  ReferredPeoplePage,
} from "@/types/api.types";

const REFERRAL = {
  /** GET /v1/referrals/me — the caller's own code, created on first call, with its counts. */
  getMine: () => api.get<ReferralOverview>("/v1/referrals/me", true),

  /** GET /v1/referrals/me/people — everyone the code brought in, with what they bought. */
  getMyPeople: (page = 1, pageSize = 20) =>
    api.get<ReferredPeoplePage>(
      `/v1/referrals/me/people?page=${page}&page_size=${pageSize}`,
      true
    ),

  /** GET /v1/referrals/check/{code} — public; 400 when the code is unknown or deactivated. */
  check: (code: string) =>
    api.get<ReferralCheckResponse>(`/v1/referrals/check/${encodeURIComponent(code)}`, false),
};

export default REFERRAL;
