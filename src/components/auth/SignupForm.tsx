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
  full_name: z.string().min(2, "Enter your full name"),
  email: z.email("Enter a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  terms: z.literal(true, { error: "You must accept the Terms of Service" }),
});
type FormData = z.infer<typeof schema>;

interface SignupFormProps {
  /** Chosen on /select-role and passed down from the page, which reads it
   *  server-side. Reading it here with useSearchParams meant the entire form —
   *  including the Google button — could not be prerendered. */
  role: string;
}

export default function SignupForm({ role }: SignupFormProps) {
  const { register: registerUser, googleAuth, loading } = useAuth();
  const [showPw, setShowPw] = useState(false);

  const { register, handleSubmit, formState: { errors } } =
    useForm<FormData>({ resolver: zodResolver(schema) });

  function onSubmit({ full_name, email, password }: FormData) {
    // role is passed separately — useAuth.register calls /v1/auth/role after /v1/auth/register
    registerUser({ full_name: full_name, email, password, role });
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

        <GoogleSignInButton onCredential={(idToken) => googleAuth(idToken, role === "tutor" ? "tutor" : "student")} />
        {/* Mobile only — visible when navbar auth link is hidden */}
        <p className="mt-6 text-center text-sm text-gray-500 sm:hidden">
          Already have an account?{" "}
          <Link href="/login" className="font-semibold text-blue-600 hover:underline">
            Sign In
          </Link>
        </p>
      </form>
    </div>
  );
}
