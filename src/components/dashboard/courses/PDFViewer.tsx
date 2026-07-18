"use client";

import { useState } from "react";
import {
  ZoomIn,
  ZoomOut,
  ChevronLeft,
  ChevronRight,
  Bookmark,
  Printer,
  Download,
  Sparkles,
  BookOpen,
} from "lucide-react";

interface PdfViewerProps {
  title: string;
  totalPages?: number;
}

const MOCK_PAGE = {
  course: "CHM 401: ADVANCED ORGANIC SYNTHESIS",
  section: "3.4 Carbonyl Addition Mechanisms",
  body: [
    "Nucleophilic addition to the carbonyl group is a fundamental reaction in organic chemistry. The polarization of the C=O bond creates a significant partial positive charge on the carbon atom, making it highly susceptible to nucleophilic attack.",
    "The reactivity of carbonyl compounds follows the order: Formaldehyde > Aldehydes > Ketones. This trend is explained by both electronic and steric effects. Alkyl groups are electron-donating, which reduces the electrophilicity of the carbonyl carbon...",
    "The reactivity of carbonyl compounds follows the order: Formaldehyde > Aldehydes > Ketones. This trend is explained by both electronic and steric effects. Alkyl groups are electron-donating, which reduces the electrophilicity of the carbonyl carbon...",
  ],
  figureCaption:
    "Fig 14.2: General Nucleophilic Addition Mechanism involving a tetrahedral intermediate stabilization.",
};

