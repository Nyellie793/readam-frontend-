import { ShieldAlert, Sparkles, AlertTriangle, MessageSquare, Info, GraduationCap, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface NotificationIconProps {
  type: string;
}

export default function NotificationIcon({ type }: NotificationIconProps) {
  switch (type) {
    case "graded":
      return (
        <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-blue-50 text-blue-600 border border-blue-100">
          <CheckCircle2 className="size-5" />
        </div>
      );
    case "reminder":
      return (
        <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-orange-50 text-orange-600 border border-orange-100">
          <Sparkles className="size-5" />
        </div>
      );
    case "failed":
      return (
        <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-red-50 text-red-500 border border-red-100">
          <AlertTriangle className="size-5" />
        </div>
      );
    case "discussion":
      return (
        <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-gray-100 text-gray-600 border border-gray-200">
          <MessageSquare className="size-5" />
        </div>
      );
    case "system":
      return (
        <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-blue-50 text-blue-600 border border-blue-100">
          <Info className="size-5" />
        </div>
      );
    case "course":
      return (
        <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-indigo-50 text-indigo-600 border border-indigo-100">
          <GraduationCap className="size-5" />
        </div>
      );
    default:
      return (
        <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-gray-50 text-gray-500">
          <Info className="size-5" />
        </div>
      );
  }
}
