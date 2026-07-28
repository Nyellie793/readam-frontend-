"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/button";
import { ShieldAlert, KeyRound } from "lucide-react";
import { toast } from "sonner";

// Custom Switch reused
function Switch({
  checked,
  onCheckedChange,
}: {
  checked: boolean;
  onCheckedChange: (val: boolean) => void;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onCheckedChange(!checked)}
      className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-100 ${
        checked ? "bg-blue-600" : "bg-gray-200"
      }`}
    >
      <span
        className={`pointer-events-none inline-block size-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
          checked ? "translate-x-5" : "translate-x-0"
        }`}
      />
    </button>
  );
}

export default function SecurityForm() {
  const [loading, setLoading] = useState(false);
  const [passwords, setPasswords] = useState({
    current: "",
    new: "",
    confirm: "",
  });
  const [twoFactor, setTwoFactor] = useState(false);

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passwords.new !== passwords.confirm) {
      toast.error("New passwords do not match!");
      return;
    }

    setLoading(true);
    // Simulate API Call
    await new Promise((resolve) => setTimeout(resolve, 800));
    setLoading(false);

    toast.success("Password changed successfully!");
    setPasswords({ current: "", new: "", confirm: "" });
  };

  const handle2FAToggle = (val: boolean) => {
    setTwoFactor(val);
    toast.success(val ? "Two-factor authentication enabled!" : "Two-factor authentication disabled!");
  };

  return (
    <Card className="border border-gray-100 shadow-sm rounded-2xl overflow-hidden bg-white">
      <CardContent className="p-6 space-y-6">
        {/* Change Password Form */}
        <form onSubmit={handlePasswordChange} className="space-y-4">
          <div>
            <h3 className="text-sm font-bold text-gray-800 flex items-center gap-2">
              <KeyRound className="size-4 text-blue-600" />
              Update Password
            </h3>
            <p className="text-xs text-gray-500 mt-1">Ensure your account is using a long, random password to stay secure.</p>
          </div>

          <div className="space-y-3">
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
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl h-10 px-5 font-semibold text-xs transition-colors"
            >
              {loading ? "Updating..." : "Update Password"}
            </Button>
          </div>
        </form>

        {/* 2FA Security Toggle */}
        <div className="space-y-4 border-t border-gray-100 pt-6">
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-1">
              <h3 className="text-sm font-bold text-gray-800 flex items-center gap-2">
                <ShieldAlert className="size-4 text-orange-500" />
                Two-Factor Authentication (2FA)
              </h3>
              <p className="text-xs text-gray-500 leading-relaxed max-w-md">
                Add an extra layer of security to your account by requiring a verification code from your mobile device upon login.
              </p>
            </div>
            <Switch checked={twoFactor} onCheckedChange={handle2FAToggle} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
