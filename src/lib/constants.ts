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
