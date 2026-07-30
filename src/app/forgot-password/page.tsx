import AuthNavbar from "@/components/auth/AuthNavbar";
import ForgotPasswordForm from "@/components/auth/ForgotPasswordForm";

export default function ForgotPasswordPage() {
  return (
    <main className="min-h-screen bg-[#F7F8FC]">
      <AuthNavbar text="Remembered it?" buttonText="Log In" href="/login" />
      <section className="mx-auto flex min-h-[calc(100vh-65px)] max-w-7xl items-center justify-center px-6 py-10">
        <ForgotPasswordForm />
      </section>
    </main>
  );
}
