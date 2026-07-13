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

      toast.success(`Welcome back, ${data.user.full_name.split(" ")[0]}!`);

      // Role-based redirect
      if (isAdmin(data.user)) {
        router.push(ROUTES.admin);
      } else {
        router.push(ROUTES.welcomeBack);
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
      localStorage.setItem("user_name", data.user.full_name);

      // Step 2: set the role selected on /select-role page
      const assignableRole = role === "tutor" ? "tutor" : "student";
      const roleData = await AUTH.setRole({ role: assignableRole });
      saveSession(roleData); // update stored user with role now set

      toast.success("Account created! Let's personalise your experience.");
      router.push(ROUTES.onboarding1);
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

  // No logout endpoint in the API — just clear local session
  const logout = useCallback(() => {
    clearSession();
    router.push(ROUTES.login);
  }, [router]);

  return { login, register, logout, loading, user: getStoredUser() };
}
