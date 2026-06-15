"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SignupForm() {
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    // Save to localStorage
    localStorage.setItem("user_name", name);
    localStorage.setItem("user_email", email);
    localStorage.setItem("user_password", password);
    localStorage.setItem("login_type", "signup");

    setTimeout(() => {
      setLoading(false);
      router.push("/onboarding-1");
    }, 1000);
  }

  return (
    <div className="w-full max-w-md rounded-2xl bg-white p-6 sm:p-8 shadow-sm border">

      <h1 className="text-3xl font-bold text-center">
        Create Your <span className="text-blue-600">ReadAm</span> Account
      </h1>

      <p className="mt-2 text-center text-gray-500 text-sm">
        Join students learning smarter with AI
      </p>

      <form onSubmit={handleSubmit} className="mt-8 space-y-4">

        <div>
          <label className="text-sm text-gray-600">Full Name</label>
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="John Doe"
            className="mt-1 w-full rounded-xl border px-4 py-3 text-base outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
          />
        </div>

        <div>
          <label className="text-sm text-gray-600">Email</label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            className="mt-1 w-full rounded-xl border px-4 py-3 text-base outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
          />
        </div>

        <div>
          <label className="text-sm text-gray-600">Password</label>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            className="mt-1 w-full rounded-xl border px-4 py-3 text-base outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-xl bg-blue-600 py-3 text-white font-semibold hover:bg-blue-700 active:scale-[0.98] transition disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {loading ? "Creating account..." : "Sign Up"}
        </button>

      </form>

      <p className="mt-6 text-center text-sm text-gray-500 sm:hidden">
        Already have an account?{" "}
        <Link className="text-blue-600 font-medium" href="/login">
          Sign In
        </Link>
      </p>

    </div>
  );
}