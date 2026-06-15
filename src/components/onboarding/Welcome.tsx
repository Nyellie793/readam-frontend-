"use client";

import Image from "next/image";
import Link from "next/link";
import { Sparkles, Compass, Bot, BookOpen, ArrowLeft } from "lucide-react";

type Props = {
  interests: string[];
  userName: string;
  onBack: () => void;
};

export default function Welcome({ interests, userName, onBack }: Props) {
  const displayInterests =
    interests.slice(0, 2).join(" and ") || "your selected topics";

  const loginType =
    typeof window !== "undefined"
      ? localStorage.getItem("login_type")
      : "signup";

  const greeting =
    loginType === "login" ? "Welcome Back," : "Welcome to ReadAm,";

  return (
    <div className="mx-auto max-w-5xl">
      <div className="grid grid-cols-1 gap-10 lg:grid-cols-2 lg:items-center">

        {/* LEFT — image with floating badges */}
        <div className="relative">

          {/* AI Tutor badge — top right */}
          <div className="absolute -top-4 right-4 z-10 flex items-center gap-3 rounded-2xl bg-white px-4 py-3 shadow-lg">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-500">
              <Sparkles className="h-5 w-5 text-white" />
            </div>
            <div>
              <p className="text-sm font-bold text-gray-900">AI Tutor Ready</p>
              <p className="text-xs text-gray-400">24/7 Academic Support</p>
            </div>
          </div>

          {/* Main image */}
          <div className="overflow-hidden rounded-2xl">
            <Image
              src="/Students celebrating learning.png"
              alt="Students"
              width={600}
              height={500}
              className="w-full object-cover"
            />
          </div>

          {/* Success rate badge — bottom left */}
          <div className="absolute -bottom-4 left-4 z-10 flex items-center gap-3 rounded-2xl bg-white px-4 py-3 shadow-lg">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-600">
              <BookOpen className="h-5 w-5 text-white" />
            </div>
            <div>
              <p className="text-sm font-bold text-gray-900">94% Success Rate</p>
              <p className="text-xs text-gray-400">Among ReadAm students</p>
            </div>
          </div>

        </div>

        {/* RIGHT — content */}
        <div>
          <h1 className="text-3xl font-black leading-snug text-blue-700 sm:text-4xl">
            {greeting}{" "}
            <span className="text-orange-500">{userName || "there"}!</span>
          </h1>

          <p className="mt-4 text-sm leading-relaxed text-gray-500">
            Your learning journey starts now. We&apos;ve personalized your
            dashboard based on your interests in{" "}
            <span className="font-semibold text-gray-700">
              {displayInterests}
            </span>
            . Here is what you can do next:
          </p>

          {/* Action cards */}
          <div className="mt-6 grid grid-cols-2 gap-4">
            <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm hover:shadow-md transition-all hover:-translate-y-0.5">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50">
                <Compass className="h-5 w-5 text-blue-500" />
              </div>
              <h3 className="mt-4 text-base font-bold text-gray-900">
                Explore Courses
              </h3>
              <p className="mt-1 text-xs leading-relaxed text-gray-400">
                Discover top-rated lessons from expert Cameroonian tutors.
              </p>
            </div>

            <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm hover:shadow-md transition-all hover:-translate-y-0.5">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50">
                <Bot className="h-5 w-5 text-blue-500" />
              </div>
              <h3 className="mt-4 text-base font-bold text-gray-900">
                Ask AI Assistant
              </h3>
              <p className="mt-1 text-xs leading-relaxed text-gray-400">
                Solve complex past questions instantly with our AI tutor.
              </p>
            </div>
          </div>

          {/* CTA buttons */}
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/dashboard"
              className="rounded-xl bg-blue-600 px-8 py-3.5 text-sm font-bold text-white hover:bg-blue-700 transition shadow-md shadow-blue-200"
            >
              Get Started
            </Link>
            <Link
              href="/dashboard"
              className="rounded-xl border border-gray-200 bg-white px-8 py-3.5 text-sm font-bold text-blue-600 hover:bg-gray-50 transition"
            >
              Go to Dashboard
            </Link>
          </div>
        </div>

      </div>

      {/* Back */}
      <div className="mt-12">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 transition"
        >
          <ArrowLeft className="h-4 w-4" /> Back
        </button>
      </div>
    </div>
  );
}