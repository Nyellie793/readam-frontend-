import { Suspense } from "react";
import AuthNavbar from "@/components/auth/AuthNavbar";
import SignupForm from "@/components/auth/SignupForm";
import { Skeleton } from "@/components/ui/skeleton";

export default function SignupPage() {
  return (
    <main className="min-h-screen bg-[#F7F8FC]">
      <AuthNavbar text="Already have an account?" buttonText="Sign In" href="/login" />
      <section className="mx-auto flex min-h-[calc(100vh-65px)] max-w-7xl items-center justify-center px-6 py-10">
        <Suspense fallback={
          <div className="w-full max-w-2xl space-y-4 rounded-2xl border bg-white p-14">
            <Skeleton className="mx-auto h-9 w-64" />
            <Skeleton className="mx-auto h-4 w-80" />
            <Skeleton className="h-12 w-full rounded-xl" />
            <Skeleton className="h-12 w-full rounded-xl" />
            <Skeleton className="h-12 w-full rounded-xl" />
            <Skeleton className="h-12 w-full rounded-xl" />
          </div>
        }>
          <SignupForm />
        </Suspense>
      </section>
    </main>
  );
}
