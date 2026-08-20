"use client";

import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import Sidebar from "@/components/layout/Sidebar";
import Topbar from "@/components/layout/Topbar";

/**
 * Shared shell for /settings, /payment(/*), and /notifications.
 *
 * Each of these used to import Sidebar and Topbar independently and wrap its
 * own content in an identical flex/aside/Topbar shell, so navigating between
 * them fully unmounted and remounted Topbar's `sticky` + `backdrop-blur-md`
 * header every time — the same WebKit-expensive remount already fixed for
 * the public marketing pages. Rendering the shell once here keeps it
 * mounted; only the page content underneath (each page's own <main>) swaps.
 */
export default function StudentShellLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const t = useTranslations("settings");
  const searchPlaceholder = pathname === "/settings" ? t("searchSettings") : undefined;

  return (
    <div className="flex min-h-screen bg-gray-50/50">
      <aside className="hidden lg:block w-64 shrink-0">
        <div className="fixed h-dvh w-64">
          <Sidebar />
        </div>
      </aside>
      <div className="flex-1 flex flex-col min-w-0">
        <Topbar searchPlaceholder={searchPlaceholder} />
        {children}
      </div>
    </div>
  );
}
