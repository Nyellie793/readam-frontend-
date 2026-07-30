"use client";

import { useForm } from "react-hook-form";
import { z } from "zod/v4";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, MailCheck } from "lucide-react";
import { useState } from "react";
import Link from "next/link";
import AUTH from "@/services/auth.service";
import { toast } from "sonner";

const schema = z.object({
  email: z.email("Enter a valid email address"),
});
type FormData = z.infer<typeof schema>;

export default function ForgotPasswordForm() {
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  async function onSubmit(data: FormData) {
    setLoading(true);
    try {
      await AUTH.forgotPassword(data.email);
      setSent(true);
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  if (sent) {
    return (
      <div className="w-full max-w-2xl rounded-2xl border border-gray-100 bg-white px-8 py-10 text-center shadow-sm sm:px-14 sm:py-14">
        <div className="mx-auto flex size-14 items-center justify-center rounded-full bg-blue-50 text-blue-600">
          <MailCheck className="size-7" />
        </div>
        <h1 className="mt-5 text-2xl font-black text-gray-900">Check your email</h1>
        <p className="mt-3 text-base text-gray-500">
          If that email is registered, we&apos;ve sent a link to reset your password. It expires in 30 minutes.
        </p>
        <Link
          href="/login"
          className="mt-8 inline-block rounded-xl bg-blue-600 px-6 py-3 text-sm font-bold text-white hover:bg-blue-700"
        >
          Back to Login
        </Link>
      </div>
    );
  }

  return (
    <div className="w-full max-w-2xl rounded-2xl border border-gray-100 bg-white px-8 py-10 shadow-sm sm:px-14 sm:py-14">
      <h1 className="text-center text-4xl font-black tracking-tight">
        <span className="text-blue-600">Forgot</span>{" "}
        <span className="text-gray-900">Password?</span>
      </h1>
      <p className="mt-3 text-center text-base text-gray-500">
        Enter your email and we&apos;ll send you a link to reset your password.
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-5">
        <div>
          <label className="text-sm font-semibold text-gray-700">Email Address</label>
          <input
            type="email"
            autoComplete="email"
            {...register("email")}
            placeholder="alex@student.edu"
            className="mt-2 w-full rounded-xl border border-gray-200 px-4 py-3.5 text-base placeholder:text-gray-300 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          />
          {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 py-4 text-base font-bold text-white shadow-md shadow-blue-200 transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading && <Loader2 className="size-4 animate-spin" />}
          Send Reset Link
        </button>

        <p className="text-center text-sm text-gray-500">
          <Link href="/login" className="font-semibold text-blue-600 hover:underline">
            Back to Login
          </Link>
        </p>
      </form>
    </div>
  );
}
