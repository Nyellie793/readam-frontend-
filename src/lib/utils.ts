import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/** Whole francs with thousands separators, e.g. "15,000 XAF". XAF has no minor unit. */
export function xaf(amount: number): string {
  return `${amount.toLocaleString()} XAF`;
}
