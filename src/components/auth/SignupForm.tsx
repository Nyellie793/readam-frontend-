"use client";

import Link from "next/link";
import { useForm } from "react-hook-form";
import { z } from "zod/v4";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";

const schema = z
  .object({
    full_name: z.string().min(2, "Enter your full name"),
    email: z.email("Enter a valid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirm_password: z.string(),
  })
  .refine((d) => d.password === d.confirm_password, {
    message: "Passwords do not match",
    path: ["confirm_password"],
  });

type FormData = z.infer<typeof schema>;

export default function SignupForm() {
  const { register: registerUser, loading } = useAuth();
  const [showPw, setShowPw] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  function onSubmit({ full_name, email, password }: FormData) {
    registerUser({ full_name, email, password });
  }

  return (
    <div className="w-full max-w-md rounded-2xl border bg-white p-6 shadow-sm sm:p-8">
      <h1 className="text-center text-3xl font-bold">
        Create Your <span className="text-blue-600">ReadAM</span> Account
      </h1>
      <p className="mt-2 text-center text-sm text-gray-500">
        Join students learning smarter with AI
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-4">
        {/* Full name */}
        <div>
          <label className="text-sm text-gray-600">Full Name</label>
          <input
            type="text"
            autoComplete="name"
            {...register("full_name")}
            placeholder="John Doe"
            className="mt-1 w-full rounded-xl border px-4 py-3 text-base outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
          />
          {errors.full_name && (
            <p className="mt-1 text-xs text-red-500">{errors.full_name.message}</p>
          )}
        </div>

        {/* Email */}
        <div>
          <label className="text-sm text-gray-600">Email</label>
          <input
            type="email"
            autoComplete="email"
            {...register("email")}
            placeholder="you@example.com"
            className="mt-1 w-full rounded-xl border px-4 py-3 text-base outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
          />
          {errors.email && (
            <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>
          )}
        </div>

        {/* Password */}
        <div>
          <label className="text-sm text-gray-600">Password</label>
          <div className="relative">
            <input
              type={showPw ? "text" : "password"}
              autoComplete="new-password"
              {...register("password")}
              placeholder="••••••••"
              className="mt-1 w-full rounded-xl border px-4 py-3 pr-11 text-base outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
            />
            <button
              type="button"
              onClick={() => setShowPw((v) => !v)}
              className="absolute right-3 top-1/2 mt-0.5 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              aria-label={showPw ? "Hide password" : "Show password"}
            >
              {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          {errors.password && (
            <p className="mt-1 text-xs text-red-500">{errors.password.message}</p>
          )}
        </div>

        {/* Confirm password */}
        <div>
          <label className="text-sm text-gray-600">Confirm Password</label>
          <input
            type={showPw ? "text" : "password"}
            autoComplete="new-password"
            {...register("confirm_password")}
            placeholder="••••••••"
            className="mt-1 w-full rounded-xl border px-4 py-3 text-base outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
          />
          {errors.confirm_password && (
            <p className="mt-1 text-xs text-red-500">
              {errors.confirm_password.message}
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 py-3 font-semibold text-white transition hover:bg-blue-700 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading && <Loader2 className="h-4 w-4 animate-spin" />}
          {loading ? "Creating account…" : "Sign Up"}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-gray-500 sm:hidden">
        Already have an account?{" "}
        <Link className="font-medium text-blue-600" href="/login">
          Sign In
        </Link>
      </p>
    </div>
  );
}
