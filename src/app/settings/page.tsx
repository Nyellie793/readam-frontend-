import Sidebar from "@/components/layout/Sidebar";
import Topbar from "@/components/layout/Topbar";
import SettingsSection from "@/components/settings/SettingsSection";
import ProfileDetailsCard from "@/components/settings/ProfileDetailsCard";
import SubscriptionCard from "@/components/settings/SubscriptionCard";
import PaymentHistoryTable from "@/components/settings/PaymentHistoryTable";
import LanguageSelector from "@/components/settings/LanguageSelector";
import PreferencesToggles from "@/components/settings/PreferencesToggles";
import SecurityForm from "@/components/settings/SecurityForm";

export default function SettingsPage() {
  return (
    <div className="flex min-h-screen bg-gray-50/50">
      <aside className="hidden lg:block w-64 shrink-0">
        <div className="fixed h-screen w-64">
          <Sidebar />
        </div>
      </aside>
      <div className="flex-1 flex flex-col min-w-0 lg:pl-0">
        <Topbar searchPlaceholder="Search settings..." />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-4xl space-y-6">
          <div>
            <h1 className="text-2xl font-black text-gray-900 sm:text-3xl">Settings</h1>
            <p className="text-xs text-gray-500 mt-1">Manage your account preferences, subscriptions, and security settings.</p>
          </div>
          
          <div className="bg-white border border-gray-100 rounded-3xl p-6 sm:p-8 divide-y divide-gray-100">
            <SettingsSection id="profile" title="Profile Details" description="Your personal identification information.">
              <ProfileDetailsCard />
            </SettingsSection>
            
            <SettingsSection id="billing" title="Billing & Plan" description="Manage active course tiers and payment history.">
              <SubscriptionCard />
              <PaymentHistoryTable />
            </SettingsSection>
            
            <SettingsSection id="language" title="Language" description="Select application display language.">
              <LanguageSelector />
            </SettingsSection>
            
            <SettingsSection id="preferences" title="Preferences" description="Control notifications, digests, and interface appearance.">
              <PreferencesToggles />
            </SettingsSection>
            
            <SettingsSection id="security" title="Security" description="Keep your account safe by updating your password regularly.">
              <SecurityForm />
            </SettingsSection>
          </div>
        </main>
      </div>
    </div>
  );
}
