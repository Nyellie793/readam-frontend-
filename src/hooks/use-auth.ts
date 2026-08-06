"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import AUTH from "@/services/auth.service";
import { saveSession, clearSession, getStoredUser, isAdmin } from "@/lib/auth";
import { ROUTES } from "@/lib/constants";
import { ApiRequestError } from "@/lib/api";
import type { LoginPayload, RegisterPayload } from "@/types/user.types";


/**
 * Where to land after signing in. `?next=` lets a gated action resume where the
 * user left off — e.g. asking the AI a question from the homepage.
 *
 * Read from window.location at submit time rather than via useSearchParams:
 * subscribing during render opts the whole page out of prerendering unless it
 * sits inside a Suspense boundary, which left /login and the admin sign-in
 * serving an empty shell until JavaScript hydrated.
 *
 * Only same-origin relative paths are accepted, so this cannot be used to
 * bounce someone to an external site after login.
 */
function readSafeNext(): string | null {
  if (typeof window === "undefined") return null;
  const value = new URLSearchParams(window.location.search).get("next");
  if (!value || !value.startsWith("/") || value.startsWith("//")) return null;
  return value;
}

export function useAuth() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const login = useCallback(async (payload: LoginPayload) => {
    setLoading(true);
    try {
      const data = await AUTH.login(payload);
      saveSession(data); // data.tokens.access_token is read inside saveSession
      sessionStorage.setItem("login_type", "login");

      toast.success(`Welcome back, ${data.user.full_name.split(" ")[0]}!`);

      // Role-based redirect — a returning user goes straight to their dashboard.
      // /welcome-back reuses the onboarding stepper shell, so it's reserved for
      // the moment right after finishing onboarding, not every login.
      if (isAdmin(data.user)) {
        router.push(ROUTES.admin);
      } else if (data.user.role === "tutor") {
        router.push("/tutor");
      } else {
        router.push(readSafeNext() ?? "/dashboard");
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
      sessionStorage.setItem("login_type", "signup");

      // Step 2: set the role selected on /select-role page
      const assignableRole = role === "tutor" ? "tutor" : "student";
      const roleData = await AUTH.setRole({ role: assignableRole });
      saveSession(roleData); // update stored user with role now set

      toast.success("Account created! Let's personalise your experience.");
      router.push(assignableRole === "tutor" ? "/tutor/onboarding" : ROUTES.onboarding1);
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

  /**
   * Google Sign-In (matches actual API):
   * POST /v1/auth/google finds-or-creates the account in one call. `role` is
   * only used the first time this Google account signs in (role comes back
   * null) — pass the role chosen on /select-role when called from signup,
   * omit it from login (defaults to student).
   */
  const googleAuth = useCallback(async (idToken: string, role?: "student" | "tutor") => {
    setLoading(true);
    try {
      const data = await AUTH.google(idToken);
      saveSession(data);

      if (!data.user.role) {
        // Brand new account
        if (role) {
          // Role was pre-selected (e.g. from signup page)
          const roleData = await AUTH.setRole({ role });
          saveSession(roleData);
          sessionStorage.setItem("login_type", "signup");
          toast.success("Account created! Let's personalise your experience.");
          router.push(role === "tutor" ? "/tutor/onboarding" : ROUTES.onboarding1);
        } else {
          // No role pre-selected (e.g. Google Sign-In from login page)
          // Save session first, then redirect to select-role page to choose role.
          saveSession(data);
          sessionStorage.setItem("login_type", "signup");
          toast.success("Account created! Please choose your role to continue.");
          router.push(ROUTES.selectRole);
        }
        return;
      }

      sessionStorage.setItem("login_type", "login");
      toast.success(`Welcome back, ${data.user.full_name.split(" ")[0]}!`);
      if (isAdmin(data.user)) {
        router.push(ROUTES.admin);
      } else if (data.user.role === "tutor") {
        router.push("/tutor");
      } else {
        router.push(readSafeNext() ?? "/dashboard");
      }
    } catch (err) {
      toast.error(
        err instanceof ApiRequestError
          ? err.detail
          : "Google sign-in failed. Please try again."
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

  return { login, register, googleAuth, logout, loading, user: getStoredUser() };
}
