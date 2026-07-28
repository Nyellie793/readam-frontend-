"use client";

import React from "react";
import { Badge } from "@/components/ui/Badge";

interface NotificationGroupProps {
  title: string;
  badgeContent?: string;
  children: React.ReactNode;
}

export default function NotificationGroup({
  title,
  badgeContent,
  children,
}: NotificationGroupProps) {
  return (
    <div className="space-y-4">
      {/* Group Header */}
      <div className="flex items-center justify-between border-b border-gray-100 pb-3.5">
        <h3 className="text-sm font-bold text-gray-800 tracking-wide uppercase">{title}</h3>
        {badgeContent && (
          <Badge className="bg-blue-50 hover:bg-blue-50 text-blue-600 border border-blue-100 rounded-lg px-2 py-0.5 text-[10px] font-extrabold tracking-wider">
            {badgeContent}
          </Badge>
        )}
      </div>

      {/* Children List */}
      <div className="space-y-3">
        {children}
      </div>
    </div>
  );
}
