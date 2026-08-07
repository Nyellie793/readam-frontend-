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
 *   /tutor/*    → tutor, or admin (they share the course editor)
 *   /onboarding-* /welcome-back /dashboard/* /notifications /settings
 *   /checkout /payment/* → must be authenticated
 *   /login /signup → redirect to home if already authenticated
 */
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { ADMIN_ROLES, ROUTES } from "@/lib/constants";

const ADMIN_LOGIN = ROUTES.adminLogin;

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

  // Redirect authenticated users without a role to /select-role
  if (isAuth && !role) {
    if (pathname !== "/select-role") {
      return NextResponse.redirect(new URL("/select-role", req.url));
    }
    return NextResponse.next();
  }

  /* ── Admin sign-in — guest-only, never gated by its own rule below ─────── */
  if (pathname === ADMIN_LOGIN) {
    if (isAuth && isAdminRole) {
      return NextResponse.redirect(new URL("/admin", req.url));
    }
    return NextResponse.next();
  }

  /* ── The old /admin/login must not confirm that an admin panel exists.
        404 rather than redirect, so a scanner learns nothing. ─────────────── */
  if (pathname === "/admin/login") {
    return NextResponse.rewrite(new URL("/not-found-404", req.url));
  }

  /* ── Admin routes ───────────────────────────────────────── */
  if (ADMIN_ROUTES.test(pathname)) {
    // Not logged in at all → go to admin login page
    if (!isAuth) {
      return NextResponse.redirect(new URL(ADMIN_LOGIN, req.url));
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
    // Admins share the tutor course editor rather than a duplicate of it, so
    // they are allowed in here too. The API enforces the same rule.
    if (role !== "tutor" && !isAdminRole) {
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
    "/readam-console/:path*",
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
