import AuthPageLayout from "@/components/auth/AuthLayout";
import AuthNavbar from "@/components/auth/AuthNavbar";
import LoginForm from "@/components/auth/LoginForm";

export default function Page() {
  return (
    <main className="min-h-screen bg-[#F7F8FC]">

      <AuthNavbar
        text="No account yet?"
        buttonText="Sign Up"
        href="/signup"
      />

      <section
        className="
        mx-auto
        flex
        min-h-[calc(100vh-80px)]
        max-w-7xl
        items-center
        justify-center
        px-6
        py-10
        "
      >
        <AuthPageLayout>
          <LoginForm />
        </AuthPageLayout>
      </section>

    </main>
  );
}