/**
 * Auth service — wraps every authentication API endpoint.
 *
 * Endpoints are based on the backend API at:
 *   https://web-production-0dce.up.railway.app/docs
 *
 * Update the path strings below if the actual routes differ from these
 * conventional FastAPI defaults.
 */
import { api } from "@/lib/api";
import type { AuthResponse, LoginPayload, RegisterPayload, User } from "@/types/user.types";

const AUTH = {
  /** POST /auth/register */
  register: (payload: RegisterPayload) =>
    api.post<AuthResponse>("/auth/register", payload),

  /** POST /auth/login  (form-encoded or JSON — adjust if needed) */
  login: (payload: LoginPayload) =>
    api.post<AuthResponse>("/auth/login", payload),

  /** GET /auth/me — returns the current user from their JWT */
  me: () => api.get<User>("/auth/me", true),

  /** POST /auth/logout */
  logout: () => api.post<void>("/auth/logout", {}, true),

  /** POST /auth/refresh */
  refresh: (refreshToken: string) =>
    api.post<AuthResponse>("/auth/refresh", { refresh_token: refreshToken }),
};

export default AUTH;
