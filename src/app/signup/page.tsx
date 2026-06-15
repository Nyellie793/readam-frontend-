import AuthPageLayout from "@/components/auth/AuthLayout";
import AuthNavbar from "@/components/auth/AuthNavbar";
import SignupForm from "@/components/auth/SignupForm";

export default function Page() {
  return (
    <main className="min-h-screen bg-[#F7F8FC]">

      <AuthNavbar
        text="Already have an account?"
        buttonText="Sign In"
        href="/login"
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
            <SignupForm />
        </AuthPageLayout>
      </section>

    </main>
  );
}