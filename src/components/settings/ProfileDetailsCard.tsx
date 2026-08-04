"use client";

import { useEffect, useRef, useState } from "react";
import { getStoredUser, updateStoredUser } from "@/lib/auth";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Camera, Save, Loader2 } from "lucide-react";
import { toast } from "sonner";
import AUTH from "@/services/auth.service";
import { ApiRequestError, errorMessage, putToPresigned } from "@/lib/api";
import { useTranslations } from "next-intl";

export default function ProfileDetailsCard() {
  const t = useTranslations("settings");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    role: "",
  });

  useEffect(() => {
    const user = getStoredUser();
    if (user) {
      setFormData({
        fullName: user.full_name ?? "",
        email: user.email ?? "",
        phone: user.phone ?? "",
        role: user.role ?? "",
      });
      setAvatarUrl(user.avatar_url ?? null);
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const updated = await AUTH.updateProfile({
        full_name: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        avatar_url: avatarUrl ?? undefined,
      });
      updateStoredUser(updated);
      setAvatarUrl(updated.avatar_url ?? null);
      toast.success(t("profileUpdated"));
    } catch (err) {
      toast.error(err instanceof ApiRequestError ? err.detail : t("profileFailed"));
    } finally {
      setLoading(false);
    }
  };

  async function handlePhotoSelected(file: File) {
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
      const presigned = await AUTH.requestAssetUpload(file.name, file.type);
      await putToPresigned(presigned.upload_url, file);
      setAvatarUrl(presigned.file_url);
      toast.success(t("photoUploaded"));
    } catch (err) {
      toast.error(errorMessage(err, t("photoFailed")));
    } finally {
      setUploading(false);
    }
  }

  const initials = formData.fullName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <Card className="border border-gray-100 shadow-sm rounded-2xl overflow-hidden bg-white">
      <CardHeader className="border-b border-gray-50 pb-5">
        <CardTitle className="text-base font-bold text-gray-900">{t("personalInfo")}</CardTitle>
        <CardDescription className="text-xs text-gray-500">
          {t("personalInfoDesc")}
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-6">
        <form onSubmit={handleSave} className="space-y-6">
          {/* Avatar Section */}
          <div className="flex items-center gap-6">
            <div className="relative group">
              <Avatar className="size-20 border-2 border-blue-100 ring-4 ring-blue-50/50">
                <AvatarImage src={avatarUrl ?? ""} />
                <AvatarFallback className="text-xl font-bold bg-blue-50 text-blue-600">
                  {initials || "ST"}
                </AvatarFallback>
              </Avatar>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="absolute bottom-0 right-0 flex size-7 items-center justify-center rounded-full bg-blue-600 text-white shadow-md hover:bg-blue-700"
                aria-label={t("uploadPhoto")}
              >
                {uploading ? <Loader2 className="size-4 animate-spin" /> : <Camera className="size-4" />}
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  e.target.value = "";
                  if (file) handlePhotoSelected(file);
                }}
              />
            </div>
            <div>
              <h4 className="text-sm font-bold text-gray-800">{t("profilePicture")}</h4>
              <p className="text-xs text-gray-500 mt-1">{t("photoHint")}</p>
            </div>
          </div>

          {/* Form Fields */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <label htmlFor="fullName" className="text-xs font-semibold text-gray-700">
                Full Name
              </label>
              <Input
                id="fullName"
                type="text"
                value={formData.fullName}
                onChange={handleChange}
                placeholder={t("enterFullName")}
                className="h-10 rounded-xl"
                required
              />
            </div>
            <div className="space-y-1.5">
              <label htmlFor="email" className="text-xs font-semibold text-gray-700">
                Email Address
              </label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder={t("enterEmail")}
                className="h-10 rounded-xl"
                required
              />
            </div>
            <div className="space-y-1.5">
              <label htmlFor="phone" className="text-xs font-semibold text-gray-700">
                Phone Number
              </label>
              <Input
                id="phone"
                type="tel"
                value={formData.phone}
                onChange={handleChange}
                placeholder={t("phonePlaceholder")}
                className="h-10 rounded-xl"
              />
            </div>
            <div className="space-y-1.5">
              <label htmlFor="role" className="text-xs font-semibold text-gray-700">
                Role / Occupation
              </label>
              <Input
                id="role"
                type="text"
                value={formData.role}
                className="h-10 rounded-xl bg-gray-50 text-gray-500 border-gray-100 capitalize"
                disabled
              />
            </div>
          </div>

          <div className="flex justify-end pt-2 border-t border-gray-50">
            <Button
              type="submit"
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl h-10 px-5 font-semibold text-xs transition-colors flex items-center gap-2 shadow-sm"
            >
              <Save className="size-3.5" />
              {loading ? t("saving") : t("saveChanges")}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
