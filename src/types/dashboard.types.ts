import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

export interface StatCardData {
  id: string;
  label: string;
  value: string;
  delta?: string;
  trend?: "up" | "down" | "neutral";
  icon: LucideIcon;
  tone?: "default" | "dark" | "accent";
}

export type StatusTone = "success" | "warning" | "destructive" | "info" | "muted";

export interface DataTableColumn<T> {
  key: keyof T;
  header: string;
  render?: (row: T) => ReactNode;
  className?: string;
}

export interface ActivityItem {
  id: string;
  title: string;
  meta: string;
  time: string;
  tone?: StatusTone;
}

export interface ChartPoint {
  label: string;
  value: number;
}

export interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
}
