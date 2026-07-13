#!/bin/bash
# Run from the root of your readam-frontend repo:
#   bash apply-improvements.sh
set -e
echo "Applying ReadAM improvements (API-accurate version)..."

mkdir -p src/app/select-role
mkdir -p src/app/admin/login
mkdir -p src/components/admin/tables
mkdir -p src/services src/lib src/hooks

# ─── src/types/user.types.ts ─────────────────────────────────────────────────
# Fixed: AuthResponse now matches actual API shape (tokens nested)
# Fixed: UserRole is student|tutor|admin only (no super_admin)
cat > src/types/user.types.ts << 'EOF'
export type UserRole = "student" | "tutor" | "admin";

export interface User {
  id: string;
  full_name: string;
  email: string;
  role: UserRole | null; // null immediately after register, before /v1/auth/role is called
  is_active: boolean;
  avatar_url?: string | null;
  created_at?: string;
}

// Matches the actual API AuthResponse schema:
// { user: UserResponse, tokens: TokenPair }
export interface AuthResponse {
  user: User;
  tokens: {
    access_token: string;
    refresh_token: string;
    token_type: string;
  };
}

// POST /v1/auth/login  body
export interface LoginPayload {
  email: string;
  password: string;
}

// POST /v1/auth/register  body (NO role field — role is set separately)
export interface RegisterPayload {
  full_name: string;
  email: string;
  password: string; // min 8 chars
}

// POST /v1/auth/role  body (only student or tutor — admin must be set in DB)
export interface SetRolePayload {
  role: "student" | "tutor";
}

// POST /v1/auth/refresh  body
export interface RefreshPayload {
  refresh_token: string;
}

export interface ApiError {
  detail: string | { msg: string; type: string }[];
  status?: number;
}
EOF

# ─── src/lib/constants.ts ────────────────────────────────────────────────────
# Fixed: ADMIN_ROLES only contains "admin" (no super_admin in API)
cat > src/lib/constants.ts << 'EOF'
export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "https://web-production-0dce.up.railway.app";

export const TOKEN_KEY         = "readam_access_token";
export const REFRESH_TOKEN_KEY = "readam_refresh_token";
export const USER_KEY          = "readam_user";

// UserRole enum from API only has "admin" — no super_admin
export const ADMIN_ROLES = ["admin"] as const;

export const ROUTES = {
  home:        "/",
  login:       "/login",
  signup:      "/signup",
  selectRole:  "/select-role",
  onboarding1: "/onboarding-1",
  onboarding2: "/onboarding-2",
  welcomeBack: "/welcome-back",
  admin:       "/admin",
  adminLogin:  "/admin/login",
} as const;
EOF

# ─── src/lib/api.ts ──────────────────────────────────────────────────────────
cat > src/lib/api.ts << 'EOF'
import { API_BASE_URL, TOKEN_KEY } from "@/lib/constants";
import type { ApiError } from "@/types/user.types";

export class ApiRequestError extends Error {
  status: number;
  detail: string;
  constructor(status: number, detail: string) {
    super(detail);
    this.status = status;
    this.detail = detail;
  }
}

function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(TOKEN_KEY);
}

async function parseError(res: Response): Promise<string> {
  try {
    const body = (await res.json()) as ApiError;
    if (typeof body.detail === "string") return body.detail;
    if (Array.isArray(body.detail)) return body.detail.map(e => e.msg).join(", ");
  } catch { /* ignore */ }
  return `Request failed (${res.status})`;
}

async function request<T>(
  path: string,
  options: RequestInit = {},
  auth = false
): Promise<T> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };
  if (auth) {
    const token = getToken();
    if (token) headers["Authorization"] = `Bearer ${token}`;
  }
  const res = await fetch(`${API_BASE_URL}${path}`, { ...options, headers });
  if (!res.ok) throw new ApiRequestError(res.status, await parseError(res));
  if (res.status === 204) return undefined as T;
  return res.json() as Promise<T>;
}

export const api = {
  get:    <T>(path: string, auth = true)                 => request<T>(path, { method: "GET" }, auth),
  post:   <T>(path: string, body: unknown, auth = false) => request<T>(path, { method: "POST",  body: JSON.stringify(body) }, auth),
  patch:  <T>(path: string, body: unknown, auth = true)  => request<T>(path, { method: "PATCH", body: JSON.stringify(body) }, auth),
  delete: <T>(path: string, auth = true)                 => request<T>(path, { method: "DELETE" }, auth),
};
EOF

