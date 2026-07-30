import { AlertTriangle, CheckCircle2 } from "lucide-react";

interface NotificationIconProps {
  type: "payment_successful" | "payment_failed";
}

export default function NotificationIcon({ type }: NotificationIconProps) {
  if (type === "payment_failed") {
    return (
      <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-red-50 text-red-500 border border-red-100">
        <AlertTriangle className="size-5" />
      </div>
    );
  }
  return (
    <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-emerald-50 text-emerald-600 border border-emerald-100">
      <CheckCircle2 className="size-5" />
    </div>
  );
}
