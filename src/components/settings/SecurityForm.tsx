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

export default function SecurityForm() {
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
      toast.error("New passwords do not match!");
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
        hasPassword ? "Password changed successfully!" : "Password set — you can now also sign in with email and password."
      );
      setPasswords({ current: "", new: "", confirm: "" });
    } catch (err) {
      toast.error(err instanceof ApiRequestError ? err.detail : "Couldn't update your password.");
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
              {hasPassword === false ? "Set a Password" : "Update Password"}
            </h3>
            <p className="text-xs text-gray-500 mt-1">
              {hasPassword === false
                ? "You signed in with Google and don't have a password yet. Set one to also be able to sign in with your email."
                : "Ensure your account is using a long, random password to stay secure."}
            </p>
          </div>

          <div className="space-y-3">
            {hasPassword !== false && (
              <div className="space-y-1">
                <label htmlFor="current" className="text-xs font-semibold text-gray-700">Current Password</label>
                <Input
                  id="current"
                  type="password"
                  value={passwords.current}
                  onChange={(e) => setPasswords((p) => ({ ...p, current: e.target.value }))}
                  placeholder="Enter current password"
                  className="h-10 rounded-xl"
                  required
                />
              </div>
            )}
            <div className="space-y-1">
              <label htmlFor="new" className="text-xs font-semibold text-gray-700">New Password</label>
              <Input
                id="new"
                type="password"
                value={passwords.new}
                onChange={(e) => setPasswords((p) => ({ ...p, new: e.target.value }))}
                placeholder="Minimum 8 characters"
                className="h-10 rounded-xl"
                required
              />
            </div>
            <div className="space-y-1">
              <label htmlFor="confirm" className="text-xs font-semibold text-gray-700">Confirm New Password</label>
              <Input
                id="confirm"
                type="password"
                value={passwords.confirm}
                onChange={(e) => setPasswords((p) => ({ ...p, confirm: e.target.value }))}
                placeholder="Re-enter new password"
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
              {loading ? "Updating..." : hasPassword === false ? "Set Password" : "Update Password"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
