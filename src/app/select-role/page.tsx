"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { FaGraduationCap } from "react-icons/fa6";
import Link from "next/link";
import { User, Bot } from "lucide-react";

const ROLES = [
  { id: "student", title: "Student", description: "Access personalized learning paths, AI tutoring, and track your progress.", Icon: User },
  { id: "tutor",   title: "Tutor",   description: "Create content, guide students with AI tools, and manage your teaching.",  Icon: Bot  },
] as const;
type Role = (typeof ROLES)[number]["id"];

export default function SelectRolePage() {
  const router = useRouter();
  const [selected, setSelected] = useState<Role>("student");

  return (
    <main className="min-h-screen bg-[#F4F6FB]">
      <header className="border-b bg-white px-6 py-4">
        <Link href="/"><FaGraduationCap className="h-7 w-7 text-blue-600" /></Link>
      </header>
      <div className="mx-auto flex min-h-[calc(100vh-65px)] max-w-3xl flex-col items-center justify-center px-6 py-14">
        <h1 className="text-center text-4xl font-black text-gray-900">How will you use ReadAm?</h1>
        <p className="mt-3 max-w-md text-center text-base text-gray-500">
          Choose a role to personalize your learning experience. You can change it anytime.
        </p>
        <div className="mt-10 grid w-full grid-cols-1 gap-5 sm:grid-cols-2">
          {ROLES.map(({ id, title, description, Icon }) => {
            const active = selected === id;
            return (
              <button key={id} type="button" onClick={() => setSelected(id)}
                className={`flex flex-col items-center gap-5 rounded-2xl border-2 bg-white px-6 py-10 text-center shadow-sm transition-all duration-200 ${active ? "border-blue-600 shadow-blue-100 shadow-lg" : "border-gray-200 hover:border-gray-300 hover:shadow-md"}`}>
                <span className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-50">
                  <Icon className="h-8 w-8 text-blue-600" />
                </span>
                <div>
                  <p className="text-xl font-bold text-gray-900">{title}</p>
                  <p className="mt-2 text-sm leading-relaxed text-gray-500">{description}</p>
                </div>
                <div className={`flex h-6 w-6 items-center justify-center rounded-full border-2 transition-colors ${active ? "border-blue-600 bg-blue-600" : "border-gray-300 bg-white"}`}>
                  {active && <div className="h-2.5 w-2.5 rounded-full bg-white" />}
                </div>
              </button>
            );
          })}
        </div>
        <button type="button" onClick={() => router.push(`/signup?role=${selected}`)}
          className="mt-10 rounded-xl bg-blue-600 px-16 py-4 text-base font-bold text-white shadow-md shadow-blue-200 transition hover:bg-blue-700">
          Continue
        </button>
      </div>
    </main>
  );
}
