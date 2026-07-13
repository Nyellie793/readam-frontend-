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
