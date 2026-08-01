import { api } from "@/lib/api";
import type {
  AuthResponse,
  LoginPayload,
  RegisterPayload,
  SetRolePayload,
  RefreshPayload,
  TokenPair,
  User,
} from "@/types/user.types";
import type { AssetUploadResponse } from "@/types/api.types";

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

  /** POST /v1/auth/refresh — returns a bare token pair, not a full AuthResponse */
  refresh: (p: RefreshPayload) =>
    api.post<TokenPair>("/v1/auth/refresh", p),

  /** POST /v1/auth/google — sign in with Google ID token */
  google: (google_id_token: string) =>
    api.post<AuthResponse>("/v1/auth/google", { google_id_token }),

  /** PATCH /v1/auth/me — update name/email/phone/avatar. Send only fields you want to change. */
  updateProfile: (body: { full_name?: string; email?: string; phone?: string; avatar_url?: string }) =>
    api.patch<User>("/v1/auth/me", body, true),

  /** POST /v1/tutor/upload/asset — presigned R2 upload URL, open to any authenticated user. */
  requestAssetUpload: (filename: string, contentType: string) =>
    api.post<AssetUploadResponse>(
      "/v1/tutor/upload/asset",
      { filename, content_type: contentType },
      true
    ),

  /**
   * POST /v1/auth/change-password — omit current_password for a Google-only
   * account with no password yet (has_password === false on the stored user).
   */
  changePassword: (body: { current_password?: string; new_password: string }) =>
    api.post<AuthResponse>("/v1/auth/change-password", body, true),

  /**
   * POST /v1/auth/forgot-password — always returns the same generic message,
   * whether or not the email is registered (prevents account enumeration).
   */
  forgotPassword: (email: string) =>
    api.post<{ message: string }>("/v1/auth/forgot-password", { email }),

  /** POST /v1/auth/reset-password — consumes a reset token from the emailed link. */
  resetPassword: (body: { token: string; new_password: string }) =>
    api.post<{ message: string }>("/v1/auth/reset-password", body),
};

export default AUTH;
