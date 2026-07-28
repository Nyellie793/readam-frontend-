import React from "react";

interface SettingsSectionProps {
  id: string;
  title: string;
  description: string;
  children: React.ReactNode;
}

export default function SettingsSection({
  id,
  title,
  description,
  children,
}: SettingsSectionProps) {
  return (
    <section id={id} className="scroll-mt-20 border-b border-gray-100 pb-10 pt-6 last:border-0 last:pb-0">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-1">
          <h2 className="text-lg font-bold text-gray-900">{title}</h2>
          <p className="mt-1.5 text-sm text-gray-500 max-w-sm leading-relaxed">{description}</p>
        </div>
        <div className="lg:col-span-2 space-y-6">
          {children}
        </div>
      </div>
    </section>
  );
}
