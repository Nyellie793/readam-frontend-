/**
 * Minimal WebVTT parser.
 *
 * The transcript panel reads the same VTT file the <track> element loads, so
 * there is no second source of truth and nothing extra to store server-side.
 * We parse it ourselves rather than reading `track.cues` because cues are only
 * populated while the track mode is "showing" or "hidden" — turning subtitles
 * off would otherwise empty the transcript.
 *
 * This handles the subset Cloudflare Stream emits: an optional WEBVTT header,
 * optional cue identifiers, `hh:mm:ss.mmm --> hh:mm:ss.mmm` timings with
 * optional trailing settings, and one or more lines of cue text. NOTE, STYLE
 * and REGION blocks are skipped.
 */

export interface Cue {
  start: number;
  end: number;
  text: string;
}

const TIMING = /^(\S+)\s+-->\s+(\S+)/;

/** `hh:mm:ss.mmm` or `mm:ss.mmm` to seconds. Returns NaN if unparseable. */
function toSeconds(stamp: string): number {
  const parts = stamp.trim().split(":");
  if (parts.length < 2 || parts.length > 3) return NaN;
  let seconds = 0;
  for (const part of parts) {
    const n = Number(part.replace(",", "."));
    if (Number.isNaN(n)) return NaN;
    seconds = seconds * 60 + n;
  }
  return seconds;
}

/** Strip the inline tags VTT allows (`<v Speaker>`, `<i>`, `<00:00:01.000>`). */
function stripTags(line: string): string {
  return line.replace(/<[^>]*>/g, "").trim();
}

export function parseVtt(source: string): Cue[] {
  const cues: Cue[] = [];
  // Normalise line endings, then split into blocks on blank lines.
  const blocks = source.replace(/\r\n?/g, "\n").split(/\n{2,}/);

  for (const block of blocks) {
    const lines = block.split("\n").filter((l) => l.trim() !== "");
    if (lines.length === 0) continue;

    const first = lines[0].trim();
    if (first.startsWith("WEBVTT") || /^(NOTE|STYLE|REGION)\b/.test(first)) continue;

    // The timing line is either the first line, or the second when the cue
    // carries an identifier.
    const timingIndex = TIMING.test(first) ? 0 : 1;
    const timingLine = lines[timingIndex];
    if (!timingLine) continue;

    const match = TIMING.exec(timingLine.trim());
    if (!match) continue;

    const start = toSeconds(match[1]);
    const end = toSeconds(match[2]);
    if (Number.isNaN(start) || Number.isNaN(end)) continue;

    const text = lines
      .slice(timingIndex + 1)
      .map(stripTags)
      .filter(Boolean)
      .join(" ");
    if (!text) continue;

    cues.push({ start, end, text });
  }

  return cues;
}

/** `hh:mm:ss` for durations over an hour, `mm:ss` otherwise. */
export function formatTimestamp(seconds: number): string {
  const s = Math.max(0, Math.floor(seconds));
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  const pad = (n: number) => String(n).padStart(2, "0");
  return h > 0 ? `${h}:${pad(m)}:${pad(sec)}` : `${m}:${pad(sec)}`;
}
