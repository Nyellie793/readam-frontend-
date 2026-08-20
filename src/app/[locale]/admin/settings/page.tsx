import Topbar from "@/components/admin/Topbar";
import { Input } from "@/components/ui/Input";
import { Globe, Bell } from "lucide-react";

function SettingsSection({
  icon: Icon,
  title,
  description,
  children,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
      <div className="mb-5 flex items-center gap-3">
        <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
          <Icon className="h-4.5 w-4.5" />
        </span>
        <div>
          <h3 className="text-sm font-bold text-gray-900">{title}</h3>
          {description && <p className="text-xs text-gray-400">{description}</p>}
        </div>
      </div>
      {children}
    </div>
  );
}

export default function SettingsPage() {
  return (
    <>
      <Topbar title="Admin Settings" description="Configure global platform behaviour, structure and access." />

      <div className="space-y-6 p-4 sm:p-6">

        {/* Platform Identity */}
        <SettingsSection icon={Globe} title="Platform Identity" description="Public-facing name, logo and regional config">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-xs font-semibold text-gray-600">Platform Name</label>
              <Input defaultValue="ReadAM" />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-semibold text-gray-600">Default Language</label>
              <Input defaultValue="English / French" />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-semibold text-gray-600">Default Currency</label>
              <Input defaultValue="FCFA (XAF)" />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-semibold text-gray-600">Support Email</label>
              <Input defaultValue="hello@readam.ai" />
            </div>
          </div>
          <div className="mt-4 flex justify-end">
            <button className="rounded-xl bg-blue-600 px-4 py-2 text-xs font-semibold text-white transition hover:bg-blue-700">
              Save Changes
            </button>
          </div>
        </SettingsSection>

        {/* Notifications */}
        <SettingsSection icon={Bell} title="Notification Preferences" description="Choose which events generate admin alerts">
          <div className="space-y-3">
            {[
              { label: "New tutor applications", defaultOn: true },
              { label: "Course approval requests", defaultOn: true },
              { label: "Student account flags", defaultOn: true },
              { label: "Payment failures", defaultOn: true },
              { label: "Weekly analytics digest", defaultOn: false },
              { label: "System maintenance alerts", defaultOn: false },
            ].map(({ label, defaultOn }) => (
              <div key={label} className="flex items-center justify-between rounded-xl border border-gray-100 px-4 py-3">
                <span className="text-sm text-gray-700">{label}</span>
                <div
                  className={`h-5 w-9 cursor-pointer rounded-full ring-1 transition-colors ${
                    defaultOn ? "bg-blue-600 ring-blue-200" : "bg-gray-200 ring-gray-100"
                  }`}
                />
              </div>
            ))}
          </div>
        </SettingsSection>

      </div>
    </>
  );
}
