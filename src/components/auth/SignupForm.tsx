"use client";

import { useForm } from "react-hook-form";
import { z } from "zod/v4";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { useAuth } from "@/hooks/use-auth";
import Link from "next/link";

const schema = z.object({
  full_name: z.string().min(2, "Enter your full name"),
  email: z.email("Enter a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  terms: z.literal(true, { error: "You must accept the Terms of Service" }),
});
type FormData = z.infer<typeof schema>;

function GoogleIcon() {
  return (
    <svg className="h-5 w-5" viewBox="0 0 24 24" aria-hidden="true">
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
    </svg>
  );
}

export default function SignupForm() {
  const { register: registerUser, loading } = useAuth();
  const [showPw, setShowPw] = useState(false);
  const searchParams = useSearchParams();
  const role = searchParams.get("role") ?? "student";

  const { register, handleSubmit, formState: { errors } } =
    useForm<FormData>({ resolver: zodResolver(schema) });

  function onSubmit({ full_name, email, password }: FormData) {
    // role is passed separately — useAuth.register calls /v1/auth/role after /v1/auth/register
    registerUser({ full_name, email, password, role });
  }

  return (
    <div className="w-full max-w-2xl rounded-2xl border border-gray-100 bg-white px-8 py-10 shadow-sm sm:px-14 sm:py-12">
      <h1 className="text-center text-4xl font-black tracking-tight">
        Create Your <span className="text-blue-600">ReadAm</span>{" "}
        <span className="text-gray-900">Account</span>
      </h1>
      <p className="mt-3 text-center text-base text-gray-500">
        Join thousands of students leveraging AI to master their subjects.
      </p>
      <div className="mt-3 flex justify-center">
        <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-600 capitalize">
          Signing up as: {role}
        </span>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="mt-7 space-y-5">
        <div>
          <label className="text-sm font-semibold text-gray-700">Name</label>
          <input type="text" autoComplete="name" {...register("full_name")}
            placeholder="Alex Johnson"
            className="mt-2 w-full rounded-xl border border-gray-200 px-4 py-3.5 text-base placeholder:text-gray-300 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100" />
          {errors.full_name && <p className="mt-1 text-xs text-red-500">{errors.full_name.message}</p>}
        </div>

        <div>
          <label className="text-sm font-semibold text-gray-700">Email Address</label>
          <input type="email" autoComplete="email" {...register("email")}
            placeholder="alex@student.edu"
            className="mt-2 w-full rounded-xl border border-gray-200 px-4 py-3.5 text-base placeholder:text-gray-300 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100" />
          {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>}
        </div>

        <div>
          <label className="text-sm font-semibold text-gray-700">Create Password</label>
          <div className="relative mt-2">
            <input type={showPw ? "text" : "password"} autoComplete="new-password"
              {...register("password")} placeholder="Min. 8 characters"
              className="w-full rounded-xl border border-gray-200 px-4 py-3.5 pr-12 text-base placeholder:text-gray-300 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100" />
            <button type="button" onClick={() => setShowPw(v => !v)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              aria-label={showPw ? "Hide password" : "Show password"}>
              {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          {errors.password && <p className="mt-1 text-xs text-red-500">{errors.password.message}</p>}
        </div>

        <div>
          <label className="flex cursor-pointer items-start gap-3 select-none">
            <input type="checkbox" {...register("terms")}
              className="mt-0.5 h-4 w-4 shrink-0 rounded border-gray-300 text-blue-600" />
            <span className="text-sm text-gray-500">
              I agree to the{" "}
              <Link href="/terms" className="font-medium text-blue-600 hover:underline">Terms of Service</Link>
              {" "}and{" "}
              <Link href="/privacy" className="font-medium text-blue-600 hover:underline">Privacy Policy</Link>.
            </span>
          </label>
          {errors.terms && <p className="mt-1 text-xs text-red-500">{errors.terms.message as string}</p>}
        </div>

        <button type="submit" disabled={loading}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 py-4 text-base font-bold text-white shadow-md shadow-blue-200 transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60">
          {loading && <Loader2 className="h-4 w-4 animate-spin" />}
          {loading ? "Creating account…" : "Register Now"}
        </button>

        <div className="relative flex items-center gap-3">
          <div className="h-px flex-1 bg-gray-200" />
          <span className="shrink-0 text-sm text-gray-400">or</span>
          <div className="h-px flex-1 bg-gray-200" />
        </div>

        <button type="button"
          className="flex w-full items-center justify-center gap-3 rounded-xl border border-gray-200 py-3.5 text-sm font-medium text-gray-600 transition hover:bg-gray-50">
          <GoogleIcon />
          Sign in with Google
        </button>
      </form>
    </div>
  );
}
