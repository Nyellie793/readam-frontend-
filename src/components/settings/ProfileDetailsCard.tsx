"use client";

import { useEffect, useState } from "react";
import { getStoredUser, updateStoredUser } from "@/lib/auth";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Camera, Save } from "lucide-react";
import { toast } from "sonner";

export default function ProfileDetailsCard() {
  const [loading, setLoading] = useState(false);
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
        fullName: user.full_name ?? "Student User",
        email: user.email ?? "student@readam.com",
        phone: (user as any).phone ?? "+237 677 889 900",
        role: user.role ?? "STUDENT",
      });
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate API Call
    await new Promise((resolve) => setTimeout(resolve, 800));
    
    const user = getStoredUser();
    if (user) {
      updateStoredUser({
        ...user,
        full_name: formData.fullName,
        email: formData.email,
        phone: formData.phone,
      } as any);
    }
    
    setLoading(false);
    toast.success("Profile updated successfully!");
  };

  const initials = formData.fullName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <Card className="border border-gray-100 shadow-sm rounded-2xl overflow-hidden bg-white">
      <CardHeader className="border-b border-gray-50 pb-5">
        <CardTitle className="text-base font-bold text-gray-900">Personal Information</CardTitle>
        <CardDescription className="text-xs text-gray-500">
          Update your profile details and managing how other users see you.
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-6">
        <form onSubmit={handleSave} className="space-y-6">
          {/* Avatar Section */}
          <div className="flex items-center gap-6">
            <div className="relative group">
              <Avatar className="size-20 border-2 border-blue-100 ring-4 ring-blue-50/50">
                <AvatarFallback className="text-xl font-bold bg-blue-50 text-blue-600">
                  {initials || "ST"}
                </AvatarFallback>
              </Avatar>
              <button
                type="button"
                className="absolute bottom-0 right-0 flex size-7 items-center justify-center rounded-full bg-blue-600 text-white shadow-md hover:bg-blue-700 transition-colors"
                aria-label="Upload photo"
              >
                <Camera className="size-4" />
              </button>
            </div>
            <div>
              <h4 className="text-sm font-bold text-gray-800">Profile Picture</h4>
              <p className="text-xs text-gray-500 mt-1">PNG, JPG or WEBP. Max 2MB.</p>
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
                placeholder="Enter your full name"
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
                placeholder="Enter your email"
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
                placeholder="+237 6XX XXX XXX"
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
                className="h-10 rounded-xl bg-gray-50 text-gray-500 border-gray-100"
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
              {loading ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
