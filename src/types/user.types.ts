export type UserRole = "student" | "tutor" | "admin" | "super_admin";

export interface User {
  id: string;
  full_name: string;
  email: string;
  role: UserRole;
  is_active: boolean;
  avatar_url?: string;
  created_at?: string;
}

export interface AuthTokens {
  access_token: string;
  token_type: string;
  refresh_token?: string;
}

export interface AuthResponse {
  user: User;
  access_token: string;
  token_type: string;
  refresh_token?: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  full_name: string;
  email: string;
  password: string;
}

export interface ApiError {
  detail: string | { msg: string; type: string }[];
  status?: number;
}