# ─── src/lib/auth.ts ─────────────────────────────────────────────────────────
# Fixed: reads tokens from data.tokens.access_token (nested), not data.access_token
cat > src/lib/auth.ts << 'EOF'
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
EOF

# ─── src/services/auth.service.ts ────────────────────────────────────────────
# Fixed: all paths now use /v1/ prefix matching actual API
# Fixed: register has no role field
# Fixed: setRole is a separate call after register
# Fixed: no logout endpoint in the API
cat > src/services/auth.service.ts << 'EOF'
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
EOF

# ─── src/services/admin.service.ts ───────────────────────────────────────────
# Fixed: all paths use /v1/admin/ prefix matching actual API
# Fixed: endpoint names match actual API routes
cat > src/services/admin.service.ts << 'EOF'
import { api } from "@/lib/api";

const ADMIN = {
  /* ── Dashboard stats ─────────────────────────────────────────────────────── */
  /** GET /v1/admin/stats — courses, tutors, students counts */
  getStats: () => api.get("/v1/admin/stats"),

  /* ── Users ───────────────────────────────────────────────────────────────── */
  /** GET /v1/admin/users?role=student|tutor|admin&page=1&page_size=20 */
  getUsers: (page = 1, role?: string) =>
    api.get(`/v1/admin/users?page=${page}${role ? `&role=${role}` : ""}`),

  /** PATCH /v1/admin/users/{user_id} — suspend/reactivate or change role */
  updateUser: (userId: string, body: { is_active?: boolean; role?: string }) =>
    api.patch(`/v1/admin/users/${userId}`, body),

  /* ── Tutors ──────────────────────────────────────────────────────────────── */
  /** GET /v1/admin/tutors?filter_by=all|verified|pending_verification */
  getTutors: (page = 1, filter: "all" | "verified" | "pending_verification" = "all") =>
    api.get(`/v1/admin/tutors?page=${page}&filter_by=${filter}`),

  /** PATCH /v1/admin/tutors/{tutor_id}/verify */
  verifyTutor: (tutorId: string, is_verified: boolean) =>
    api.patch(`/v1/admin/tutors/${tutorId}/verify`, { is_verified }),

  /* ── Courses ─────────────────────────────────────────────────────────────── */
  /** GET /v1/admin/courses?status=pending_review|published|draft|rejected */
  getCourses: (page = 1, status?: string) =>
    api.get(`/v1/admin/courses?page=${page}${status ? `&status=${status}` : ""}`),

  /** GET /v1/admin/courses/{course_id} */
  getCourseDetail: (courseId: string) =>
    api.get(`/v1/admin/courses/${courseId}`),

  /** POST /v1/admin/courses/{course_id}/approve */
  approveCourse: (courseId: string) =>
    api.post(`/v1/admin/courses/${courseId}/approve`, {}, true),

  /** POST /v1/admin/courses/{course_id}/reject */
  rejectCourse: (courseId: string) =>
    api.post(`/v1/admin/courses/${courseId}/reject`, {}, true),

  /* ── Students ────────────────────────────────────────────────────────────── */
  /** GET /v1/admin/students?search=&page=1&page_size=20 */
  getStudents: (page = 1, search = "") =>
    api.get(`/v1/admin/students?page=${page}${search ? `&search=${encodeURIComponent(search)}` : ""}`),
};

export default ADMIN;
EOF

# ─── src/hooks/use-auth.ts ───────────────────────────────────────────────────
# Fixed: correct auth flow — register → setRole → navigate
# Fixed: no logout API call (endpoint doesn't exist)
# Fixed: reads tokens from data.tokens
cat > src/hooks/use-auth.ts << 'EOF'
"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import AUTH from "@/services/auth.service";
import { saveSession, clearSession, getStoredUser, isAdmin } from "@/lib/auth";
import { ROUTES } from "@/lib/constants";
import { ApiRequestError } from "@/lib/api";
import type { LoginPayload, RegisterPayload } from "@/types/user.types";

