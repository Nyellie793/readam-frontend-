"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/button";
import { KeyRound } from "lucide-react";
import { toast } from "sonner";
import AUTH from "@/services/auth.service";
import { saveSession } from "@/lib/auth";
import { ApiRequestError } from "@/lib/api";
import { useTranslations } from "next-intl";

export default function SecurityForm() {
  const t = useTranslations("settings");
  const [loading, setLoading] = useState(false);
  const [hasPassword, setHasPassword] = useState<boolean | null>(null);
  const [passwords, setPasswords] = useState({
    current: "",
    new: "",
    confirm: "",
  });

  useEffect(() => {
    AUTH.me()
      .then((user) => setHasPassword(user.has_password ?? false))
      .catch(() => setHasPassword(false));
  }, []);

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passwords.new !== passwords.confirm) {
      toast.error(t("pwMismatch"));
      return;
    }

    setLoading(true);
    try {
      const data = await AUTH.changePassword({
        current_password: hasPassword ? passwords.current : undefined,
        new_password: passwords.new,
      });
      saveSession(data);
      setHasPassword(true);
      toast.success(
        hasPassword ? t("pwChanged") : t("pwSet")
      );
      setPasswords({ current: "", new: "", confirm: "" });
    } catch (err) {
      toast.error(err instanceof ApiRequestError ? err.detail : t("pwFailed"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="border border-gray-100 shadow-sm rounded-2xl overflow-hidden bg-white">
      <CardContent className="p-6 space-y-6">
        <form onSubmit={handlePasswordChange} className="space-y-4">
          <div>
            <h3 className="text-sm font-bold text-gray-800 flex items-center gap-2">
              <KeyRound className="size-4 text-blue-600" />
              {hasPassword === false ? t("setPasswordTitle") : t("updatePasswordTitle")}
            </h3>
            <p className="text-xs text-gray-500 mt-1">
              {hasPassword === false
                ? t("noPasswordYet")
                : t("longRandom")}
            </p>
          </div>

          <div className="space-y-3">
            {hasPassword !== false && (
              <div className="space-y-1">
                <label htmlFor="current" className="text-xs font-semibold text-gray-700">{t("currentPassword")}</label>
                <Input
                  id="current"
                  type="password"
                  value={passwords.current}
                  onChange={(e) => setPasswords((p) => ({ ...p, current: e.target.value }))}
                  placeholder={t("enterCurrent")}
                  className="h-10 rounded-xl"
                  required
                />
              </div>
            )}
            <div className="space-y-1">
              <label htmlFor="new" className="text-xs font-semibold text-gray-700">{t("newPassword")}</label>
              <Input
                id="new"
                type="password"
                value={passwords.new}
                onChange={(e) => setPasswords((p) => ({ ...p, new: e.target.value }))}
                placeholder={t("min8")}
                className="h-10 rounded-xl"
                required
              />
            </div>
            <div className="space-y-1">
              <label htmlFor="confirm" className="text-xs font-semibold text-gray-700">{t("confirmNew")}</label>
              <Input
                id="confirm"
                type="password"
                value={passwords.confirm}
                onChange={(e) => setPasswords((p) => ({ ...p, confirm: e.target.value }))}
                placeholder={t("reenterNew")}
                className="h-10 rounded-xl"
                required
              />
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <Button
              type="submit"
              disabled={loading || hasPassword === null}
              className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl h-10 px-5 font-semibold text-xs transition-colors"
            >
              {loading ? "Updating..." : hasPassword === false ? "Set Password" : t("updatePasswordTitle")}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
