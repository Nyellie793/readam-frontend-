import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/** Whole francs with thousands separators, e.g. "15,000 XAF". XAF has no minor unit. */
export function xaf(amount: number): string {
  return `${amount.toLocaleString()} XAF`;
}

/**
 * Course tags as typed in a form, split into the list the API stores. Mirrors
 * the API's own rule (comma, semicolon, pipe, middle dot, bullet or newline), so
 * the preview shows exactly the chips that will be saved. Two live courses once
 * got one tag holding a whole " · "-separated keyword list this way.
 */
export function splitTags(raw: string): string[] {
  const seen = new Set<string>();
  const tags: string[] = [];
  for (const part of raw.split(/[,;|·•\n]/)) {
    const tag = part.trim().replace(/\s+/g, " ");
    if (!tag) continue;
    const key = tag.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    tags.push(tag);
  }
  return tags;
}
