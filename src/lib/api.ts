import { API_BASE_URL, TOKEN_KEY, REFRESH_TOKEN_KEY } from "@/lib/constants";
import { clearSession } from "@/lib/auth";
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

// Some backend error details end with an API-consumer instruction, e.g.
// "... at POST /v1/subscriptions/purchase" — meant for developers reading the
// API docs, not for a student reading a toast. Strip that trailing clause.
function sanitizeDetail(detail: string): string {
  return detail.replace(/\s*at (GET|POST|PATCH|DELETE)\s+\/\S+\.?\s*$/i, "").trim();
}

export function errorMessage(err: unknown, fallback: string): string {
  if (!(err instanceof ApiRequestError)) return fallback;
  return sanitizeDetail(err.detail) || fallback;
}

function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(TOKEN_KEY);
}

function getRefreshToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(REFRESH_TOKEN_KEY);
}

async function parseError(res: Response): Promise<string> {
  try {
    const body = (await res.json()) as ApiError;
    if (typeof body.detail === "string") return body.detail;
    if (Array.isArray(body.detail)) return body.detail.map(e => e.msg).join(", ");
  } catch { /* ignore */ }
  return `Request failed (${res.status})`;
}

// Concurrent 401s should trigger exactly one refresh call, not one per request.
let refreshPromise: Promise<string | null> | null = null;

async function refreshAccessToken(): Promise<string | null> {
  const refreshToken = getRefreshToken();
  if (!refreshToken) return null;

  if (!refreshPromise) {
    refreshPromise = fetch(`${API_BASE_URL}/v1/auth/refresh`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refresh_token: refreshToken }),
    })
      .then(async (res) => {
        if (!res.ok) return null;
        const data = (await res.json()) as { access_token: string; refresh_token: string };
        localStorage.setItem(TOKEN_KEY, data.access_token);
        localStorage.setItem(REFRESH_TOKEN_KEY, data.refresh_token);
        return data.access_token;
      })
      .catch(() => null)
      .finally(() => {
        refreshPromise = null;
      });
  }
  return refreshPromise;
}

async function request<T>(
  path: string,
  options: RequestInit = {},
  auth = false,
  retried = false
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

  if (res.status === 401 && auth && !retried) {
    const newToken = await refreshAccessToken();
    if (newToken) {
      return request<T>(path, options, auth, true);
    }
    clearSession();
    if (typeof window !== "undefined") {
      window.location.href = "/login";
    }
    throw new ApiRequestError(401, "Session expired. Please log in again.");
  }

  if (!res.ok) throw new ApiRequestError(res.status, await parseError(res));
  if (res.status === 204) return undefined as T;
  return res.json() as Promise<T>;
}

/** Limits applied before we even ask the API for a presigned URL. */
export const UPLOAD_LIMITS = {
  image: { maxBytes: 5 * 1024 * 1024, types: ["image/jpeg", "image/png", "image/webp"] },
  document: { maxBytes: 25 * 1024 * 1024, types: ["application/pdf"] },
  attachment: {
    maxBytes: 10 * 1024 * 1024,
    types: ["image/jpeg", "image/png", "image/webp", "application/pdf"],
  },
} as const;

export type UploadKind = keyof typeof UPLOAD_LIMITS;

function humanSize(bytes: number): string {
  return bytes >= 1024 * 1024
    ? `${Math.round(bytes / (1024 * 1024))}MB`
    : `${Math.round(bytes / 1024)}KB`;
}

/**
 * Validate a file before requesting a presigned URL. The `accept` attribute on
 * a file input is only a picker hint — it does not stop a user dragging in a
 * 300MB video, and it is trivially bypassed.
 */
export function assertUploadable(file: File, kind: UploadKind): void {
  const { maxBytes, types } = UPLOAD_LIMITS[kind];

  if (!(types as readonly string[]).includes(file.type)) {
    const readable = types.map((t) => t.split("/")[1].toUpperCase()).join(", ");
    throw new ApiRequestError(415, `That file type isn't supported. Use ${readable}.`);
  }
  if (file.size > maxBytes) {
    throw new ApiRequestError(413, `That file is too large. The limit is ${humanSize(maxBytes)}.`);
  }
}

/**
 * PUT a file to a presigned storage URL and confirm it actually landed.
 *
 * Every upload in the app used to ignore this response. A rejected PUT (CORS
 * drift, expired presign, bucket policy) looked identical to success: the UI
 * showed a confirmation and stored a URL pointing at nothing. Course thumbnails
 * and lesson PDFs were published referencing objects that were never written.
 */
export async function putToPresigned(uploadUrl: string, file: File): Promise<void> {
  let res: Response;
  try {
    res = await fetch(uploadUrl, {
      method: "PUT",
      headers: { "Content-Type": file.type },
      body: file,
    });
  } catch {
    // fetch() throws rather than resolving when the preflight is blocked, so a
    // CORS misconfiguration is indistinguishable here from being offline.
    throw new ApiRequestError(
      0,
      "Could not reach file storage. If you are online, this is a server configuration issue — please report it."
    );
  }

  if (!res.ok) {
    // 403 from storage almost always means the bucket's CORS policy does not
    // list this origin, or the presigned URL has expired — not a bad file.
    const detail =
      res.status === 403
        ? "Upload was rejected by storage. This is usually a configuration issue rather than a problem with your file — please report it."
        : `Upload failed (${res.status}). Please try again, or pick a different file.`;
    throw new ApiRequestError(res.status, detail);
  }
}

export const api = {
  get:    <T>(path: string, auth = true)                 => request<T>(path, { method: "GET" }, auth),
  post:   <T>(path: string, body: unknown, auth = false) => request<T>(path, { method: "POST",  body: JSON.stringify(body) }, auth),
  patch:  <T>(path: string, body: unknown, auth = true)  => request<T>(path, { method: "PATCH", body: JSON.stringify(body) }, auth),
  delete: <T>(path: string, auth = true)                 => request<T>(path, { method: "DELETE" }, auth),
};
