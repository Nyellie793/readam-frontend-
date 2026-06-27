import Topbar from "@/components/admin/Topbar";
import { Badge } from "@/components/ui/Badge";
import { Input } from "@/components/ui/Input";
import { Globe, Palette, Bell, Shield, GraduationCap, Users, AlertTriangle } from "lucide-react";

const ROLES = [
  { role: "Super Admin", permissions: ["All permissions"], count: 1 },
  { role: "Content Manager", permissions: ["Courses", "PDF Library", "Videos"], count: 4 },
  { role: "Support Agent", permissions: ["Students", "Tickets"], count: 6 },
  { role: "Finance Viewer", permissions: ["Payments", "Reports (read-only)"], count: 2 },
];

const ACADEMIC_LEVELS = [
  { level: "Form 1–3", type: "O/L Track", subjects: 8, active: true },
  { level: "Form 4–5", type: "O/L Track", subjects: 12, active: true },
  { level: "Lower 6th", type: "A/L Track", subjects: 10, active: true },
  { level: "Upper 6th", type: "A/L Track", subjects: 10, active: true },
  { level: "Premiere", type: "Bac Track", subjects: 9, active: false },
  { level: "Terminale", type: "Bac Track", subjects: 9, active: false },
];

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

        {/* Appearance */}
        <SettingsSection icon={Palette} title="Appearance & Branding" description="Colours, theme defaults and UI preferences">
          <div className="grid gap-4 sm:grid-cols-3">
            {[
              { label: "Primary Colour", value: "#2563EB" },
              { label: "Accent Colour", value: "#F97316" },
              { label: "Brand Font", value: "Geist Sans" },
            ].map(({ label, value }) => (
              <div key={label}>
                <label className="mb-1.5 block text-xs font-semibold text-gray-600">{label}</label>
                <Input defaultValue={value} />
              </div>
            ))}
          </div>

          <div className="mt-5 flex items-center justify-between rounded-xl border border-gray-100 bg-gray-50/60 p-4">
            <div>
              <p className="text-sm font-semibold text-gray-800">Dark Mode Support</p>
              <p className="text-xs text-gray-400">Allow students to switch to dark theme</p>
            </div>
            {/* Placeholder toggle — connect to ThemeProvider later */}
            <div className="h-6 w-11 cursor-pointer rounded-full bg-blue-600 ring-2 ring-blue-200" />
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

        {/* Role Management */}
        <SettingsSection icon={Shield} title="Role Management" description="Define what each admin role can access">
          <div className="overflow-hidden rounded-xl border border-gray-100">
            <table className="w-full min-w-[480px] text-left text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50/60">
                  <th className="px-4 py-3 text-xs font-bold uppercase tracking-wide text-gray-400">Role</th>
                  <th className="px-4 py-3 text-xs font-bold uppercase tracking-wide text-gray-400">Permissions</th>
                  <th className="px-4 py-3 text-xs font-bold uppercase tracking-wide text-gray-400">Admins</th>
                  <th className="px-4 py-3" />
                </tr>
              </thead>
              <tbody>
                {ROLES.map((r) => (
                  <tr key={r.role} className="border-b border-gray-50 last:border-0 hover:bg-gray-50/60">
                    <td className="px-4 py-3 font-semibold text-gray-800">{r.role}</td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-1">
                        {r.permissions.map((p) => (
                          <Badge key={p} variant="info">{p}</Badge>
                        ))}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-gray-500">{r.count}</td>
                    <td className="px-4 py-3 text-right">
                      <button className="text-xs font-semibold text-blue-600 hover:underline">Edit</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-4 flex justify-end">
            <button className="flex items-center gap-2 rounded-xl border border-gray-200 px-4 py-2 text-xs font-semibold text-gray-600 transition hover:bg-gray-50">
              <Users className="h-3.5 w-3.5" />
              Add New Role
            </button>
          </div>
        </SettingsSection>

        {/* Academic Structure */}
        <SettingsSection icon={GraduationCap} title="Academic Structure" description="Manage the curriculum levels and exam tracks">
          <div className="overflow-hidden rounded-xl border border-gray-100">
            <table className="w-full min-w-[480px] text-left text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50/60">
                  <th className="px-4 py-3 text-xs font-bold uppercase tracking-wide text-gray-400">Level</th>
                  <th className="px-4 py-3 text-xs font-bold uppercase tracking-wide text-gray-400">Track</th>
                  <th className="px-4 py-3 text-xs font-bold uppercase tracking-wide text-gray-400">Subjects</th>
                  <th className="px-4 py-3 text-xs font-bold uppercase tracking-wide text-gray-400">Status</th>
                  <th className="px-4 py-3" />
                </tr>
              </thead>
              <tbody>
                {ACADEMIC_LEVELS.map((l) => (
                  <tr key={l.level} className="border-b border-gray-50 last:border-0 hover:bg-gray-50/60">
                    <td className="px-4 py-3 font-semibold text-gray-800">{l.level}</td>
                    <td className="px-4 py-3 text-gray-500">{l.type}</td>
                    <td className="px-4 py-3 text-gray-500">{l.subjects}</td>
                    <td className="px-4 py-3">
                      <Badge variant={l.active ? "success" : "muted"}>
                        {l.active ? "Active" : "Inactive"}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button className="text-xs font-semibold text-blue-600 hover:underline">Edit</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </SettingsSection>

        {/* Danger zone */}
        <div className="rounded-2xl border border-red-200 bg-red-50/40 p-6">
          <div className="flex items-center gap-2 text-red-700">
            <AlertTriangle className="h-4.5 w-4.5" />
            <h3 className="text-sm font-bold">Danger Zone</h3>
          </div>
          <p className="mt-1 text-xs text-red-600/70">These actions are irreversible. Proceed with extreme caution.</p>
          <div className="mt-4 flex flex-wrap gap-3">
            <button className="rounded-xl border border-red-300 bg-white px-4 py-2 text-xs font-semibold text-red-600 transition hover:bg-red-50">
              Flush all sessions
            </button>
            <button className="rounded-xl border border-red-300 bg-white px-4 py-2 text-xs font-semibold text-red-600 transition hover:bg-red-50">
              Reset AI usage counters
            </button>
            <button className="rounded-xl bg-red-600 px-4 py-2 text-xs font-semibold text-white transition hover:bg-red-700">
              Delete all inactive accounts
            </button>
          </div>
        </div>

      </div>
    </>
  );
}