export function useAuth() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const login = useCallback(async (payload: LoginPayload) => {
    setLoading(true);
    try {
      const data = await AUTH.login(payload);
      saveSession(data); // data.tokens.access_token is read inside saveSession

      toast.success(`Welcome back, ${data.user.full_name.split(" ")[0]}!`);

      // Role-based redirect
      if (isAdmin(data.user)) {
        router.push(ROUTES.admin);
      } else {
        router.push(ROUTES.welcomeBack);
      }
    } catch (err) {
      toast.error(
        err instanceof ApiRequestError
          ? err.detail
          : "Login failed. Please check your credentials."
      );
    } finally {
      setLoading(false);
    }
  }, [router]);

  /**
   * Registration flow (matches actual API):
   * 1. POST /v1/auth/register  → account created, role = null
   * 2. POST /v1/auth/role      → role set to student|tutor
   * 3. Navigate to onboarding
   */
  const register = useCallback(async (
    payload: RegisterPayload & { role?: string }
  ) => {
    setLoading(true);
    try {
      const { role, ...registerPayload } = payload;

      // Step 1: create the account
      const data = await AUTH.register(registerPayload);
      saveSession(data);
      localStorage.setItem("user_name", data.user.full_name);

      // Step 2: set the role selected on /select-role page
      const assignableRole = role === "tutor" ? "tutor" : "student";
      const roleData = await AUTH.setRole({ role: assignableRole });
      saveSession(roleData); // update stored user with role now set

      toast.success("Account created! Let's personalise your experience.");
      router.push(ROUTES.onboarding1);
    } catch (err) {
      toast.error(
        err instanceof ApiRequestError
          ? err.detail
          : "Sign up failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }, [router]);

  // No logout endpoint in the API — just clear local session
  const logout = useCallback(() => {
    clearSession();
    router.push(ROUTES.login);
  }, [router]);

  return { login, register, logout, loading, user: getStoredUser() };
}
EOF

# ─── src/middleware.ts ────────────────────────────────────────────────────────
# Fixed: ADMIN_ROLES only "admin"
cat > src/middleware.ts << 'EOF'
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Only "admin" — the API has no super_admin role
const ADMIN_ROLES = ["admin"];

const ADMIN_ROUTES  = /^\/admin(\/|$)/;
const AUTH_REQUIRED = /^\/(onboarding-\d|welcome-back)/;
const GUEST_ONLY    = /^\/(login|signup|select-role)(\/|$)/;

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const isAuth      = req.cookies.get("readam_auth")?.value === "1";
  const role        = req.cookies.get("readam_role")?.value ?? "";
  const isAdminRole = ADMIN_ROLES.includes(role);

  // Protect /admin/* (except /admin/login itself)
  if (ADMIN_ROUTES.test(pathname) && !pathname.startsWith("/admin/login")) {
    if (!isAuth)      return NextResponse.redirect(new URL("/admin/login", req.url));
    if (!isAdminRole) return NextResponse.redirect(new URL("/", req.url));
  }

  // Protect onboarding and welcome-back
  if (AUTH_REQUIRED.test(pathname) && !isAuth) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // Redirect logged-in users away from guest-only pages
  if (GUEST_ONLY.test(pathname) && isAuth) {
    return NextResponse.redirect(new URL(isAdminRole ? "/admin" : "/", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/onboarding-:path*",
    "/welcome-back",
    "/login",
    "/signup",
    "/select-role",
  ],
};
EOF

# ─── src/components/auth/LoginForm.tsx ───────────────────────────────────────
# Fixed: password min 8 chars to match API (RegisterRequest minLength: 8)
cat > src/components/auth/LoginForm.tsx << 'EOF'
"use client";

import { useForm } from "react-hook-form";
import { z } from "zod/v4";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import Link from "next/link";

const schema = z.object({
  email: z.email("Enter a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  remember: z.boolean().optional(),
});
type FormData = z.infer<typeof schema>;

function GoogleIcon() {
  return (
    <svg className="h-5 w-5" viewBox="0 0 24 24" aria-hidden="true">
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
    </svg>
  );
}

export default function LoginForm() {
  const { login, loading } = useAuth();
  const [showPw, setShowPw] = useState(false);
  const { register, handleSubmit, formState: { errors } } =
    useForm<FormData>({ resolver: zodResolver(schema) });

  return (
    <div className="w-full max-w-2xl rounded-2xl border border-gray-100 bg-white px-8 py-10 shadow-sm sm:px-14 sm:py-14">
      <h1 className="text-center text-4xl font-black tracking-tight">
        <span className="text-blue-600">Welcome</span>{" "}
        <span className="text-gray-900">Back!</span>
      </h1>
      <p className="mt-3 text-center text-base text-gray-500">
        Your AI study companion is ready to help you learn smarter today.
      </p>

      <form onSubmit={handleSubmit(login)} className="mt-8 space-y-5">
        <div>
          <label className="text-sm font-semibold text-gray-700">Email Address</label>
          <input type="email" autoComplete="email" {...register("email")}
            placeholder="alex@student.edu"
            className="mt-2 w-full rounded-xl border border-gray-200 px-4 py-3.5 text-base placeholder:text-gray-300 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100" />
          {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>}
        </div>

        <div>
          <label className="text-sm font-semibold text-gray-700">Password</label>
          <div className="relative mt-2">
            <input type={showPw ? "text" : "password"} autoComplete="current-password"
              {...register("password")} placeholder="••••••••"
              className="w-full rounded-xl border border-gray-200 px-4 py-3.5 pr-12 text-base placeholder:text-gray-300 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100" />
            <button type="button" onClick={() => setShowPw(v => !v)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              aria-label={showPw ? "Hide password" : "Show password"}>
              {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          {errors.password && <p className="mt-1 text-xs text-red-500">{errors.password.message}</p>}
        </div>

        <div className="flex items-center justify-between">
          <label className="flex cursor-pointer items-center gap-2 text-sm text-gray-500 select-none">
            <input type="checkbox" {...register("remember")}
              className="h-4 w-4 rounded border-gray-300 text-blue-600" />
            Remember me
          </label>
          <Link href="/forgot-password" className="text-sm font-medium text-blue-600 hover:underline">
            Forgot Password?
          </Link>
        </div>

        <button type="submit" disabled={loading}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 py-4 text-base font-bold text-white shadow-md shadow-blue-200 transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60">
          {loading && <Loader2 className="h-4 w-4 animate-spin" />}
          {loading ? "Signing in…" : "Sign In"}
        </button>

        <div className="relative flex items-center gap-3">
          <div className="h-px flex-1 bg-gray-200" />
          <span className="shrink-0 text-sm text-gray-400">or</span>
          <div className="h-px flex-1 bg-gray-200" />
        </div>

        <button type="button"
          className="flex w-full items-center justify-center gap-3 rounded-xl border border-gray-200 py-3.5 text-sm font-medium text-gray-600 transition hover:bg-gray-50">
          <GoogleIcon />
          Sign in with Google
        </button>
      </form>
    </div>
  );
}
EOF

# ─── src/components/auth/SignupForm.tsx ──────────────────────────────────────
# Fixed: password min 8 chars, no role in register payload (set separately)
cat > src/components/auth/SignupForm.tsx << 'EOF'
"use client";

import { useForm } from "react-hook-form";
import { z } from "zod/v4";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { useAuth } from "@/hooks/use-auth";
import Link from "next/link";

const schema = z.object({
  full_name: z.string().min(2, "Enter your full name"),
  email: z.email("Enter a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  terms: z.literal(true, { error: "You must accept the Terms of Service" }),
});
type FormData = z.infer<typeof schema>;

function GoogleIcon() {
  return (
    <svg className="h-5 w-5" viewBox="0 0 24 24" aria-hidden="true">
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
    </svg>
  );
}

export default function SignupForm() {
  const { register: registerUser, loading } = useAuth();
  const [showPw, setShowPw] = useState(false);
  const searchParams = useSearchParams();
  const role = searchParams.get("role") ?? "student";

  const { register, handleSubmit, formState: { errors } } =
    useForm<FormData>({ resolver: zodResolver(schema) });

  function onSubmit({ full_name, email, password }: FormData) {
    // role is passed separately — useAuth.register calls /v1/auth/role after /v1/auth/register
    registerUser({ full_name, email, password, role });
  }

  return (
    <div className="w-full max-w-2xl rounded-2xl border border-gray-100 bg-white px-8 py-10 shadow-sm sm:px-14 sm:py-12">
      <h1 className="text-center text-4xl font-black tracking-tight">
        Create Your <span className="text-blue-600">ReadAm</span>{" "}
        <span className="text-gray-900">Account</span>
      </h1>
      <p className="mt-3 text-center text-base text-gray-500">
        Join thousands of students leveraging AI to master their subjects.
      </p>
      <div className="mt-3 flex justify-center">
        <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-600 capitalize">
          Signing up as: {role}
        </span>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="mt-7 space-y-5">
        <div>
          <label className="text-sm font-semibold text-gray-700">Name</label>
          <input type="text" autoComplete="name" {...register("full_name")}
            placeholder="Alex Johnson"
            className="mt-2 w-full rounded-xl border border-gray-200 px-4 py-3.5 text-base placeholder:text-gray-300 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100" />
          {errors.full_name && <p className="mt-1 text-xs text-red-500">{errors.full_name.message}</p>}
        </div>

        <div>
          <label className="text-sm font-semibold text-gray-700">Email Address</label>
          <input type="email" autoComplete="email" {...register("email")}
            placeholder="alex@student.edu"
            className="mt-2 w-full rounded-xl border border-gray-200 px-4 py-3.5 text-base placeholder:text-gray-300 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100" />
          {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>}
        </div>

        <div>
          <label className="text-sm font-semibold text-gray-700">Create Password</label>
          <div className="relative mt-2">
            <input type={showPw ? "text" : "password"} autoComplete="new-password"
              {...register("password")} placeholder="Min. 8 characters"
              className="w-full rounded-xl border border-gray-200 px-4 py-3.5 pr-12 text-base placeholder:text-gray-300 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100" />
            <button type="button" onClick={() => setShowPw(v => !v)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              aria-label={showPw ? "Hide password" : "Show password"}>
              {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          {errors.password && <p className="mt-1 text-xs text-red-500">{errors.password.message}</p>}
        </div>

        <div>
          <label className="flex cursor-pointer items-start gap-3 select-none">
            <input type="checkbox" {...register("terms")}
              className="mt-0.5 h-4 w-4 shrink-0 rounded border-gray-300 text-blue-600" />
            <span className="text-sm text-gray-500">
              I agree to the{" "}
              <Link href="/terms" className="font-medium text-blue-600 hover:underline">Terms of Service</Link>
              {" "}and{" "}
              <Link href="/privacy" className="font-medium text-blue-600 hover:underline">Privacy Policy</Link>.
            </span>
          </label>
          {errors.terms && <p className="mt-1 text-xs text-red-500">{errors.terms.message as string}</p>}
        </div>

        <button type="submit" disabled={loading}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 py-4 text-base font-bold text-white shadow-md shadow-blue-200 transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60">
          {loading && <Loader2 className="h-4 w-4 animate-spin" />}
          {loading ? "Creating account…" : "Register Now"}
        </button>

        <div className="relative flex items-center gap-3">
          <div className="h-px flex-1 bg-gray-200" />
          <span className="shrink-0 text-sm text-gray-400">or</span>
          <div className="h-px flex-1 bg-gray-200" />
        </div>

        <button type="button"
          className="flex w-full items-center justify-center gap-3 rounded-xl border border-gray-200 py-3.5 text-sm font-medium text-gray-600 transition hover:bg-gray-50">
          <GoogleIcon />
          Sign in with Google
        </button>
      </form>
    </div>
  );
}
EOF

# ─── src/app/select-role/page.tsx ────────────────────────────────────────────
cat > src/app/select-role/page.tsx << 'EOF'
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { FaGraduationCap } from "react-icons/fa6";
import Link from "next/link";
import { User, Bot } from "lucide-react";

const ROLES = [
  { id: "student", title: "Student", description: "Access personalized learning paths, AI tutoring, and track your progress.", Icon: User },
  { id: "tutor",   title: "Tutor",   description: "Create content, guide students with AI tools, and manage your teaching.",  Icon: Bot  },
] as const;
type Role = (typeof ROLES)[number]["id"];

export default function SelectRolePage() {
  const router = useRouter();
  const [selected, setSelected] = useState<Role>("student");

  return (
    <main className="min-h-screen bg-[#F4F6FB]">
      <header className="border-b bg-white px-6 py-4">
        <Link href="/"><FaGraduationCap className="h-7 w-7 text-blue-600" /></Link>
      </header>
      <div className="mx-auto flex min-h-[calc(100vh-65px)] max-w-3xl flex-col items-center justify-center px-6 py-14">
        <h1 className="text-center text-4xl font-black text-gray-900">How will you use ReadAm?</h1>
        <p className="mt-3 max-w-md text-center text-base text-gray-500">
          Choose a role to personalize your learning experience. You can change it anytime.
        </p>
        <div className="mt-10 grid w-full grid-cols-1 gap-5 sm:grid-cols-2">
          {ROLES.map(({ id, title, description, Icon }) => {
            const active = selected === id;
            return (
              <button key={id} type="button" onClick={() => setSelected(id)}
                className={`flex flex-col items-center gap-5 rounded-2xl border-2 bg-white px-6 py-10 text-center shadow-sm transition-all duration-200 ${active ? "border-blue-600 shadow-blue-100 shadow-lg" : "border-gray-200 hover:border-gray-300 hover:shadow-md"}`}>
                <span className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-50">
                  <Icon className="h-8 w-8 text-blue-600" />
                </span>
                <div>
                  <p className="text-xl font-bold text-gray-900">{title}</p>
                  <p className="mt-2 text-sm leading-relaxed text-gray-500">{description}</p>
                </div>
                <div className={`flex h-6 w-6 items-center justify-center rounded-full border-2 transition-colors ${active ? "border-blue-600 bg-blue-600" : "border-gray-300 bg-white"}`}>
                  {active && <div className="h-2.5 w-2.5 rounded-full bg-white" />}
                </div>
              </button>
            );
          })}
        </div>
        <button type="button" onClick={() => router.push(`/signup?role=${selected}`)}
          className="mt-10 rounded-xl bg-blue-600 px-16 py-4 text-base font-bold text-white shadow-md shadow-blue-200 transition hover:bg-blue-700">
          Continue
        </button>
      </div>
    </main>
  );
}
EOF

# ─── src/app/login/page.tsx ──────────────────────────────────────────────────
cat > src/app/login/page.tsx << 'EOF'
import AuthNavbar from "@/components/auth/AuthNavbar";
import LoginForm from "@/components/auth/LoginForm";

export default function LoginPage() {
  return (
    <main className="min-h-screen bg-[#F7F8FC]">
      <AuthNavbar text="No account yet?" buttonText="Sign Up" href="/select-role" />
      <section className="mx-auto flex min-h-[calc(100vh-65px)] max-w-7xl items-center justify-center px-6 py-10">
        <LoginForm />
      </section>
    </main>
  );
}
EOF

# ─── src/app/signup/page.tsx ─────────────────────────────────────────────────
cat > src/app/signup/page.tsx << 'EOF'
import { Suspense } from "react";
import AuthNavbar from "@/components/auth/AuthNavbar";
import SignupForm from "@/components/auth/SignupForm";
import { Skeleton } from "@/components/ui/skeleton";

export default function SignupPage() {
  return (
    <main className="min-h-screen bg-[#F7F8FC]">
      <AuthNavbar text="Already have an account?" buttonText="Sign In" href="/login" />
      <section className="mx-auto flex min-h-[calc(100vh-65px)] max-w-7xl items-center justify-center px-6 py-10">
        <Suspense fallback={
          <div className="w-full max-w-2xl space-y-4 rounded-2xl border bg-white p-14">
            <Skeleton className="mx-auto h-9 w-64" />
            <Skeleton className="mx-auto h-4 w-80" />
            <Skeleton className="h-12 w-full rounded-xl" />
            <Skeleton className="h-12 w-full rounded-xl" />
            <Skeleton className="h-12 w-full rounded-xl" />
            <Skeleton className="h-12 w-full rounded-xl" />
          </div>
        }>
          <SignupForm />
        </Suspense>
      </section>
    </main>
  );
}
EOF

# ─── src/app/welcome-back/page.tsx ───────────────────────────────────────────
cat > src/app/welcome-back/page.tsx << 'EOF'
"use client";

import { useState, useEffect } from "react";
import Welcome from "@/components/onboarding/Welcome";
import OnboardingShell from "@/components/onboarding/OnboardingShell";

export default function WelcomeBack() {
  const [name, setName] = useState<string>("there");
  const [interests, setInterests] = useState<string[]>([]);

  useEffect(() => {
    const storedName = localStorage.getItem("user_name") || "there";
    try {
      const raw = localStorage.getItem(`${storedName}_interests`);
      setInterests(raw ? (JSON.parse(raw) as string[]) : []);
    } catch { setInterests([]); }
    setName(storedName);
  }, []);

  return (
    <OnboardingShell currentStep={2}>
      <Welcome interests={interests} userName={name} onBack={() => window.history.back()} />
    </OnboardingShell>
  );
}
EOF

# ─── src/components/onboarding/OnboardingShell.tsx ───────────────────────────
cat > src/components/onboarding/OnboardingShell.tsx << 'EOF'
import Logo from "@/components/shared/Logo";

const steps = ["Interest", "Goal", "Welcome"];
type Props = { currentStep: number; children: React.ReactNode; };

export default function OnboardingShell({ currentStep, children }: Props) {
  return (
    <div className="min-h-screen bg-[#F4F6FB]">
      <header className="border-b bg-white px-6 py-4">
        <Logo />
      </header>
      <div className="mx-auto mt-10 flex max-w-xl items-center justify-center px-6">
        {steps.map((label, i) => (
          <div key={label} className="flex flex-1 flex-col items-center">
            <div className="flex w-full items-center">
              {i > 0 && <div className={`h-px flex-1 transition-colors duration-300 ${i <= currentStep ? "bg-blue-600" : "bg-gray-200"}`} />}
              <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-bold transition-all duration-300 ${i <= currentStep ? "bg-blue-600 text-white shadow-md shadow-blue-200" : "border-2 border-gray-200 bg-white text-gray-400"}`}>
                {i + 1}
              </div>
              {i < steps.length - 1 && <div className={`h-px flex-1 transition-colors duration-300 ${i < currentStep ? "bg-blue-600" : "bg-gray-200"}`} />}
            </div>
            <span className={`mt-2 text-xs font-medium transition-colors duration-300 ${i <= currentStep ? "font-bold text-gray-900" : "text-gray-400"}`}>
              {label}
            </span>
          </div>
        ))}
      </div>
      <div className="mt-10 px-4 pb-16">{children}</div>
    </div>
  );
}
EOF

# ─── src/components/sections/HeroImage.tsx ───────────────────────────────────
cat > src/components/sections/HeroImage.tsx << 'EOF'
import Image from "next/image";
import { TrendingUp, Sparkles } from "lucide-react";

export default function HeroImage() {
  return (
    <div className="relative flex h-full w-full items-center justify-center py-6 lg:py-0">
      <div className="absolute inset-x-[4%] inset-y-[2%] -z-10 rounded-[3rem] bg-gradient-to-br from-blue-200/60 via-white/30 to-orange-200/50 blur-2xl" />
      <div className="relative w-[88%] sm:w-[72%] md:w-[60%] lg:w-[86%] xl:w-[78%]">
        <div className="relative rounded-[2rem] bg-gradient-to-br from-blue-400/50 via-white/70 to-orange-300/40 p-[3px] shadow-[0_32px_64px_-16px_rgba(37,99,235,0.30)]">
          <div className="relative overflow-hidden rounded-[calc(2rem-3px)] bg-white/50 backdrop-blur-sm">
            <Image src="/hero.png" alt="Student using ReadAM on a laptop" width={520} height={580}
              className="relative z-10 h-[300px] w-full object-cover object-[center_15%] sm:h-[380px] md:h-[420px] lg:h-[460px]"
              priority />
            <div className="pointer-events-none absolute bottom-0 left-0 h-[18%] w-full bg-gradient-to-b from-transparent to-white/50" />
          </div>
        </div>
        <div className="absolute -right-3 -top-4 z-20 flex animate-bounce items-center gap-1.5 rounded-2xl bg-white/95 px-3 py-2 shadow-lg ring-1 ring-black/5 backdrop-blur-sm [animation-duration:3.5s]">
          <Sparkles className="h-3.5 w-3.5 text-orange-400" />
          <span className="text-[11px] font-bold text-gray-700">AI Powered</span>
        </div>
        <div className="absolute -left-4 bottom-[16%] z-20 flex flex-col gap-1 rounded-2xl bg-white/95 px-4 py-3 shadow-xl ring-1 ring-black/5 backdrop-blur-sm sm:-left-5">
          <div className="flex items-center gap-1.5">
            <TrendingUp className="h-4 w-4 text-green-500" />
            <span className="text-base font-black text-gray-900">94%</span>
          </div>
          <p className="text-[11px] leading-tight text-gray-500">Success rate for active<br />READAM students</p>
        </div>
      </div>
    </div>
  );
}
EOF

# ─── src/app/admin/login/layout.tsx ──────────────────────────────────────────
cat > src/app/admin/login/layout.tsx << 'EOF'
export default function AdminLoginLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
EOF

# ─── src/app/admin/login/page.tsx ────────────────────────────────────────────
cat > src/app/admin/login/page.tsx << 'EOF'
"use client";
import { useForm } from "react-hook-form";
import { z } from "zod/v4";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, Loader2, ShieldCheck } from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";

const schema = z.object({
  email: z.email("Enter a valid email"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});
type FormData = z.infer<typeof schema>;

export default function AdminLoginPage() {
  const { login, loading } = useAuth();
  const [showPw, setShowPw] = useState(false);
  const { register, handleSubmit, formState: { errors } } =
    useForm<FormData>({ resolver: zodResolver(schema) });

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#0B1437] px-6 py-12">
      <div className="w-full max-w-md">
        <div className="mb-8 flex flex-col items-center gap-3">
          <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-600 shadow-lg">
            <ShieldCheck className="h-7 w-7 text-white" />
          </span>
          <div className="text-center">
            <h1 className="text-2xl font-black text-white">Admin Portal</h1>
            <p className="mt-1 text-sm text-white/40">ReadAM Management System</p>
          </div>
        </div>
        <div className="rounded-2xl border border-white/10 bg-white/5 p-8 backdrop-blur-sm">
          <form onSubmit={handleSubmit(login)} className="space-y-5">
            <div>
              <label className="text-sm font-medium text-white/70">Admin Email</label>
              <input type="email" autoComplete="email" {...register("email")} placeholder="admin@readam.ai"
                className="mt-1.5 w-full rounded-xl border border-white/10 bg-white/10 px-4 py-3 text-white placeholder:text-white/30 outline-none focus:border-blue-500" />
              {errors.email && <p className="mt-1 text-xs text-red-400">{errors.email.message}</p>}
            </div>
            <div>
              <label className="text-sm font-medium text-white/70">Password</label>
              <div className="relative">
                <input type={showPw ? "text" : "password"} autoComplete="current-password"
                  {...register("password")} placeholder="••••••••"
                  className="mt-1.5 w-full rounded-xl border border-white/10 bg-white/10 px-4 py-3 pr-11 text-white placeholder:text-white/30 outline-none focus:border-blue-500" />
                <button type="button" onClick={() => setShowPw(v => !v)}
                  className="absolute right-3 top-1/2 mt-0.5 -translate-y-1/2 text-white/30 hover:text-white/70">
                  {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {errors.password && <p className="mt-1 text-xs text-red-400">{errors.password.message}</p>}
            </div>
            <button type="submit" disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:opacity-60">
              {loading && <Loader2 className="h-4 w-4 animate-spin" />}
              {loading ? "Verifying…" : "Access Dashboard"}
            </button>
          </form>
        </div>
        <p className="mt-6 text-center text-xs text-white/20">ReadAM Admin · Restricted access only</p>
      </div>
    </main>
  );
}
EOF

echo ""
echo "✅  All files written successfully!"
echo ""
echo "Next steps:"
echo "  npm install"
echo "  npm run dev"
echo ""
echo "─────────────────────────────────────────────────"
echo "HOW TO GET ADMIN ACCESS:"
echo "─────────────────────────────────────────────────"
echo "1. Register a normal account at /select-role → /signup"
echo "2. Ask your backend dev (or use a DB tool like TablePlus/pgAdmin) to run:"
echo "   UPDATE users SET role = 'admin' WHERE email = 'your@email.com';"
echo "3. Log out and log back in at /admin/login"
echo "4. You will be redirected to /admin dashboard"
echo "─────────────────────────────────────────────────"
