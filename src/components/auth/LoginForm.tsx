"use client";

import { useForm } from "react-hook-form";
import { z } from "zod/v4";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import GoogleSignInButton from "@/components/auth/GoogleSignInButton";
import Link from "next/link";

const schema = z.object({
  email: z.email("Enter a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  remember: z.boolean().optional(),
});
type FormData = z.infer<typeof schema>;

export default function LoginForm() {
  const { login, googleAuth, loading } = useAuth();
  const [showPw, setShowPw] = useState(false);
  const { register, handleSubmit, formState: { errors } } =
    useForm<FormData>({ resolver: zodResolver(schema) });

  return (
    <div className="w-full max-w-2xl rounded-2xl border border-gray-100 bg-white px-8 py-10 shadow-sm sm:px-14 sm:py-14">
      <h1 className="text-center text-4xl font-black tracking-tight">
        <span className="text-blue-600">Welcome</span>{" "}
        <span className="text-gray-900">Back!</span>
      </h1>
      <p className="mt-3 text-center text-base text-gray-500">
        Your AI study companion is ready to help you learn smarter today.
      </p>

      <form onSubmit={handleSubmit(login)} className="mt-8 space-y-5">
        <div>
          <label className="text-sm font-semibold text-gray-700">Email Address</label>
          <input type="email" autoComplete="email" {...register("email")}
            placeholder="alex@student.edu"
            className="mt-2 w-full rounded-xl border border-gray-200 px-4 py-3.5 text-base placeholder:text-gray-300 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100" />
          {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>}
        </div>

        <div>
          <label className="text-sm font-semibold text-gray-700">Password</label>
          <div className="relative mt-2">
            <input type={showPw ? "text" : "password"} autoComplete="current-password"
              {...register("password")} placeholder="••••••••"
              className="w-full rounded-xl border border-gray-200 px-4 py-3.5 pr-12 text-base placeholder:text-gray-300 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100" />
            <button type="button" onClick={() => setShowPw(v => !v)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              aria-label={showPw ? "Hide password" : "Show password"}>
              {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          {errors.password && <p className="mt-1 text-xs text-red-500">{errors.password.message}</p>}
        </div>

        <div className="flex items-center justify-between">
          <label className="flex cursor-pointer items-center gap-2 text-sm text-gray-500 select-none">
            <input type="checkbox" {...register("remember")}
              className="h-4 w-4 rounded border-gray-300 text-blue-600" />
            Remember me
          </label>
          <Link href="/forgot-password" className="text-sm font-medium text-blue-600 hover:underline">
            Forgot Password?
          </Link>
        </div>

        <button type="submit" disabled={loading}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 py-4 text-base font-bold text-white shadow-md shadow-blue-200 transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60">
          {loading && <Loader2 className="h-4 w-4 animate-spin" />}
          {loading ? "Signing in…" : "Sign In"}
        </button>

        <div className="relative flex items-center gap-3">
          <div className="h-px flex-1 bg-gray-200" />
          <span className="shrink-0 text-sm text-gray-400">or</span>
          <div className="h-px flex-1 bg-gray-200" />
        </div>

        <GoogleSignInButton onCredential={(idToken) => googleAuth(idToken)} />

        {/* Mobile only - visible when navbar auth link is hidden*/}
        <p className="mt-6 text-center text-sm text-gray-500 sm:hidden">
          No account yet?{" "}
          <Link href="/select-role" className="font-semibold text-blue-600 hover:underline">
            Sign Up
          </Link>
        </p>
      </form>
    </div>
  );
}
