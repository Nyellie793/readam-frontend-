import { Suspense } from "react";
import AuthNavbar from "@/components/auth/AuthNavbar";
import ResetPasswordForm from "@/components/auth/ResetPasswordForm";

export default function ResetPasswordPage() {
  return (
    <main className="min-h-screen bg-[#F7F8FC]">
      <AuthNavbar text="Remembered it?" buttonText="Log In" href="/login" />
      <section className="mx-auto flex min-h-[calc(100vh-65px)] max-w-7xl items-center justify-center px-6 py-10">
        <Suspense fallback={null}>
          <ResetPasswordForm />
        </Suspense>
      </section>
    </main>
  );
}
