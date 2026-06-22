"use client";

import { useState } from "react";
import { MoreHorizontal } from "lucide-react";
import { Input } from "@/components/ui/Input";
import type { DataTableColumn } from "@/types/dashboard.types";

interface DataTableProps<T extends { id: string }> {
  columns: DataTableColumn<T>[];
  rows: T[];
  searchPlaceholder?: string;
  pageSize?: number;
}

/**
 * Generic, reusable admin table (Task 8/9). Pass typed columns + rows in
 * and get search + pagination for free. Used across Courses, Tutors,
 * Students and Payments today — point `rows` at API data later with no
 * markup changes.
 */
export default function DataTable<T extends { id: string }>({
  columns,
  rows,
  searchPlaceholder = "Search...",
  pageSize = 5,
}: DataTableProps<T>) {
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);

  const filtered = rows.filter((row) =>
    Object.values(row).some((v) =>
      String(v).toLowerCase().includes(query.toLowerCase())
    )
  );

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const pageRows = filtered.slice((page - 1) * pageSize, page * pageSize);

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
      <div className="flex flex-col gap-3 border-b border-gray-100 p-4 sm:flex-row sm:items-center sm:justify-between">
        <Input
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setPage(1);
          }}
          placeholder={searchPlaceholder}
          className="h-9 max-w-xs"
        />
        <span className="text-xs font-medium text-gray-400">
          Showing {pageRows.length === 0 ? 0 : (page - 1) * pageSize + 1}-
          {Math.min(page * pageSize, filtered.length)} of {filtered.length}
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50/60">
              {columns.map((col) => (
                <th
                  key={String(col.key)}
                  className="whitespace-nowrap px-5 py-3 text-xs font-bold uppercase tracking-wide text-gray-400"
                >
                  {col.header}
                </th>
              ))}
              <th className="px-5 py-3" />
            </tr>
          </thead>
          <tbody>
            {pageRows.map((row) => (
              <tr
                key={row.id}
                className="border-b border-gray-50 transition-colors last:border-0 hover:bg-gray-50/60"
              >
                {columns.map((col) => (
                  <td key={String(col.key)} className={`px-5 py-4 text-gray-700 ${col.className ?? ""}`}>
                    {col.render ? col.render(row) : String(row[col.key])}
                  </td>
                ))}
                <td className="px-5 py-4 text-right">
                  <button
                    type="button"
                    aria-label="Row actions"
                    className="rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-700"
                  >
                    <MoreHorizontal className="h-4 w-4" />
                  </button>
                </td>
              </tr>
            ))}

            {pageRows.length === 0 && (
              <tr>
                <td colSpan={columns.length + 1} className="px-5 py-10 text-center text-sm text-gray-400">
                  No results found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between border-t border-gray-100 px-5 py-3">
          <button
            type="button"
            disabled={page === 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            className="rounded-lg px-3 py-1.5 text-xs font-semibold text-gray-500 transition-colors hover:bg-gray-100 disabled:opacity-40"
          >
            Previous
          </button>
          <span className="text-xs font-medium text-gray-400">
            Page {page} of {totalPages}
          </span>
          <button
            type="button"
            disabled={page === totalPages}
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            className="rounded-lg px-3 py-1.5 text-xs font-semibold text-gray-500 transition-colors hover:bg-gray-100 disabled:opacity-40"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
