import { api } from "@/lib/api";
import type {
  AuthResponse,
  LoginPayload,
  RegisterPayload,
  SetRolePayload,
  RefreshPayload,
  User,
} from "@/types/user.types";

const AUTH = {
  /** POST /v1/auth/register — creates account, role is null until setRole is called */
  register: (p: RegisterPayload) =>
    api.post<AuthResponse>("/v1/auth/register", p),

  /** POST /v1/auth/login */
  login: (p: LoginPayload) =>
    api.post<AuthResponse>("/v1/auth/login", p),

  /**
   * POST /v1/auth/role — set role after registration.
   * Only "student" or "tutor" allowed. Admin must be set in the DB.
   * Requires Bearer token from the register response.
   */
  setRole: (p: SetRolePayload) =>
    api.post<AuthResponse>("/v1/auth/role", p, true),

  /** GET /v1/auth/me */
  me: () => api.get<User>("/v1/auth/me", true),

  /** POST /v1/auth/refresh */
  refresh: (p: RefreshPayload) =>
    api.post<AuthResponse>("/v1/auth/refresh", p),

  /** POST /v1/auth/google — sign in with Google ID token */
  google: (google_id_token: string) =>
    api.post<AuthResponse>("/v1/auth/google", { google_id_token }),
};

export default AUTH;
