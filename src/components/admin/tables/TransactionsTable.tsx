"use client";

import DataTable from "@/components/admin/DataTable";
import { Badge } from "@/components/ui/Badge";
import type { TransactionRow } from "@/data/admin-mock";
import type { DataTableColumn } from "@/types/dashboard.types";

const statusVariant: Record<
  TransactionRow["status"],
  "success" | "warning" | "destructive"
> = {
  Completed: "success",
  Pending: "warning",
  Failed: "destructive",
};

const columns: DataTableColumn<TransactionRow>[] = [
  {
    key: "id",
    header: "ID & Date",
    render: (row) => (
      <div>
        <p className="font-semibold text-gray-800">{row.id}</p>
        <p className="text-xs text-gray-400">{row.date}</p>
      </div>
    ),
  },
  { key: "party", header: "Party" },
  { key: "type", header: "Type" },
  { key: "amount", header: "Amount", className: "font-semibold" },
  {
    key: "status",
    header: "Status",
    render: (row) => (
      <Badge variant={statusVariant[row.status]}>{row.status}</Badge>
    ),
  },
];

export default function TransactionsTable({ rows }: { rows: TransactionRow[] }) {
  return (
    <DataTable
      columns={columns}
      rows={rows}
      searchPlaceholder="Search transactions…"
    />
  );
}
