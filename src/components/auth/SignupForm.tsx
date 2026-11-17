"use client";

import { useForm } from "react-hook-form";
import { useTranslations } from "next-intl";
import { z } from "zod/v4";
import { zodResolver } from "@hookform/resolvers/zod";
import { CheckCircle2, Eye, EyeOff, Loader2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import GoogleSignInButton from "@/components/auth/GoogleSignInButton";
import { useGoogleRedirectResult } from "@/hooks/useGoogleRedirectResult";
import Link from "next/link";
import REFERRAL from "@/services/referral.service";
import { ApiRequestError } from "@/lib/api";
import {
  clearStoredReferralCode,
  getStoredReferralCode,
  normalizeReferralCode,
  storeReferralCode,
} from "@/lib/referral";

type FormData = {
  full_name: string;
  email: string;
  password: string;
  referral_code?: string;
  terms: true;
};

type ReferralStatus = "idle" | "checking" | "applied" | "unknown";

interface SignupFormProps {
  /** Chosen on /select-role and passed down from the page, which reads it
   *  server-side. Reading it here with useSearchParams meant the entire form —
   *  including the Google button — could not be prerendered. */
  role: string;
}

export default function SignupForm({ role: initialRole }: SignupFormProps) {
  const t = useTranslations("auth");
  const { register: registerUser, googleAuth, loading } = useAuth();
  const [role, setRole] = useState<"student" | "tutor">(
    initialRole === "tutor" ? "tutor" : "student"
  );
  // The redirect leaves and re-enters the page, so the role chosen on
  // /select-role has to be re-applied on the way back in.
  useGoogleRedirectResult((idToken) =>
    googleAuth(idToken, role)
  );
  const [showPw, setShowPw] = useState(false);
  const [referralStatus, setReferralStatus] = useState<ReferralStatus>("idle");
  // Each check takes a ticket; only the latest may write its result, so a slow
  // check from page load cannot overwrite the one for what was typed since.
  const referralTicket = useRef(0);

  const schema = z.object({
    full_name: z.string().min(2, t("errName")),
    email: z.email(t("errEmail")),
    password: z.string().min(8, t("errPassword")),
    referral_code: z.string().optional(),
    terms: z.literal(true, { error: t("errTerms") }),
  });
  const { register, handleSubmit, setValue, formState: { errors } } =
    useForm<FormData>({ resolver: zodResolver(schema) });

  // A code remembered from a share link (/signup?ref=… or any page that was
  // opened with one) fills the box. Read here, not during render, because the
  // form is prerendered and the server cannot see the browser's storage.
  useEffect(() => {
    const remembered = getStoredReferralCode();
    if (!remembered) return;
    setValue("referral_code", remembered);
    void checkReferral(remembered);
  }, [setValue]);

  /**
   * Tell the visitor whether the code works, but never gate signup on it: the
   * API ignores an unknown code, and a stale link must not stop anyone
   * registering. A working code is remembered so the Google button (whose
   * redirect leaves the page) still carries it.
   */
  async function checkReferral(raw: string) {
    const ticket = ++referralTicket.current;
    const code = normalizeReferralCode(raw);
    if (!raw.trim()) {
      clearStoredReferralCode();
      setReferralStatus("idle");
      return;
    }
    if (!code) {
      // Malformed. Forget the remembered code too, or registration would
      // quietly fall back to it while the box says it was not recognised.
      clearStoredReferralCode();
      setReferralStatus("unknown");
      return;
    }
    setReferralStatus("checking");
    try {
      const ok = await REFERRAL.check(code);
      if (ticket !== referralTicket.current) return;
      storeReferralCode(ok.code);
      setReferralStatus("applied");
    } catch (err) {
      if (ticket !== referralTicket.current) return;
      // Only a definite "not valid" forgets the code. A dropped connection
      // says nothing about it, so the remembered one stays.
      if (err instanceof ApiRequestError && err.status === 400) {
        clearStoredReferralCode();
        setReferralStatus("unknown");
      } else {
        setReferralStatus("idle");
      }
    }
  }

  function onSubmit({ full_name, email, password, referral_code }: FormData) {
    // role is passed separately — useAuth.register calls /v1/auth/role after /v1/auth/register
    registerUser({
      full_name: full_name,
      email,
      password,
      role,
      referral_code: normalizeReferralCode(referral_code) ?? undefined,
    });
  }

  return (
    <div className="w-full max-w-2xl rounded-2xl border border-gray-100 bg-white px-8 py-10 shadow-sm sm:px-14 sm:py-12">
      <h1 className="text-center text-4xl font-black tracking-tight">
        {t("createAccountLead")} <span className="text-blue-600">ReadAm</span>{" "}
        <span className="text-gray-900">{t("createAccountAccent")}</span>
      </h1>
      <p className="mt-3 text-center text-base text-gray-500">
        {t("signupIntro")}
      </p>
      <div className="mt-3 flex justify-center items-center gap-2 text-sm text-gray-500">
        <span>{t("signingUpAsLabel") || "Signing up as:"}</span>
        <div className="relative inline-block">
          <select
            value={role}
            onChange={(e) => setRole(e.target.value as "student" | "tutor")}
            className="appearance-none rounded-full bg-blue-50 pl-4 pr-9 py-1.5 text-xs font-bold text-blue-600 outline-none cursor-pointer border border-transparent hover:border-blue-200 focus:ring-2 focus:ring-blue-100 transition-all capitalize"
          >
            <option value="student">{t("roleStudent")}</option>
            <option value="tutor">{t("roleTutor")}</option>
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
            <svg className="h-3 w-3 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="mt-7 space-y-5">
        <div>
          <label className="text-sm font-semibold text-gray-700">{t("name")}</label>
          <input type="text" autoComplete="name" {...register("full_name")}
            placeholder={t("namePlaceholder")}
            className="mt-2 w-full rounded-xl border border-gray-200 px-4 py-3.5 text-base placeholder:text-gray-300 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100" />
          {errors.full_name && <p className="mt-1 text-xs text-red-500">{errors.full_name.message}</p>}
        </div>

        <div>
          <label className="text-sm font-semibold text-gray-700">{t("email")}</label>
          <input type="email" autoComplete="email" {...register("email")}
            placeholder={t("emailPlaceholder")}
            className="mt-2 w-full rounded-xl border border-gray-200 px-4 py-3.5 text-base placeholder:text-gray-300 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100" />
          {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>}
        </div>

        <div>
          <label className="text-sm font-semibold text-gray-700">{t("createPassword")}</label>
          <div className="relative mt-2">
            <input type={showPw ? "text" : "password"} autoComplete="new-password"
              {...register("password")} placeholder={t("minChars")}
              className="w-full rounded-xl border border-gray-200 px-4 py-3.5 pr-12 text-base placeholder:text-gray-300 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100" />
            <button type="button" onClick={() => setShowPw(v => !v)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              aria-label={showPw ? t("hidePassword") : t("showPassword")}>
              {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          {errors.password && <p className="mt-1 text-xs text-red-500">{errors.password.message}</p>}
        </div>

        <div>
          <label className="text-sm font-semibold text-gray-700">
            {t("referralCode")}{" "}
            <span className="font-normal text-gray-400">({t("optional")})</span>
          </label>
          <input type="text" autoComplete="off" autoCapitalize="characters" spellCheck={false}
            {...register("referral_code", {
              onBlur: (e) => void checkReferral(e.target.value),
            })}
            placeholder={t("referralCodePlaceholder")}
            className="mt-2 w-full rounded-xl border border-gray-200 px-4 py-3.5 font-mono text-base uppercase tracking-widest placeholder:font-sans placeholder:normal-case placeholder:tracking-normal placeholder:text-gray-300 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100" />
          {referralStatus === "checking" && (
            <p className="mt-1 flex items-center gap-1 text-xs text-gray-400">
              <Loader2 className="h-3 w-3 animate-spin" /> {t("referralChecking")}
            </p>
          )}
          {referralStatus === "applied" && (
            <p className="mt-1 flex items-center gap-1 text-xs text-teal-600">
              <CheckCircle2 className="h-3.5 w-3.5" /> {t("referralApplied")}
            </p>
          )}
          {referralStatus === "unknown" && (
            <p className="mt-1 text-xs text-orange-500">{t("referralUnknown")}</p>
          )}
        </div>

        <div>
          <label className="flex cursor-pointer items-start gap-3 select-none">
            <input type="checkbox" {...register("terms")}
              className="mt-0.5 h-4 w-4 shrink-0 rounded border-gray-300 text-blue-600" />
            <span className="text-sm text-gray-500">
              {t("termsAgree")}{" "}
              <Link href="/terms" className="font-medium text-blue-600 hover:underline">{t("terms")}</Link>
              {" "}{t("and")}{" "}
              <Link href="/privacy" className="font-medium text-blue-600 hover:underline">{t("privacy")}</Link>.
            </span>
          </label>
          {errors.terms && <p className="mt-1 text-xs text-red-500">{errors.terms.message as string}</p>}
        </div>

        <button type="submit" disabled={loading}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 py-4 text-base font-bold text-white shadow-md shadow-blue-200 transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60">
          {loading && <Loader2 className="h-4 w-4 animate-spin" />}
          {loading ? t("creatingAccount") : t("register")}
        </button>

        <div className="relative flex items-center gap-3">
          <div className="h-px flex-1 bg-gray-200" />
          <span className="shrink-0 text-sm text-gray-400">{t("or")}</span>
          <div className="h-px flex-1 bg-gray-200" />
        </div>

        <GoogleSignInButton onCredential={(idToken) => googleAuth(idToken, role)} />
        {/* Mobile only — visible when navbar auth link is hidden */}
        <p className="mt-6 text-center text-sm text-gray-500 sm:hidden">
          {t("haveAccount")}{" "}
          <Link href="/login" className="font-semibold text-blue-600 hover:underline">
            {t("signIn")}
          </Link>
        </p>
      </form>
    </div>
  );
}
