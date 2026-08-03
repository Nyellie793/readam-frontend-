"use client";

import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { Camera, Save, Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import TUTOR from "@/services/tutor.service";
import { getStoredUser, updateStoredUser } from "@/lib/auth";
import { errorMessage, putToPresigned } from "@/lib/api";
import type { ExperienceYears, TutorProfileResponse } from "@/types/api.types";

const TEACHING_LEVELS = [
  { value: "", label: "Select level" },
  { value: "primary", label: "Primary School" },
  { value: "gce_o_level", label: "GCE O-Level" },
  { value: "gce_a_level", label: "GCE A-Level" },
  { value: "university", label: "University" },
  { value: "professional", label: "Professional / Adult Education" },
];

const EXPERIENCE_OPTIONS: { value: ExperienceYears; label: string }[] = [
  { value: "1-3", label: "1-3 Years" },
  { value: "4-7", label: "4-7 Years" },
  { value: "8+", label: "8+ Years" },
];

interface TutorProfileSettingsCardProps {
  profile: TutorProfileResponse;
  onSaved: (profile: TutorProfileResponse) => void;
}

export default function TutorProfileSettingsCard({ profile, onSaved }: TutorProfileSettingsCardProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(profile.avatar_url);

  const [fullName, setFullName] = useState(profile.display_name ?? "");
  const [phone, setPhone] = useState(profile.phone ?? "");
  const [city, setCity] = useState(profile.city ?? "");
  const [subject, setSubject] = useState(profile.subject ?? "");
  const [teachingLevel, setTeachingLevel] = useState(profile.teaching_level ?? "");
  const [experience, setExperience] = useState<ExperienceYears | null>(profile.experience_years);
  const [bio, setBio] = useState(profile.bio ?? "");

  useEffect(() => {
    setFullName(profile.display_name ?? "");
    setPhone(profile.phone ?? "");
    setCity(profile.city ?? "");
    setSubject(profile.subject ?? "");
    setTeachingLevel(profile.teaching_level ?? "");
    setExperience(profile.experience_years);
    setBio(profile.bio ?? "");
    setAvatarUrl(profile.avatar_url);
  }, [profile]);

  async function uploadPhoto(file: File) {
    if (!file.type.startsWith("image/")) {
      toast.error("Please choose an image file.");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Photo must be under 5MB.");
      return;
    }
    setUploading(true);
    try {
      const presigned = await TUTOR.requestAssetUpload(file.name, file.type);
      await putToPresigned(presigned.upload_url, file);
      setAvatarUrl(presigned.file_url);
    } catch (err) {
      toast.error(errorMessage(err, "Couldn't upload that photo."));
    } finally {
      setUploading(false);
    }
  }

  async function handleSave() {
    setSaving(true);
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
      });
      const currentUser = getStoredUser();
      if (currentUser) {
        updateStoredUser({
          ...currentUser,
          full_name: fullName || currentUser.full_name,
          avatar_url: updated.avatar_url ?? currentUser.avatar_url,
        });
      }
      onSaved(updated);
      toast.success("Profile updated successfully!");
    } catch (err) {
      toast.error(errorMessage(err, "Couldn't update your profile."));
    } finally {
      setSaving(false);
    }
  }

  const initials = fullName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <Card className="border border-gray-100 shadow-sm rounded-2xl overflow-hidden bg-white">
      <CardHeader className="border-b border-gray-50 pb-5">
        <CardTitle className="text-base font-bold text-gray-900">Professional Profile</CardTitle>
        <CardDescription className="text-xs text-gray-500">
          This is what students see when they browse your courses.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6 pt-6">
        <div className="flex items-center gap-6">
          <div className="group relative">
            <Avatar className="size-20 border-2 border-blue-100 ring-4 ring-blue-50/50">
              <AvatarImage src={avatarUrl ?? ""} />
              <AvatarFallback className="text-xl font-bold bg-blue-50 text-blue-600">
                {initials || "TU"}
              </AvatarFallback>
            </Avatar>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="absolute bottom-0 right-0 flex size-7 items-center justify-center rounded-full bg-blue-600 text-white shadow-md hover:bg-blue-700"
              aria-label="Upload photo"
            >
              {uploading ? <Loader2 className="size-4 animate-spin" /> : <Camera className="size-4" />}
            </button>
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
          </div>
          <div>
            <h4 className="text-sm font-bold text-gray-800">Profile Picture</h4>
            <p className="mt-1 text-xs text-gray-500">JPG, PNG or GIF. Max 5MB.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-gray-700">Full Name</label>
            <Input value={fullName} onChange={(e) => setFullName(e.target.value)} className="h-10 rounded-xl" />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-gray-700">Phone Number</label>
            <Input value={phone} onChange={(e) => setPhone(e.target.value)} className="h-10 rounded-xl" />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-gray-700">City</label>
            <Input value={city} onChange={(e) => setCity(e.target.value)} className="h-10 rounded-xl" />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-gray-700">What do you teach?</label>
            <Input value={subject} onChange={(e) => setSubject(e.target.value)} className="h-10 rounded-xl" />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-gray-700">Teaching Level</label>
            <select
              value={teachingLevel}
              onChange={(e) => setTeachingLevel(e.target.value)}
              className="h-10 w-full rounded-xl border border-gray-200 bg-white px-3.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            >
              {TEACHING_LEVELS.map((l) => (
                <option key={l.value} value={l.value}>
                  {l.label}
                </option>
              ))}
            </select>
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-gray-700">Years of Experience</label>
            <div className="grid grid-cols-3 gap-2">
              {EXPERIENCE_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setExperience(opt.value)}
                  className={`h-10 rounded-xl border text-xs font-semibold transition-colors ${
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
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-gray-700">Short Bio</label>
          <textarea
            value={bio}
            onChange={(e) => setBio(e.target.value.slice(0, 500))}
            rows={4}
            className="w-full resize-none rounded-xl border border-gray-200 px-3.5 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          />
          <p className="text-right text-[11px] text-gray-400">{bio.length}/500 characters</p>
        </div>

        <div className="flex justify-end border-t border-gray-50 pt-2">
          <Button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="flex h-10 items-center gap-2 rounded-xl bg-blue-600 px-5 text-xs font-semibold text-white shadow-sm transition-colors hover:bg-blue-700"
          >
            <Save className="size-3.5" />
            {saving ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
