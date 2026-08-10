import Sidebar from "@/components/layout/Sidebar";
import Topbar from "@/components/layout/Topbar";
import SettingsSection from "@/components/settings/SettingsSection";
import ProfileDetailsCard from "@/components/settings/ProfileDetailsCard";
import SubscriptionCard from "@/components/settings/SubscriptionCard";
import PaymentHistoryTable from "@/components/settings/PaymentHistoryTable";
import LanguageSelector from "@/components/settings/LanguageSelector";
import PreferencesToggles from "@/components/settings/PreferencesToggles";
import SecurityForm from "@/components/settings/SecurityForm";
import { useTranslations } from "next-intl";

export default function SettingsPage() {
  const t = useTranslations("settings");
  return (
    <div className="flex min-h-screen bg-gray-50/50">
      <aside className="hidden lg:block w-64 shrink-0">
        <div className="fixed h-dvh w-64">
          <Sidebar />
        </div>
      </aside>
      <div className="flex-1 flex flex-col min-w-0 lg:pl-0">
        <Topbar searchPlaceholder={t("searchSettings")} />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-4xl space-y-6">
          <div>
            <h1 className="text-2xl font-black text-gray-900 sm:text-3xl">{t("title")}</h1>
            <p className="text-xs text-gray-500 mt-1">{t("subtitle")}</p>
          </div>
          
          <div className="bg-white border border-gray-100 rounded-3xl p-6 sm:p-8 divide-y divide-gray-100">
            <SettingsSection id="profile" title={t("profileDetails")} description={t("profileDetailsDesc")}>
              <ProfileDetailsCard />
            </SettingsSection>
            
            <SettingsSection id="billing" title={t("billingPlan")} description={t("billingPlanDesc")}>
              <SubscriptionCard />
              <PaymentHistoryTable />
            </SettingsSection>
            
            <SettingsSection id="language" title={t("languageTitle")} description={t("languageBody")}>
              <LanguageSelector />
            </SettingsSection>
            
            <SettingsSection id="preferences" title={t("preferences")} description={t("preferencesDesc")}>
              <PreferencesToggles />
            </SettingsSection>
            
            <SettingsSection id="security" title={t("security")} description={t("securityDesc")}>
              <SecurityForm />
            </SettingsSection>
          </div>
        </main>
      </div>
    </div>
  );
}
