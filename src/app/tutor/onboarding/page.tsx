"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { User, UploadCloud, Camera, Loader2 } from "lucide-react";
import Logo from "@/components/shared/Logo";
import TUTOR from "@/services/tutor.service";
import { getStoredUser, updateStoredUser } from "@/lib/auth";
import { errorMessage, putToPresigned } from "@/lib/api";
import type { ExperienceYears } from "@/types/api.types";
import { useTranslations } from "next-intl";


const EXPERIENCE_OPTIONS: { value: ExperienceYears; label: string }[] = [
  { value: "1-3", label: "1-3 Years" },
  { value: "4-7", label: "4-7 Years" },
  { value: "8+", label: "8+ Years" },
];

export default function TutorOnboardingPage() {
  const t = useTranslations("tutor");
  const TEACHING_LEVELS = [
    { value: "", label: "Select level" },
    { value: "primary", label: t("levelPrimary") },
    { value: "gce_o_level", label: t("levelOLevel") },
    { value: "gce_a_level", label: t("levelALevel") },
    { value: "university", label: t("levelUniversity") },
    { value: "professional", label: t("levelProfessional") },
  ];
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<"draft" | "complete" | null>(null);
  const [uploading, setUploading] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);

  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("");
  const [subject, setSubject] = useState("");
  const [teachingLevel, setTeachingLevel] = useState("");
  const [experience, setExperience] = useState<ExperienceYears | null>(null);
  const [bio, setBio] = useState("");

  useEffect(() => {
    TUTOR.getMyProfile()
      .then((profile) => {
        setFullName(profile.display_name ?? "");
        setPhone(profile.phone ?? "");
        setCity(profile.city ?? "");
        setSubject(profile.subject ?? "");
        setTeachingLevel(profile.teaching_level ?? "");
        setExperience(profile.experience_years);
        setBio(profile.bio ?? "");
        setAvatarUrl(profile.avatar_url);
      })
      .catch(() => null)
      .finally(() => setLoading(false));
  }, []);

  async function uploadPhoto(file: File) {
    if (!file.type.startsWith("image/")) {
      toast.error(t("chooseImage"));
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error(t("photoTooBig"));
      return;
    }
    setUploading(true);
    try {
      const presigned = await TUTOR.requestAssetUpload(file.name, file.type);
      await putToPresigned(presigned.upload_url, file);
      setAvatarUrl(presigned.file_url);
    } catch (err) {
      toast.error(errorMessage(err, t("errUploadPhoto")));
    } finally {
      setUploading(false);
    }
  }

  async function handleSubmit(profileCompleted: boolean) {
    setSaving(profileCompleted ? "complete" : "draft");
    try {
      const updated = await TUTOR.updateMyProfile({
        display_name: fullName || undefined,
        phone: phone || undefined,
        city: city || undefined,
        subject: subject || undefined,
        teaching_level: teachingLevel || undefined,
        experience_years: experience ?? undefined,
        bio: bio || undefined,
        avatar_url: avatarUrl ?? undefined,
        profile_completed: profileCompleted,
      });
      const currentUser = getStoredUser();
      if (currentUser) {
        updateStoredUser({
          ...currentUser,
          full_name: fullName || currentUser.full_name,
          avatar_url: updated.avatar_url ?? currentUser.avatar_url,
        });
      }
      if (profileCompleted) {
        toast.success(t("profileComplete"));
        router.push("/tutor");
      } else {
        toast.success("Saved as draft.");
      }
    } catch (err) {
      toast.error(errorMessage(err, t("errProfile")));
    } finally {
      setSaving(null);
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F7F8FC]">
        <Loader2 className="size-6 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[#F7F8FC]">
      <header className="border-b bg-white px-6 py-4">
        <Logo />
      </header>

      <div className="mx-auto max-w-3xl px-6 py-10">
        <h1 className="text-3xl font-black text-gray-900">{t("completeProfile")}</h1>
        <p className="mt-2 text-sm text-gray-500">
          Tell us more about your background and expertise to start connecting with students on ReadAm.
        </p>

        {/* Profile Identity */}
        <div className="mt-8 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
          <h2 className="flex items-center gap-2 text-base font-bold text-gray-900">
            <User className="size-4 text-blue-600" />
            Profile Identity
          </h2>
          <div className="mt-4 flex flex-col items-start gap-5 sm:flex-row sm:items-center">
            <div className="relative shrink-0">
              <div className="flex size-24 items-center justify-center overflow-hidden rounded-full bg-blue-50">
                {avatarUrl ? (
                  <img src={avatarUrl} alt="" className="size-full object-cover" />
                ) : (
                  <User className="size-10 text-blue-300" />
                )}
              </div>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="absolute bottom-0 right-0 flex size-8 items-center justify-center rounded-full bg-blue-600 text-white shadow-md hover:bg-blue-700"
                aria-label={t("uploadPhoto")}
              >
                {uploading ? <Loader2 className="size-4 animate-spin" /> : <Camera className="size-4" />}
              </button>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/gif,image/webp"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                e.target.value = "";
                if (file) uploadPhoto(file);
              }}
            />
            <div
              onDragOver={(e) => {
                e.preventDefault();
                setDragOver(true);
              }}
              onDragLeave={() => setDragOver(false)}
              onDrop={(e) => {
                e.preventDefault();
                setDragOver(false);
                const file = e.dataTransfer.files?.[0];
                if (file) uploadPhoto(file);
              }}
              onClick={() => fileInputRef.current?.click()}
              className={`flex flex-1 cursor-pointer flex-col items-center justify-center gap-1.5 rounded-2xl border-2 border-dashed px-6 py-8 text-center transition-colors ${
                dragOver ? "border-blue-400 bg-blue-50" : "border-gray-200 hover:border-blue-300"
              }`}
            >
              <UploadCloud className="size-5 text-blue-500" />
              <p className="text-sm font-medium text-gray-700">{t("dragPhoto")}</p>
              <p className="text-xs text-gray-400">{t("photoHint")}</p>
            </div>
          </div>
        </div>

        {/* Personal Details */}
        <div className="mt-6 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
          <h2 className="text-base font-bold text-gray-900">{t("personalDetails")}</h2>
          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-700">{t("fullName")}</label>
              <input
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder={t("fullNamePh")}
                className="h-11 w-full rounded-xl border border-gray-200 px-3.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-700">{t("phoneNumber")}</label>
              <input
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder={t("phonePh")}
                className="h-11 w-full rounded-xl border border-gray-200 px-3.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-700">{t("city")}</label>
              <input
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder={t("cityPh")}
                className="h-11 w-full rounded-xl border border-gray-200 px-3.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>
          </div>
        </div>

        {/* Professional Expertise */}
        <div className="mt-6 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
          <h2 className="text-base font-bold text-gray-900">{t("professionalExpertise")}</h2>
          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-700">{t("whatTeach")}</label>
              <input
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder={t("subjectPh")}
                className="h-11 w-full rounded-xl border border-gray-200 px-3.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-700">{t("teachingLevel")}</label>
              <select
                value={teachingLevel}
                onChange={(e) => setTeachingLevel(e.target.value)}
                className="h-11 w-full rounded-xl border border-gray-200 bg-white px-3.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              >
                {TEACHING_LEVELS.map((l) => (
                  <option key={l.value} value={l.value}>
                    {l.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="mt-4 space-y-1.5">
            <label className="text-xs font-semibold text-gray-700">{t("yearsExperience")}</label>
            <div className="grid grid-cols-3 gap-3">
              {EXPERIENCE_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setExperience(opt.value)}
                  className={`h-11 rounded-xl border text-sm font-semibold transition-colors ${
                    experience === opt.value
                      ? "border-blue-600 bg-blue-50 text-blue-700"
                      : "border-gray-200 text-gray-600 hover:border-gray-300"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-4 space-y-1.5">
            <label className="text-xs font-semibold text-gray-700">{t("shortBio")}</label>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value.slice(0, 500))}
              placeholder={t("bioPh")}
              rows={4}
              className="w-full resize-none rounded-xl border border-gray-200 px-3.5 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
            <p className="text-right text-[11px] text-gray-400">{bio.length}/500 characters</p>
          </div>
        </div>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <button
            type="button"
            onClick={() => handleSubmit(false)}
            disabled={saving !== null}
            className="flex h-12 flex-1 items-center justify-center gap-2 rounded-xl border border-blue-600 text-sm font-bold text-blue-600 transition hover:bg-blue-50 disabled:opacity-60"
          >
            {saving === "draft" && <Loader2 className="size-4 animate-spin" />}
            Save as Draft
          </button>
          <button
            type="button"
            onClick={() => handleSubmit(true)}
            disabled={saving !== null}
            className="flex h-12 flex-1 items-center justify-center gap-2 rounded-xl bg-blue-600 text-sm font-bold text-white shadow-md shadow-blue-200 transition hover:bg-blue-700 disabled:opacity-60"
          >
            {saving === "complete" && <Loader2 className="size-4 animate-spin" />}
            Go to Dashboard
          </button>
        </div>
      </div>
    </main>
  );
}
