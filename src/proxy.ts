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
 *   /onboarding-* /welcome-back → must be authenticated
 *   /login /signup → redirect to home if already authenticated
 */
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { ADMIN_ROLES } from "@/lib/constants";

const ADMIN_ROUTES = /^\/admin(\/|$)/;
const AUTH_REQUIRED = /^\/(onboarding-\d|welcome-back)/;
const GUEST_ONLY = /^\/(login|signup)(\/|$)/;

export function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const isAuth = req.cookies.get("readam_auth")?.value === "1";
  const role = req.cookies.get("readam_role")?.value ?? "";
  const isAdminRole = (ADMIN_ROLES as readonly string[]).includes(role);

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
    "/onboarding-:path*",
    "/welcome-back",
    "/login",
    "/signup",
  ],
};
