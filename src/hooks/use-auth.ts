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
        router.push("/dashboard");
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
        // Brand new account — finish role selection, then onboarding.
        const assignedRole = role ?? "student";
        const roleData = await AUTH.setRole({ role: assignedRole });
        saveSession(roleData);
        sessionStorage.setItem("login_type", "signup");
        toast.success("Account created! Let's personalise your experience.");
        router.push(assignedRole === "tutor" ? "/tutor/onboarding" : ROUTES.onboarding1);
        return;
      }

      sessionStorage.setItem("login_type", "login");
      toast.success(`Welcome back, ${data.user.full_name.split(" ")[0]}!`);
      if (isAdmin(data.user)) {
        router.push(ROUTES.admin);
      } else if (data.user.role === "tutor") {
        router.push("/tutor");
      } else {
        router.push("/dashboard");
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
