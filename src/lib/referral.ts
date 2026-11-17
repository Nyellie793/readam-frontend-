/**
 * The referral code a visitor arrived with, kept until they sign up.
 *
 * A share link is /signup?ref=CODE, but people browse first, so the code is
 * remembered from whichever page they land on (see ReferralCapture) and sent
 * with the registration or Google sign-in that creates their account. Browser
 * storage only: a missing or blocked store just means no code is attached.
 */

const KEY = "readam_referral_code";

// Mirrors the API's rule: 3-32 of A-Z, 0-9, hyphen, underscore, starting with
// a letter or digit. Anything else is not worth remembering or sending.
const CODE_PATTERN = /^[A-Z0-9][A-Z0-9_-]{2,31}$/;

/** Canonical form of a typed code, or null if it cannot be one. */
export function normalizeReferralCode(raw: string | null | undefined): string | null {
  const code = (raw ?? "").trim().toUpperCase();
  return CODE_PATTERN.test(code) ? code : null;
}

export function getStoredReferralCode(): string | null {
  try {
    return normalizeReferralCode(window.localStorage.getItem(KEY));
  } catch {
    return null;
  }
}

export function storeReferralCode(raw: string | null | undefined): void {
  const code = normalizeReferralCode(raw);
  if (!code) return;
  try {
    window.localStorage.setItem(KEY, code);
  } catch {
    /* storage blocked: the code simply is not remembered */
  }
}

export function clearStoredReferralCode(): void {
  try {
    window.localStorage.removeItem(KEY);
  } catch {
    /* nothing to clear */
  }
}

/** The link a user shares: it lands on signup with their code attached. */
export function referralLink(origin: string, code: string): string {
  return `${origin}/signup?ref=${encodeURIComponent(code)}`;
}
