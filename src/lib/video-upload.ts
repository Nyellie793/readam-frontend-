import * as tus from "tus-js-client";
import TUTOR from "@/services/tutor.service";
import type { VideoUploadResponse } from "@/types/api.types";

/**
 * Sending a video file to Cloudflare.
 *
 * Deliberately shared. The admin create wizard and the lesson editor each had
 * their own copy of this, and only one of them was ever fixed: the editor was
 * still doing a single POST long after large files had been moved to the
 * resumable protocol, so uploading through it failed for exactly the reason
 * that had already been solved elsewhere.
 */

/**
 * 10 MiB. Cloudflare requires chunks of at least 5,242,880 bytes, divisible by
 * 256 KiB; this is exactly 40 of those. Kept small on purpose: on a poor
 * connection only the failed chunk is retried, not the whole file.
 */
const TUS_CHUNK_BYTES = 10 * 1024 * 1024;

/**
 * Remembering an upload session so a retry resumes instead of restarting.
 *
 * Cloudflare reserves storage against the account the moment a session is
 * created and only releases it once the file lands or the link expires. Asking
 * for a fresh session on every retry therefore both throws away the progress
 * already made and leaves another reservation behind: a handful of retries was
 * enough to swallow most of a 1000 minute plan.
 *
 * Reusing the session instead means tus asks Cloudflare how much it already
 * has and carries on from there.
 */
const SESSION_PREFIX = "readam_upload_session:";

/** Stop reusing a session long before Cloudflare would expire it. */
const SESSION_TTL_MS = 3 * 60 * 60 * 1000;

interface StoredSession {
  saved: number;
  presigned: VideoUploadResponse;
}

function sessionKey(file: File) {
  return `${SESSION_PREFIX}${file.name}:${file.size}:${file.lastModified}`;
}

/**
 * The upload session for this file, reusing an unfinished one where possible.
 *
 * Only resumable sessions are reused. A plain POST has no partial state to
 * resume, so reusing one would gain nothing.
 */
export async function beginVideoUpload(file: File): Promise<VideoUploadResponse> {
  try {
    const raw = localStorage.getItem(sessionKey(file));
    if (raw) {
      const stored = JSON.parse(raw) as StoredSession;
      const fresh = Date.now() - stored.saved < SESSION_TTL_MS;
      if (fresh && stored.presigned?.upload_protocol === "tus") return stored.presigned;
      localStorage.removeItem(sessionKey(file));
    }
  } catch {
    // A corrupt or unavailable store just means starting over.
  }

  const presigned = await TUTOR.requestVideoUpload(file.name, file.size);
  try {
    const stored: StoredSession = { saved: Date.now(), presigned };
    localStorage.setItem(sessionKey(file), JSON.stringify(stored));
  } catch {
    // Losing the ability to resume is not worth failing the upload over.
  }
  return presigned;
}

/** Forget the session: either it succeeded, or Cloudflare no longer has it. */
export function clearVideoUploadSession(file: File) {
  try {
    localStorage.removeItem(sessionKey(file));
  } catch {
    // Nothing useful to do.
  }
}

/** Message for a failed upload, saying what actually happened. */
export function uploadErrorText(err: unknown, fallback: string): string {
  if (err instanceof Error && err.message.trim()) return err.message;
  return fallback;
}

/** Single POST. Cloudflare refuses these over 200 MB, after taking the whole file. */
function uploadWithPost(url: string, file: File, onProgress: (pct: number) => void) {
  return new Promise<void>((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("POST", url);
    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable) onProgress(Math.round((e.loaded / e.total) * 100));
    };
    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        resolve();
        return;
      }
      const body = (xhr.responseText || "").slice(0, 200);
      reject(new Error(`Cloudflare rejected this file (${xhr.status}). ${body}`.trim()));
    };
    xhr.onerror = () =>
      reject(new Error("The connection dropped while sending the file. Please try again."));
    xhr.ontimeout = () => reject(new Error("The upload timed out. Please try again."));
    const body = new FormData();
    body.append("file", file);
    xhr.send(body);
  });
}

/**
 * Chunked upload to a session the backend already created.
 *
 * uploadUrl, not endpoint: the session exists, and endpoint would have tus
 * create a second one.
 */
function uploadResumable(url: string, file: File, onProgress: (pct: number) => void) {
  return new Promise<void>((resolve, reject) => {
    const upload = new tus.Upload(file, {
      uploadUrl: url,
      chunkSize: TUS_CHUNK_BYTES,
      // Backs off and retries rather than losing the whole transfer to one
      // dropped connection.
      retryDelays: [0, 3000, 6000, 12000, 24000],
      metadata: { filename: file.name, filetype: file.type },
      onProgress: (sent, total) => onProgress(Math.round((sent / total) * 100)),
      onSuccess: () => resolve(),
      onError: (err) => {
        // A tus failure carries the request and response behind it. Rejecting
        // with only the message loses the status and body, which is the detail
        // that tells a refused chunk apart from a blocked request.
        const detail = err as tus.DetailedError;
        const res = detail?.originalResponse;
        if (res) {
          const method = detail.originalRequest?.getMethod?.() ?? "";
          const body = String(res.getBody() ?? "").slice(0, 200);
          reject(
            new Error(`Cloudflare rejected the upload (${method} ${res.getStatus()}). ${body}`.trim())
          );
          return;
        }
        reject(
          new Error(
            `${err?.message || "The upload failed"}. This usually means the connection dropped or was blocked.`
          )
        );
      },
    });
    upload.start();
  });
}

/**
 * Send the file using whichever protocol the backend provisioned.
 *
 * The choice is not the caller's to make: Cloudflare accepts a single POST of
 * any size, transfers it in full, and only then refuses anything over 200 MB.
 */
export async function uploadVideoFile(
  presigned: VideoUploadResponse,
  file: File,
  onProgress: (pct: number) => void
): Promise<void> {
  try {
    if (presigned.upload_protocol === "tus") {
      await uploadResumable(presigned.upload_url, file, onProgress);
    } else {
      await uploadWithPost(presigned.upload_url, file, onProgress);
    }
    clearVideoUploadSession(file);
  } catch (err) {
    // A session Cloudflare no longer recognises can never succeed, so keeping
    // it would make every retry fail the same way until the TTL ran out.
    if (err instanceof Error && /\b(403|404|410)\b/.test(err.message)) {
      clearVideoUploadSession(file);
    }
    throw err;
  }
}
