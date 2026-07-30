"use client";

import { useForm } from "react-hook-form";
import { z } from "zod/v4";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, Loader2, XCircle } from "lucide-react";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import AUTH from "@/services/auth.service";
import { errorMessage } from "@/lib/api";
import { toast } from "sonner";

const schema = z
  .object({
    new_password: z.string().min(8, "Password must be at least 8 characters"),
    confirm: z.string(),
  })
  .refine((data) => data.new_password === data.confirm, {
    message: "Passwords don't match",
    path: ["confirm"],
  });
type FormData = z.infer<typeof schema>;

export default function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const [loading, setLoading] = useState(false);
  const [showPw, setShowPw] = useState(false);
  const [linkError, setLinkError] = useState<string | null>(null);
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  async function onSubmit(data: FormData) {
    if (!token) return;
    setLoading(true);
    setLinkError(null);
    try {
      await AUTH.resetPassword({ token, new_password: data.new_password });
      toast.success("Password reset. Please log in with your new password.");
      router.push("/login");
    } catch (err) {
      setLinkError(errorMessage(err, "Something went wrong. Please try again."));
    } finally {
      setLoading(false);
    }
  }

  if (!token) {
    return (
      <div className="w-full max-w-2xl rounded-2xl border border-gray-100 bg-white px-8 py-10 text-center shadow-sm sm:px-14 sm:py-14">
        <div className="mx-auto flex size-14 items-center justify-center rounded-full bg-red-50 text-red-600">
          <XCircle className="size-7" />
        </div>
        <h1 className="mt-5 text-2xl font-black text-gray-900">Invalid reset link</h1>
        <p className="mt-3 text-base text-gray-500">
          This link is missing its reset token. Request a new one below.
        </p>
        <Link
          href="/forgot-password"
          className="mt-8 inline-block rounded-xl bg-blue-600 px-6 py-3 text-sm font-bold text-white hover:bg-blue-700"
        >
          Request a New Link
        </Link>
      </div>
    );
  }

  return (
    <div className="w-full max-w-2xl rounded-2xl border border-gray-100 bg-white px-8 py-10 shadow-sm sm:px-14 sm:py-14">
      <h1 className="text-center text-4xl font-black tracking-tight">
        <span className="text-blue-600">Reset</span>{" "}
        <span className="text-gray-900">Password</span>
      </h1>
      <p className="mt-3 text-center text-base text-gray-500">
        Choose a new password for your account.
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-5">
        <div>
          <label className="text-sm font-semibold text-gray-700">New Password</label>
          <div className="relative mt-2">
            <input
              type={showPw ? "text" : "password"}
              autoComplete="new-password"
              {...register("new_password")}
              placeholder="At least 8 characters"
              className="w-full rounded-xl border border-gray-200 px-4 py-3.5 pr-11 text-base placeholder:text-gray-300 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
            <button
              type="button"
              onClick={() => setShowPw((v) => !v)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {showPw ? <EyeOff className="size-5" /> : <Eye className="size-5" />}
            </button>
          </div>
          {errors.new_password && <p className="mt-1 text-xs text-red-500">{errors.new_password.message}</p>}
        </div>

        <div>
          <label className="text-sm font-semibold text-gray-700">Confirm New Password</label>
          <input
            type={showPw ? "text" : "password"}
            autoComplete="new-password"
            {...register("confirm")}
            placeholder="Re-enter your new password"
            className="mt-2 w-full rounded-xl border border-gray-200 px-4 py-3.5 text-base placeholder:text-gray-300 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          />
          {errors.confirm && <p className="mt-1 text-xs text-red-500">{errors.confirm.message}</p>}
        </div>

        {linkError && (
          <div className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">
            {linkError}{" "}
            <Link href="/forgot-password" className="font-semibold underline">
              Request a new link
            </Link>
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 py-4 text-base font-bold text-white shadow-md shadow-blue-200 transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading && <Loader2 className="size-4 animate-spin" />}
          Reset Password
        </button>
      </form>
    </div>
  );
}
