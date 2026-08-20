/**
 * Next.js Edge Middleware — route protection.
 *
 * Named proxy.ts, not middleware.ts: Next 16 renamed the convention, and the
 * old name builds with a deprecation warning today but stops working on a
 * later upgrade.
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
import { DEFAULT_LOCALE, LOCALE_COOKIE, isLocale } from "@/i18n/locales";

const ADMIN_LOGIN = ROUTES.adminLogin;

const ADMIN_ROUTES = /^\/admin(\/|$)/;
const TUTOR_ROUTES = /^\/tutor(\/|$)/;
const AUTH_REQUIRED =
  /^\/(onboarding-\d|welcome-back|dashboard|notifications|settings|checkout|payment)(\/|$)/;
const GUEST_ONLY = /^\/(login|signup)(\/|$)/;

/**
 * Rewrite the request onto the [locale] segment.
 *
 * Visitors never see a prefix: /about stays /about in the address bar, in
 * canonical tags, in the sitemap and in Open Graph URLs. Internally it is
 * served by /en/about or /fr/about, which is what lets those routes be
 * pre-rendered at build time instead of rendered per request.
 */
function withLocale(req: NextRequest, pathname?: string) {
  const cookie = req.cookies.get(LOCALE_COOKIE)?.value;
  const locale = isLocale(cookie) ? cookie : DEFAULT_LOCALE;
  const url = req.nextUrl.clone();
  url.pathname = `/${locale}${pathname ?? req.nextUrl.pathname}`;
  return NextResponse.rewrite(url);
}

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
    return withLocale(req);
  }

  /* ── Admin sign-in — guest-only, never gated by its own rule below ─────── */
  if (pathname === ADMIN_LOGIN) {
    if (isAuth && isAdminRole) {
      return NextResponse.redirect(new URL("/admin", req.url));
    }
    return withLocale(req);
  }

  /* ── The old /admin/login must not confirm that an admin panel exists.
        404 rather than redirect, so a scanner learns nothing. ─────────────── */
  if (pathname === "/admin/login") {
    return withLocale(req, "/not-found-404");
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
    // Admins edit courses at /admin/courses/[id]/edit, which mounts the same
    // editor inside the admin panel, so they have no reason to be in here.
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

  return withLocale(req);
}

export const config = {
  // Every page route, because the locale rewrite is site-wide. Excluded:
  // /api (JSON, locale-independent), Next internals, the metadata routes
  // /icon and /opengraph-image, and anything with a file extension
  // (/sw.js, /robots.txt, /sitemap.xml, /manifest.webmanifest, /icons/*).
  matcher: ["/((?!api|_next|icon|opengraph-image|.*\\..*).*)"],
};
