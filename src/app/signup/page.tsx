import AuthNavbar from "@/components/auth/AuthNavbar";
import SignupForm from "@/components/auth/SignupForm";

export default async function SignupPage({
  searchParams,
}: {
  searchParams: Promise<{ role?: string }>;
}) {
  // Resolved on the server so the whole form, including the Google button,
  // is in the initial HTML rather than waiting on hydration.
  const { role } = await searchParams;

  return (
    <main className="min-h-screen bg-[#F7F8FC]">
      <AuthNavbar text="Already have an account?" buttonText="Sign In" href="/login" />
      <section className="mx-auto flex min-h-[calc(100vh-65px)] max-w-7xl items-center justify-center px-6 py-10">
        <SignupForm role={role === "tutor" ? "tutor" : "student"} />
      </section>
    </main>
  );
}
