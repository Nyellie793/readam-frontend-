import AiHubHeader from "@/components/dashboard/ai-hub/AiHubHeader";
import AiHubSuggestions from "@/components/dashboard/ai-hub/AiHubSuggestions";
import AiHubFeatureCards from "@/components/dashboard/ai-hub/AiHubFeatureCards";
import AiHubBanner from "@/components/dashboard/ai-hub/AiHubBanner";
import AiHubLearningStreak from "@/components/dashboard/ai-hub/AiHubLearningStreak";

export default function AiHubPage() {
  return (
    <div className="mx-auto max-w-6xl space-y-6 px-4 py-6 sm:px-6 lg:px-10">
      <AiHubHeader />
      <AiHubSuggestions />
      <AiHubFeatureCards />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <AiHubBanner />
        </div>
        <div>
          <AiHubLearningStreak />
        </div>
      </div>
    </div>
  );
}