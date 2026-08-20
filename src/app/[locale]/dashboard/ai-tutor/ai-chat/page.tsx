import { Suspense } from "react";
import AiChatSession from "@/components/dashboard/ai-chat/AiChatSession";

export default function AiChatPage() {
  return (
    <Suspense fallback={null}>
      <AiChatSession />
    </Suspense>
  );
}
