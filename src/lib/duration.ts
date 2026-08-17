/**
 * mm:ss for a session countdown.
 *
 * Shared because the countdown appears in two places: the desktop session
 * panel and the mobile status strip. Keeping one copy stops them drifting into
 * showing the same number two different ways.
 */
export function formatDuration(totalSeconds: number): string {
  const s = Math.max(0, totalSeconds);
  const mins = Math.floor(s / 60);
  const secs = s % 60;
  return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
}