export default function PdfViewer({ title, totalPages = 45 }: PdfViewerProps) {
  const [currentPage, setCurrentPage] = useState(14);
  const [zoom, setZoom] = useState(100);
  const [bookmarked, setBookmarked] = useState(false);

  const goTo = (page: number) => {
    setCurrentPage(Math.min(Math.max(1, page), totalPages));
  };

  return (
    <div className="flex min-h-screen flex-col bg-gray-100">
      {/* PDF Topbar */}
      <div className="flex h-[56px] items-center gap-3 border-b border-gray-200 bg-white px-4 sm:px-6">
        {/* Title */}
        <div className="flex items-center gap-2 min-w-0">
          <div className="flex size-7 shrink-0 items-center justify-center rounded bg-red-600">
            <BookOpen className="size-3.5 text-white" />
          </div>
          <span className="truncate text-sm font-semibold text-gray-900">{title}</span>
        </div>

        {/* Zoom controls */}
        <div className="ml-auto flex items-center gap-1 rounded-lg border border-gray-200 px-2 py-1">
          <button
            onClick={() => setZoom((z) => Math.max(50, z - 10))}
            className="rounded p-1 hover:bg-gray-100"
            aria-label="Zoom out"
          >
            <ZoomOut className="size-3.5 text-gray-600" />
          </button>
          <span className="w-10 text-center text-xs font-medium text-gray-700">{zoom}%</span>
          <button
            onClick={() => setZoom((z) => Math.min(200, z + 10))}
            className="rounded p-1 hover:bg-gray-100"
            aria-label="Zoom in"
          >
            <ZoomIn className="size-3.5 text-gray-600" />
          </button>
        </div>

        {/* Page navigation */}
        <div className="flex items-center gap-1 rounded-lg border border-gray-200 px-2 py-1">
          <button
            onClick={() => goTo(currentPage - 1)}
            disabled={currentPage <= 1}
            className="rounded p-1 hover:bg-gray-100 disabled:opacity-40"
            aria-label="Previous page"
          >
            <ChevronLeft className="size-3.5 text-gray-600" />
          </button>
          <input
            type="number"
            value={currentPage}
            min={1}
            max={totalPages}
            onChange={(e) => goTo(Number(e.target.value))}
            className="w-8 bg-transparent text-center text-xs font-medium text-gray-700 outline-none"
          />
          <span className="text-xs text-gray-400">/ {totalPages}</span>
          <button
            onClick={() => goTo(currentPage + 1)}
            disabled={currentPage >= totalPages}
            className="rounded p-1 hover:bg-gray-100 disabled:opacity-40"
            aria-label="Next page"
          >
            <ChevronRight className="size-3.5 text-gray-600" />
          </button>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1">
          <button
            onClick={() => setBookmarked((b) => !b)}
            aria-label="Bookmark"
            className="rounded-lg p-2 hover:bg-gray-100"
          >
            <Bookmark
              className={`size-4 ${bookmarked ? "fill-blue-600 text-blue-600" : "text-gray-500"}`}
            />
          </button>
          <button aria-label="Print" className="rounded-lg p-2 hover:bg-gray-100">
            <Printer className="size-4 text-gray-500" />
          </button>
          <button aria-label="Download" className="rounded-lg p-2 hover:bg-gray-100">
            <Download className="size-4 text-gray-500" />
          </button>
        </div>
      </div>

      {/* Document body */}
      <div className="flex-1 overflow-y-auto px-4 py-6">
        <div
          className="mx-auto rounded-lg bg-white p-8 shadow-sm sm:p-12"
          style={{
            maxWidth: 720,
            transform: `scale(${zoom / 100})`,
            transformOrigin: "top center",
          }}
        >
          {/* Page header */}
          <div className="flex items-center justify-between border-b border-gray-200 pb-3">
            <span className="text-[10px] font-semibold uppercase tracking-widest text-gray-400">
              {MOCK_PAGE.course}
            </span>
            <span className="text-[10px] text-gray-400">Page {currentPage}</span>
          </div>

          {/* Section heading */}
          <h1 className="mt-8 text-3xl font-bold text-gray-900">{MOCK_PAGE.section}</h1>

          {/* First paragraph */}
          <p className="mt-6 text-sm leading-7 text-gray-700">{MOCK_PAGE.body[0]}</p>

          {/* Mock figure */}
          <div className="mt-8 rounded-xl border border-gray-200 bg-gray-50 p-4">
            <div className="flex aspect-[16/7] items-center justify-center rounded-lg bg-white">
              {/* Simplified chemistry diagram placeholder */}
              <svg viewBox="0 0 400 140" className="w-full max-w-md" aria-hidden="true">
                {/* Benzene ring */}
                <polygon
                  points="60,40 80,20 110,20 130,40 110,60 80,60"
                  fill="none"
                  stroke="#374151"
                  strokeWidth="1.5"
                />
                <circle cx="95" cy="40" r="10" fill="none" stroke="#374151" strokeWidth="1" />
                {/* Bond line going right */}
                <line x1="130" y1="40" x2="165" y2="40" stroke="#374151" strokeWidth="1.5" />
                {/* C=O */}
                <text x="168" y="35" fontSize="11" fill="#374151" fontFamily="serif">
                  O
                </text>
                <line x1="165" y1="38" x2="185" y2="38" stroke="#374151" strokeWidth="1.5" />
                <line x1="165" y1="43" x2="185" y2="43" stroke="#374151" strokeWidth="1.5" />
                {/* Chain */}
                <line x1="185" y1="40" x2="215" y2="40" stroke="#374151" strokeWidth="1.5" />
                <line x1="215" y1="40" x2="240" y2="55" stroke="#374151" strokeWidth="1.5" />
                {/* OH */}
                <text x="242" y="52" fontSize="11" fill="#374151" fontFamily="serif">
                  OH
                </text>
                {/* Bottom circle with arrow */}
                <circle cx="95" cy="100" r="8" fill="none" stroke="#374151" strokeWidth="1.5" />
                {/* Arrow */}
                <line x1="110" y1="100" x2="250" y2="100" stroke="#2563eb" strokeWidth="2.5" />
                <polygon points="250,96 260,100 250,104" fill="#2563eb" />
                {/* HCl label */}
                <text x="60" y="118" fontSize="9" fill="#6b7280" fontFamily="serif">
                  HCl
                </text>
                <text x="72" y="113" fontSize="7" fill="#6b7280" fontFamily="serif">
                  H
                </text>
              </svg>
            </div>
            <p className="mt-3 text-center text-[11px] italic text-gray-400">
              {MOCK_PAGE.figureCaption}
            </p>
          </div>

          {/* Remaining paragraphs */}
          {MOCK_PAGE.body.slice(1).map((para, i) => (
            <p key={i} className="mt-6 text-sm leading-7 text-gray-700">
              {para}
            </p>
          ))}

          {/* AI actions at bottom of page */}
          <div className="mt-12 flex items-center justify-center gap-6 border-t border-gray-100 pt-6">
            <button
              type="button"
              className="flex items-center gap-2 text-sm font-semibold text-blue-600 hover:underline"
            >
              <Sparkles className="size-4" />
              AI Summary
            </button>
            <button
              type="button"
              className="flex items-center gap-2 text-sm font-semibold text-blue-600 hover:underline"
            >
              <BookOpen className="size-4" />
              Test Knowledge
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}