"use client";

import { Download, FileWarning, BookOpen } from "lucide-react";

interface PdfViewerProps {
  title: string;
  fileUrl?: string | null;
}

export default function PdfViewer({ title, fileUrl }: PdfViewerProps) {
  return (
    <div className="flex min-h-screen flex-col bg-gray-100">
      {/* PDF Topbar */}
      <div className="flex h-[56px] items-center gap-3 border-b border-gray-200 bg-white px-4 sm:px-6">
        <div className="flex min-w-0 items-center gap-2">
          <div className="flex size-7 shrink-0 items-center justify-center rounded bg-red-600">
            <BookOpen className="size-3.5 text-white" />
          </div>
          <span className="truncate text-sm font-semibold text-gray-900">{title}</span>
        </div>

        <a
          href={fileUrl ?? undefined}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Download"
          aria-disabled={!fileUrl}
          className="ml-auto rounded-lg p-2 hover:bg-gray-100 aria-disabled:pointer-events-none aria-disabled:opacity-40"
        >
          <Download className="size-4 text-gray-500" />
        </a>
      </div>

      {/* Real PDF, rendered by the browser's own PDF viewer */}
      <div className="flex-1">
        {fileUrl ? (
          <iframe src={fileUrl} title={title} className="h-full min-h-[calc(100vh-56px)] w-full border-0" />
        ) : (
          <div className="flex h-full min-h-[calc(100vh-56px)] flex-col items-center justify-center gap-2 text-gray-400">
            <FileWarning className="size-8" />
            <p className="text-sm">PDF not uploaded yet.</p>
          </div>
        )}
      </div>
    </div>
  );
}
