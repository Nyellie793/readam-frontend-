/**
 * Next.js Edge Middleware — route protection.
 *
 * Reads two cookies written by src/lib/auth.ts after a successful login:
 *   readam_auth=1          → user is authenticated
 *   readam_role=admin      → user role
 *
 * Rules
 * ─────
 *   /admin/*    → must be authenticated AND have role admin|super_admin
 *   /onboarding-* /welcome-back /dashboard/* /notifications /settings
 *   /checkout /payment/* → must be authenticated
 *   /login /signup → redirect to home if already authenticated
 */
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { ADMIN_ROLES } from "@/lib/constants";

const ADMIN_ROUTES = /^\/admin(\/|$)/;
const TUTOR_ROUTES = /^\/tutor(\/|$)/;
const AUTH_REQUIRED =
  /^\/(onboarding-\d|welcome-back|dashboard|notifications|settings|checkout|payment)(\/|$)/;
const GUEST_ONLY = /^\/(login|signup)(\/|$)/;

export function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const isAuth = req.cookies.get("readam_auth")?.value === "1";
  const role = req.cookies.get("readam_role")?.value ?? "";
  const isAdminRole = (ADMIN_ROLES as readonly string[]).includes(role);

  /* ── Admin login page — guest-only, never gated by its own rule below ──── */
  if (pathname === "/admin/login") {
    if (isAuth && isAdminRole) {
      return NextResponse.redirect(new URL("/admin", req.url));
    }
    return NextResponse.next();
  }

  /* ── Admin routes ───────────────────────────────────────── */
  if (ADMIN_ROUTES.test(pathname)) {
    // Not logged in at all → go to admin login page
    if (!isAuth) {
      return NextResponse.redirect(new URL("/admin/login", req.url));
    }
    // Logged in but not an admin → go home
    if (!isAdminRole) {
      return NextResponse.redirect(new URL("/", req.url));
    }
  }

  /* ── Tutor routes ───────────────────────────────────────── */
  if (TUTOR_ROUTES.test(pathname)) {
    if (!isAuth) {
      return NextResponse.redirect(new URL("/login", req.url));
    }
    if (role !== "tutor") {
      return NextResponse.redirect(new URL("/", req.url));
    }
  }

  /* ── Auth-required routes (onboarding, welcome-back) ───── */
  if (AUTH_REQUIRED.test(pathname) && !isAuth) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  /* ── Guest-only routes (login, signup) ──────────────────── */
  if (GUEST_ONLY.test(pathname) && isAuth) {
    const dest = isAdminRole ? "/admin" : "/";
    return NextResponse.redirect(new URL(dest, req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/tutor/:path*",
    "/onboarding-:path*",
    "/welcome-back",
    "/login",
    "/signup",
    "/dashboard/:path*",
    "/notifications/:path*",
    "/settings/:path*",
    "/checkout/:path*",
    "/payment/:path*",
  ],
};
