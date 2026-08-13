import { NextResponse, type NextRequest } from "next/server";

/**
 * Google Identity Services redirect-mode callback.
 *
 * GIS renders its button in popup mode by default, which is fine on desktop.
 * On mobile, Safari's tracking prevention routinely blocks that popup and GIS
 * falls back to redirect mode, POSTing the credential to `login_uri`. That
 * defaulted to the current page, and App Router pages only answer GET, so the
 * POST dead-ended on a blank accounts.google.com/gsi/transform screen and
 * sign-up silently failed on every phone.
 *
 * This gives that POST somewhere real to land. It hands the credential back to
 * the client rather than exchanging it here, so the browser runs the exact same
 * googleAuth() path as the popup flow. One code path, not two.
 *
 * The credential is a Google ID token: short-lived, and worthless without our
 * backend verifying it against the client ID. It is passed in a single-use
 * cookie rather than a query string so it never lands in browser history,
 * referrer headers or server access logs.
 */

const HANDOFF_COOKIE = "readam_google_credential";
/** Where to send the user back to, written before the redirect leaves. */
const RETURN_COOKIE = "readam_google_return";

/** Where to send the user back to, restricted to our own paths.
 *  Decoded because the value was encodeURIComponent'd when written. */
function safeReturnPath(raw: string | null): string {
  if (!raw) return "/login";
  try {
    raw = decodeURIComponent(raw);
  } catch {
    return "/login";
  }
  // Reject anything that could leave the site: absolute URLs, protocol
  // relative URLs, or backslash tricks.
  if (!raw.startsWith("/") || raw.startsWith("//") || raw.includes("\\")) {
    return "/login";
  }
  return raw;
}

export async function POST(req: NextRequest) {
  let form: FormData;
  try {
    form = await req.formData();
  } catch {
    return NextResponse.redirect(new URL("/login?google_error=1", req.url), 303);
  }

  const credential = form.get("credential");
  const csrfBody = form.get("g_csrf_token");
  const csrfCookie = req.cookies.get("g_csrf_token")?.value;

  /**
   * Google's documented CSRF protection is a double-submit cookie: the same
   * token arrives in both the body and a cookie, and they must match. Without
   * this check an attacker could POST their own credential here and sign the
   * victim into the attacker's account.
   */
  if (
    typeof credential !== "string" ||
    !credential ||
    typeof csrfBody !== "string" ||
    !csrfBody ||
    !csrfCookie ||
    csrfBody !== csrfCookie
  ) {
    return NextResponse.redirect(new URL("/login?google_error=1", req.url), 303);
  }

  /**
   * The return path arrives in a cookie, not a query parameter.
   *
   * Google matches redirect_uri against the registered value exactly, so the
   * login_uri has to be one fixed string. Carrying ?return_to=… on it meant a
   * different URI per page and every attempt failed with
   * redirect_uri_mismatch.
   */
  const target = new URL(
    safeReturnPath(req.cookies.get(RETURN_COOKIE)?.value ?? null),
    req.url
  );
  target.searchParams.set("google", "1");

  // 303 forces the follow-up request to be a GET, so the browser does not
  // replay this POST against the page it lands on.
  const res = NextResponse.redirect(target, 303);

  // One use only — a stale return path would send the next sign-in to the
  // wrong page.
  res.cookies.set(RETURN_COOKIE, "", { path: "/", maxAge: 0 });

  res.cookies.set(HANDOFF_COOKIE, credential, {
    // Deliberately readable by JS: the client finishes the exchange, exactly
    // as it does in the popup flow.
    httpOnly: false,
    secure: req.nextUrl.protocol === "https:",
    sameSite: "lax",
    path: "/",
    maxAge: 120,
  });

  return res;
}
