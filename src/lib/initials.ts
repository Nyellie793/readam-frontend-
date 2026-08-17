/**
 * Initials for an avatar fallback.
 *
 * Deliberately in a plain module rather than alongside useStoredUser, which is
 * marked "use client". A function exported from a client module cannot be
 * *called* during server render — React throws "Attempted to call initialsOf()
 * from the server" — so importing it into a server component silently broke
 * that component's whole subtree. Three server components were doing exactly
 * that.
 */
export function initialsOf(fullName: string | null | undefined, fallback = "ST"): string {
  if (!fullName) return fallback;
  const letters = fullName
    .split(" ")
    .map((n) => n[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();
  return letters || fallback;
}
