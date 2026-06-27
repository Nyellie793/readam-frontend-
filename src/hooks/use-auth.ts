"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import AUTH from "@/services/auth.service";
import { saveSession, clearSession, getStoredUser } from "@/lib/auth";
import { isAdmin } from "@/lib/auth";
import { ROUTES } from "@/lib/constants";
import { ApiRequestError } from "@/lib/api";
import type { LoginPayload, RegisterPayload } from "@/types/user.types";

export function useAuth() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const login = useCallback(
    async (payload: LoginPayload) => {
      setLoading(true);
      try {
        const data = await AUTH.login(payload);
        saveSession(data);

        toast.success(`Welcome back, ${data.user.full_name.split(" ")[0]}!`);

        if (isAdmin(data.user)) {
          router.push(ROUTES.admin);
        } else {
          router.push(ROUTES.welcomeBack);
        }
      } catch (err) {
        const msg =
          err instanceof ApiRequestError
            ? err.detail
            : "Login failed. Please try again.";
        toast.error(msg);
      } finally {
        setLoading(false);
      }
    },
    [router]
  );

  const register = useCallback(
    async (payload: RegisterPayload) => {
      setLoading(true);
      try {
        const data = await AUTH.register(payload);
        saveSession(data);

        // Store name for onboarding pages (keeps existing onboarding flow working)
        localStorage.setItem("user_name", data.user.full_name);

        toast.success("Account created!");
        router.push(ROUTES.onboarding1);
      } catch (err) {
        const msg =
          err instanceof ApiRequestError
            ? err.detail
            : "Sign up failed. Please try again.";
        toast.error(msg);
      } finally {
        setLoading(false);
      }
    },
    [router]
  );

  const logout = useCallback(async () => {
    try {
      await AUTH.logout();
    } catch {
      // best-effort
    } finally {
      clearSession();
      router.push(ROUTES.login);
    }
  }, [router]);

  return { login, register, logout, loading, user: getStoredUser() };
}
