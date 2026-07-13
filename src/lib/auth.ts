import { TOKEN_KEY, REFRESH_TOKEN_KEY, USER_KEY, ADMIN_ROLES } from "@/lib/constants";
import type { User, AuthResponse } from "@/types/user.types";

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
}

export function updateStoredUser(user: User): void {
  localStorage.setItem(USER_KEY, JSON.stringify(user));
  const role = user.role ?? "";
  document.cookie = `readam_role=${role}; path=/; max-age=${60 * 60 * 24 * 7}`;
}

export function clearSession(): void {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
  document.cookie = "readam_role=; path=/; max-age=0";
  document.cookie = "readam_auth=; path=/; max-age=0";
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
