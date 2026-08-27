import * as tus from "tus-js-client";
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
export function uploadVideoFile(
  presigned: VideoUploadResponse,
  file: File,
  onProgress: (pct: number) => void
): Promise<void> {
  return presigned.upload_protocol === "tus"
    ? uploadResumable(presigned.upload_url, file, onProgress)
    : uploadWithPost(presigned.upload_url, file, onProgress);
}
