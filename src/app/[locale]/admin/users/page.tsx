"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Search, Loader2 } from "lucide-react";
import Topbar from "@/components/admin/Topbar";
import ADMIN from "@/services/admin.service";
import { Badge } from "@/components/ui/Badge";
import { getStoredUser } from "@/lib/auth";
import type { AdminUserResponse, UserListResponse } from "@/types/api.types";

const ROLES = ["student", "tutor", "admin"] as const;

export default function UsersPage() {
  const [users, setUsers] = useState<AdminUserResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState<string | undefined>();
  const [search, setSearch] = useState("");
  const [query, setQuery] = useState("");
  // Tracks which row has a request in flight, so only that row disables.
  const [busyId, setBusyId] = useState<string | null>(null);
  const [selfId, setSelfId] = useState<string | null>(null);

  useEffect(() => {
    setSelfId(getStoredUser()?.id ?? null);
  }, []);

  // Debounce so typing an email does not fire a request per keystroke.
  useEffect(() => {
    const timer = setTimeout(() => setQuery(search.trim()), 350);
    return () => clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    (ADMIN.getUsers(1, role, query) as Promise<UserListResponse>)
      .then((d) => {
        if (!cancelled) setUsers(d.items);
      })
      .catch((e) => {
        if (!cancelled) toast.error(e?.detail ?? "Could not load users");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [role, query]);

  async function toggleActive(user: AdminUserResponse) {
    setBusyId(user.id);
    try {
      const updated = (await ADMIN.updateUser(user.id, {
        is_active: !user.is_active,
      })) as AdminUserResponse;
      setUsers((p) => p.map((u) => (u.id === updated.id ? updated : u)));
      toast.success(
        updated.is_active ? "Account reactivated" : "Account suspended",
      );
    } catch (e) {
      toast.error(
        (e as { detail?: string })?.detail ?? "Could not update the account",
      );
    } finally {
      setBusyId(null);
    }
  }

  async function changeRole(user: AdminUserResponse, next: string) {
    if (next === user.role) return;
    // Promoting to admin grants full platform control, so it gets a confirm
    // step. Demoting yourself would lock you out of this page entirely.
    if (next === "admin") {
      const ok = window.confirm(
        `Grant ${user.email} full admin access?\n\n` +
          "Admins can manage every user, course and payment on the platform.",
      );
      if (!ok) return;
    }
    if (user.id === selfId) {
      toast.error("You cannot change your own role");
      return;
    }

    setBusyId(user.id);
    try {
      const updated = (await ADMIN.updateUser(user.id, {
        role: next,
      })) as AdminUserResponse;
      setUsers((p) => p.map((u) => (u.id === updated.id ? updated : u)));
      toast.success(`${updated.email} is now ${next}`);
    } catch (e) {
      toast.error(
        (e as { detail?: string })?.detail ?? "Could not change the role",
      );
    } finally {
      setBusyId(null);
    }
  }

  return (
    <>
      <Topbar
        title="Users Management"
        description="Manage all platform users."
      />
      <div className="space-y-6 p-4 sm:p-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap gap-2">
            {[undefined, ...ROLES].map((r) => (
              <button
                key={r ?? "all"}
                onClick={() => setRole(r)}
                className={`rounded-lg px-3 py-1.5 text-xs font-semibold capitalize transition ${
                  role === r
                    ? "bg-blue-600 text-white"
                    : "border border-gray-200 bg-white text-gray-600 hover:bg-gray-50"
                }`}
              >
                {r ?? "All"}
              </button>
            ))}
          </div>

          <div className="relative w-full sm:w-72">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-gray-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by email or name"
              className="w-full rounded-lg border border-gray-200 py-2 pl-9 pr-3 text-sm outline-none transition placeholder:text-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </div>
        </div>

        <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[620px] text-sm">
              <thead className="border-b border-gray-100 bg-gray-50">
                <tr>
                  <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500">
                    User
                  </th>
                  <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500">
                    Role
                  </th>
                  <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500">
                    Status
                  </th>
                  <th className="px-5 py-3 text-right text-xs font-semibold text-gray-500">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {loading &&
                  Array.from({ length: 5 }).map((_, i) => (
                    <tr key={i}>
                      <td colSpan={4} className="px-5 py-4">
                        <div className="h-4 animate-pulse rounded bg-gray-100" />
                      </td>
                    </tr>
                  ))}

                {!loading && users.length === 0 && (
                  <tr>
                    <td
                      colSpan={4}
                      className="px-5 py-10 text-center text-sm text-gray-400"
                    >
                      {query
                        ? `No user matches "${query}". They may not have signed up yet.`
                        : "No users found."}
                    </td>
                  </tr>
                )}

                {!loading &&
                  users.map((u) => (
                    <tr key={u.id} className="hover:bg-gray-50">
                      <td className="px-5 py-4">
                        <p className="font-medium text-gray-900">
                          {u.full_name}
                        </p>
                        <p className="text-xs text-gray-400">{u.email}</p>
                      </td>
                      <td className="px-5 py-4">
                        <select
                          value={u.role ?? ""}
                          disabled={busyId === u.id || u.id === selfId}
                          onChange={(e) => changeRole(u, e.target.value)}
                          className="rounded-lg border border-gray-200 bg-white px-2 py-1.5 text-xs font-semibold capitalize text-gray-700 outline-none transition focus:border-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          {!u.role && <option value="">Not set</option>}
                          {ROLES.map((r) => (
                            <option key={r} value={r} className="capitalize">
                              {r}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td className="px-5 py-4">
                        <Badge
                          variant={u.is_active ? "success" : "destructive"}
                        >
                          {u.is_active ? "Active" : "Suspended"}
                        </Badge>
                      </td>
                      <td className="px-5 py-4 text-right">
                        <button
                          onClick={() => toggleActive(u)}
                          disabled={busyId === u.id || u.id === selfId}
                          className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition disabled:cursor-not-allowed disabled:opacity-50 ${
                            u.is_active
                              ? "bg-red-50 text-red-600 hover:bg-red-100"
                              : "bg-emerald-50 text-emerald-600 hover:bg-emerald-100"
                          }`}
                        >
                          {busyId === u.id && (
                            <Loader2 className="size-3 animate-spin" />
                          )}
                          {u.is_active ? "Suspend" : "Reactivate"}
                        </button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}
