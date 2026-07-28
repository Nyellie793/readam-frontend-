"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/Card";
import { Check } from "lucide-react";
import { toast } from "sonner";

export default function LanguageSelector() {
  const [selectedLanguage, setSelectedLanguage] = useState<"en" | "fr">("en");

  const handleLanguageChange = (lang: "en" | "fr") => {
    setSelectedLanguage(lang);
    toast.success(`Language changed to ${lang === "en" ? "English" : "Français"}`);
  };

  return (
    <Card className="border border-gray-100 shadow-sm rounded-2xl overflow-hidden bg-white">
      <CardContent className="p-6">
        <div className="space-y-4">
          <div>
            <h3 className="text-sm font-bold text-gray-800">Interface Language</h3>
            <p className="text-xs text-gray-500 mt-1">Select your preferred language for the application dashboard.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* English Option */}
            <button
              type="button"
              onClick={() => handleLanguageChange("en")}
              className={`flex items-center justify-between p-4 rounded-xl border text-left transition-all ${
                selectedLanguage === "en"
                  ? "border-blue-600 bg-blue-50/40 text-blue-900 ring-1 ring-blue-600"
                  : "border-gray-200 hover:bg-gray-50 text-gray-700"
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="text-xl" aria-hidden="true">🇬🇧</span>
                <div>
                  <p className="text-xs font-bold">English (UK)</p>
                  <p className="text-[11px] text-gray-400 mt-0.5">System default language</p>
                </div>
              </div>
              {selectedLanguage === "en" && <Check className="size-4 text-blue-600 shrink-0" />}
            </button>

            {/* French Option */}
            <button
              type="button"
              onClick={() => handleLanguageChange("fr")}
              className={`flex items-center justify-between p-4 rounded-xl border text-left transition-all ${
                selectedLanguage === "fr"
                  ? "border-blue-600 bg-blue-50/40 text-blue-900 ring-1 ring-blue-600"
                  : "border-gray-200 hover:bg-gray-50 text-gray-700"
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="text-xl" aria-hidden="true">🇨🇲</span>
                <div>
                  <p className="text-xs font-bold">Français (Cameroun)</p>
                  <p className="text-[11px] text-gray-400 mt-0.5">Langue secondaire</p>
                </div>
              </div>
              {selectedLanguage === "fr" && <Check className="size-4 text-blue-600 shrink-0" />}
            </button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
