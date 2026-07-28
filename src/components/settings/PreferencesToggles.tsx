"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/Card";
import { toast } from "sonner";

// Custom Switch component for clean styling and state management
function Switch({
  checked,
  onCheckedChange,
  id,
}: {
  checked: boolean;
  onCheckedChange: (val: boolean) => void;
  id?: string;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      id={id}
      onClick={() => onCheckedChange(!checked)}
      className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-100 ${
        checked ? "bg-blue-600" : "bg-gray-200"
      }`}
    >
      <span
        aria-hidden="true"
        className={`pointer-events-none inline-block size-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
          checked ? "translate-x-5" : "translate-x-0"
        }`}
      />
    </button>
  );
}

export default function PreferencesToggles() {
  const [preferences, setPreferences] = useState({
    emailAlerts: true,
    studyReminders: true,
    weeklyDigest: false,
    darkMode: false,
  });

  const handleToggle = (key: keyof typeof preferences) => {
    setPreferences((prev) => {
      const updated = { ...prev, [key]: !prev[key] };
      toast.success(`Preference updated!`);
      return updated;
    });
  };

  return (
    <Card className="border border-gray-100 shadow-sm rounded-2xl overflow-hidden bg-white">
      <CardContent className="p-6 space-y-6">
        {/* Notifications Group */}
        <div className="space-y-4">
          <div>
            <h3 className="text-sm font-bold text-gray-800">Notification Channels</h3>
            <p className="text-xs text-gray-500 mt-1">Configure where and when you receive study notices.</p>
          </div>

          <div className="space-y-3.5">
            {/* Email Toggles */}
            <div className="flex items-center justify-between py-1">
              <div>
                <p className="text-xs font-bold text-gray-800">Email Alerts</p>
                <p className="text-[11px] text-gray-400 mt-0.5">Receive updates on graded exams and teacher feedback.</p>
              </div>
              <Switch
                checked={preferences.emailAlerts}
                onCheckedChange={() => handleToggle("emailAlerts")}
              />
            </div>

            {/* Reminders Toggle */}
            <div className="flex items-center justify-between py-1 border-t border-gray-50 pt-3">
              <div>
                <p className="text-xs font-bold text-gray-800">AI Tutor Reminders</p>
                <p className="text-[11px] text-gray-400 mt-0.5">Get nudges when you have scheduled study goals.</p>
              </div>
              <Switch
                checked={preferences.studyReminders}
                onCheckedChange={() => handleToggle("studyReminders")}
              />
            </div>

            {/* Weekly digest Toggle */}
            <div className="flex items-center justify-between py-1 border-t border-gray-50 pt-3">
              <div>
                <p className="text-xs font-bold text-gray-800">Weekly Performance Digest</p>
                <p className="text-[11px] text-gray-400 mt-0.5">Receive weekly course progress and AI analytics review.</p>
              </div>
              <Switch
                checked={preferences.weeklyDigest}
                onCheckedChange={() => handleToggle("weeklyDigest")}
              />
            </div>
          </div>
        </div>

        {/* Theme Settings */}
        <div className="space-y-4 border-t border-gray-100 pt-6">
          <div>
            <h3 className="text-sm font-bold text-gray-800">Appearance Mode</h3>
            <p className="text-xs text-gray-500 mt-1">Customise how the application looks on your display.</p>
          </div>

          <div className="flex items-center justify-between py-1">
            <div>
              <p className="text-xs font-bold text-gray-800">Dark Mode Interface</p>
              <p className="text-[11px] text-gray-400 mt-0.5">Switch between standard light colors and dark styling.</p>
            </div>
            <Switch
              checked={preferences.darkMode}
              onCheckedChange={() => handleToggle("darkMode")}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
