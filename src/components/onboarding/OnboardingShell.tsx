import Logo from "@/components/shared/Logo";

const steps = ["Interest", "Goal", "Welcome"];
type Props = { currentStep: number; children: React.ReactNode; };

export default function OnboardingShell({ currentStep, children }: Props) {
  return (
    <div className="min-h-screen bg-[#F4F6FB]">
      <header className="border-b bg-white px-6 py-4">
        <Logo />
      </header>
      <div className="mx-auto mt-10 flex max-w-xl items-center justify-center px-6">
        {steps.map((label, i) => (
          <div key={label} className="flex flex-1 flex-col items-center">
            <div className="flex w-full items-center">
              {i > 0 && <div className={`h-px flex-1 transition-colors duration-300 ${i <= currentStep ? "bg-blue-600" : "bg-gray-200"}`} />}
              <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-bold transition-all duration-300 ${i <= currentStep ? "bg-blue-600 text-white shadow-md shadow-blue-200" : "border-2 border-gray-200 bg-white text-gray-400"}`}>
                {i + 1}
              </div>
              {i < steps.length - 1 && <div className={`h-px flex-1 transition-colors duration-300 ${i < currentStep ? "bg-blue-600" : "bg-gray-200"}`} />}
            </div>
            <span className={`mt-2 text-xs font-medium transition-colors duration-300 ${i <= currentStep ? "font-bold text-gray-900" : "text-gray-400"}`}>
              {label}
            </span>
          </div>
        ))}
      </div>
      <div className="mt-10 px-4 pb-16">{children}</div>
    </div>
  );
}
