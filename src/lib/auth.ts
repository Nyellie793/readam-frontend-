import { TOKEN_KEY, REFRESH_TOKEN_KEY, USER_KEY, ADMIN_ROLES } from "@/lib/constants";
import type { User, AuthResponse } from "@/types/user.types";

function notifyAuthChange(): void {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event("readam_auth_change"));
  }
}

export function saveSession(data: AuthResponse): void {
  // Tokens are nested under data.tokens in the actual API response
  localStorage.setItem(TOKEN_KEY, data.tokens.access_token);
  localStorage.setItem(REFRESH_TOKEN_KEY, data.tokens.refresh_token);
  localStorage.setItem(USER_KEY, JSON.stringify(data.user));

  // Write to plain cookies so Edge middleware can read them
  // (middleware cannot access localStorage)
  const maxAge = 60 * 60 * 24 * 7;
  const role = data.user.role ?? "";
  document.cookie = `readam_role=${role}; path=/; max-age=${maxAge}`;
  document.cookie = `readam_auth=1; path=/; max-age=${maxAge}`;
  notifyAuthChange();
}

export function updateStoredUser(user: User): void {
  localStorage.setItem(USER_KEY, JSON.stringify(user));
  const role = user.role ?? "";
  document.cookie = `readam_role=${role}; path=/; max-age=${60 * 60 * 24 * 7}`;
  notifyAuthChange();
}

export function clearSession(): void {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
  document.cookie = "readam_role=; path=/; max-age=0";
  document.cookie = "readam_auth=; path=/; max-age=0";
  if (typeof window !== "undefined") {
    sessionStorage.clear();
  }
  notifyAuthChange();
}

export function getStoredUser(): User | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? (JSON.parse(raw) as User) : null;
  } catch { return null; }
}

export function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(TOKEN_KEY);
}

export function isAuthenticated(): boolean {
  return !!getToken();
}

export function isAdmin(user: User | null): boolean {
  if (!user || !user.role) return false;
  return (ADMIN_ROLES as readonly string[]).includes(user.role);
}

/**
 * Where "Dashboard" should take this user.
 *
 * Every menu hardcoded /dashboard, so a tutor clicking Dashboard from the
 * landing page landed in the student area — a place they have no reason to be
 * and, for an admin, one the middleware bounces them straight out of.
 *
 * Returns the student dashboard for a signed-out user too, since the
 * middleware will send them to sign in from there anyway.
 */
export function homePathFor(user: User | null): string {
  if (isAdmin(user)) return "/admin";
  if (user?.role === "tutor") return "/tutor";
  return "/dashboard";
}
