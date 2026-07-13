import AuthNavbar from "@/components/auth/AuthNavbar";
import LoginForm from "@/components/auth/LoginForm";

export default function LoginPage() {
  return (
    <main className="min-h-screen bg-[#F7F8FC]">
      <AuthNavbar text="No account yet?" buttonText="Sign Up" href="/select-role" />
      <section className="mx-auto flex min-h-[calc(100vh-65px)] max-w-7xl items-center justify-center px-6 py-10">
        <LoginForm />
      </section>
    </main>
  );
}
