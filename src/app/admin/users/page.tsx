"use client";

import { useEffect, useState } from "react";
import Topbar from "@/components/admin/Topbar";
import ADMIN from "@/services/admin.service";
import { Badge } from "@/components/ui/Badge";
import type { AdminUserResponse, UserListResponse } from "@/types/api.types";

export default function UsersPage() {
  const [users, setUsers] = useState<AdminUserResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState<string | undefined>();

  useEffect(() => {
    setLoading(true);
    (ADMIN.getUsers(1, role) as Promise<UserListResponse>)
      .then(d => setUsers(d.items))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [role]);

  async function toggleActive(user: AdminUserResponse) {
    const updated = await ADMIN.updateUser(user.id, { is_active: !user.is_active }) as AdminUserResponse;
    setUsers(p => p.map(u => u.id === updated.id ? updated : u));
  }

  return (
    <>
      <Topbar title="Users Management" description="Manage all platform users." />
      <div className="space-y-6 p-4 sm:p-6">
        <div className="flex gap-2">
          {[undefined, "student", "tutor", "admin"].map(r => (
            <button key={r ?? "all"} onClick={() => setRole(r)}
              className={`rounded-lg px-3 py-1.5 text-xs font-semibold capitalize transition ${role === r ? "bg-blue-600 text-white" : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"}`}>
              {r ?? "All"}
            </button>
          ))}
        </div>

        <div className="rounded-2xl border border-gray-100 bg-white shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead className="border-b border-gray-100 bg-gray-50">
              <tr>
                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500">User</th>
                <th className="hidden px-5 py-3 text-left text-xs font-semibold text-gray-500 sm:table-cell">Role</th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500">Status</th>
                <th className="px-5 py-3 text-right text-xs font-semibold text-gray-500">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading
                ? Array.from({ length: 5 }).map((_, i) => (
                    <tr key={i}><td colSpan={4} className="px-5 py-4"><div className="h-4 animate-pulse rounded bg-gray-100" /></td></tr>
                  ))
                : users.map(u => (
                    <tr key={u.id} className="hover:bg-gray-50">
                      <td className="px-5 py-4">
                        <p className="font-medium text-gray-900">{u.full_name}</p>
                        <p className="text-xs text-gray-400">{u.email}</p>
                      </td>
                      <td className="hidden px-5 py-4 sm:table-cell">
                        <span className="capitalize text-gray-600">{u.role ?? "—"}</span>
                      </td>
                      <td className="px-5 py-4">
                        <Badge variant={u.is_active ? "success" : "destructive"}>
                          {u.is_active ? "Active" : "Suspended"}
                        </Badge>
                      </td>
                      <td className="px-5 py-4 text-right">
                        <button onClick={() => toggleActive(u)}
                          className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition ${u.is_active ? "bg-red-50 text-red-600 hover:bg-red-100" : "bg-emerald-50 text-emerald-600 hover:bg-emerald-100"}`}>
                          {u.is_active ? "Suspend" : "Reactivate"}
                        </button>
                      </td>
                    </tr>
                  ))
              }
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}