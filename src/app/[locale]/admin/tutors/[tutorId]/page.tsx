"use client";

import { useCallback, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { toast } from "sonner";
import {
  ArrowLeft,
  ShieldCheck,
  ShieldAlert,
  Mail,
  Phone,
  MapPin,
  BookOpen,
  Users,
  Loader2,
} from "lucide-react";
import Topbar from "@/components/admin/Topbar";
import { Badge } from "@/components/ui/Badge";
import ADMIN from "@/services/admin.service";
import type { AdminTutorDetail } from "@/types/api.types";

const STATUS_VARIANT: Record<string, "success" | "warning" | "destructive" | "muted"> = {
  published: "success",
  pending_review: "warning",
  rejected: "destructive",
  draft: "muted",
};

const STATUS_LABEL: Record<string, string> = {
  published: "Published",
  pending_review: "Pending review",
  rejected: "Rejected",
  draft: "Draft",
};

function Field({ label, value, icon: Icon }: {
  label: string;
  value: string | null;
  icon?: React.ComponentType<{ className?: string }>;
}) {
  return (
    <div>
      <p className="text-xs font-semibold text-gray-400">{label}</p>
      <p className="mt-1 flex items-center gap-1.5 text-sm text-gray-800">
        {Icon && <Icon className="size-3.5 shrink-0 text-gray-400" />}
        {value?.trim() ? value : <span className="text-gray-300">Not provided</span>}
      </p>
    </div>
  );
}

export default function TutorDetailPage() {
  const { tutorId } = useParams<{ tutorId: string }>();
  const router = useRouter();
  const [tutor, setTutor] = useState<AdminTutorDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      setTutor((await ADMIN.getTutorDetail(tutorId)) as AdminTutorDetail);
    } catch (e) {
      setError((e as { detail?: string })?.detail ?? "Could not load this tutor.");
    } finally {
      setLoading(false);
    }
  }, [tutorId]);

  useEffect(() => {
    void load();
  }, [load]);

  async function toggleVerified() {
    if (!tutor) return;
    const next = !tutor.is_verified;
    setSaving(true);
    try {
      await ADMIN.verifyTutor(tutor.id, next);
      setTutor({ ...tutor, is_verified: next });
      toast.success(next ? "Tutor verified" : "Verification removed");
    } catch (e) {
      toast.error((e as { detail?: string })?.detail ?? "Could not update verification");
    } finally {
      setSaving(false);
    }
  }

  return (
    <>
      <Topbar title="Tutor Profile" description="Review this tutor before verifying them." />

      <div className="space-y-6 p-4 sm:p-6">
        <button
          onClick={() => router.push("/admin/tutors")}
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-gray-500 transition hover:text-gray-800"
        >
          <ArrowLeft className="size-4" />
          Back to tutors
        </button>

        {loading && (
          <div className="space-y-4">
            <div className="h-32 animate-pulse rounded-2xl bg-gray-100" />
            <div className="h-48 animate-pulse rounded-2xl bg-gray-100" />
          </div>
        )}

        {!loading && error && (
          <div className="rounded-2xl border border-red-100 bg-red-50/60 p-6">
            <p className="text-sm font-semibold text-red-700">{error}</p>
            <button
              onClick={() => void load()}
              className="mt-3 rounded-xl border border-red-200 bg-white px-4 py-2 text-xs font-semibold text-red-600 transition hover:bg-red-50"
            >
              Try again
            </button>
          </div>
        )}

        {!loading && !error && tutor && (
          <>
            {/* Identity + verification action */}
            <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
              <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
                <div className="flex items-start gap-4">
                  {tutor.avatar_url ? (
                    <Image
                      src={tutor.avatar_url}
                      alt=""
                      width={64}
                      height={64}
                      className="size-16 shrink-0 rounded-2xl object-cover"
                    />
                  ) : (
                    <span className="flex size-16 shrink-0 items-center justify-center rounded-2xl bg-blue-600 text-lg font-bold text-white">
                      {tutor.full_name.slice(0, 2).toUpperCase()}
                    </span>
                  )}
                  <div className="min-w-0">
                    <h2 className="text-lg font-bold text-gray-900">
                      {tutor.display_name?.trim() || tutor.full_name}
                    </h2>
                    {tutor.title && <p className="text-sm text-gray-500">{tutor.title}</p>}
                    <div className="mt-2 flex flex-wrap items-center gap-2">
                      <Badge variant={tutor.is_verified ? "success" : "warning"}>
                        {tutor.is_verified ? "Verified" : "Not verified"}
                      </Badge>
                      <Badge variant={tutor.is_active ? "success" : "destructive"}>
                        {tutor.is_active ? "Active" : "Suspended"}
                      </Badge>
                      {!tutor.profile_completed && (
                        <Badge variant="muted">Profile incomplete</Badge>
                      )}
                    </div>
                  </div>
                </div>

                <button
                  onClick={toggleVerified}
                  disabled={saving}
                  className={`inline-flex shrink-0 items-center justify-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-60 ${
                    tutor.is_verified
                      ? "border border-red-200 bg-white text-red-600 hover:bg-red-50"
                      : "bg-blue-600 text-white hover:bg-blue-700"
                  }`}
                >
                  {saving ? (
                    <Loader2 className="size-4 animate-spin" />
                  ) : tutor.is_verified ? (
                    <ShieldAlert className="size-4" />
                  ) : (
                    <ShieldCheck className="size-4" />
                  )}
                  {tutor.is_verified ? "Remove verification" : "Verify this tutor"}
                </button>
              </div>

              {!tutor.profile_completed && (
                <p className="mt-5 rounded-xl border border-orange-200 bg-orange-50 px-4 py-3 text-xs text-orange-900">
                  This tutor has not finished their profile, so some fields below are
                  empty. Consider waiting until they complete it before verifying.
                </p>
              )}
            </div>

            {/* Profile fields */}
            <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
              <h3 className="text-sm font-bold text-gray-900">Profile</h3>
              <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                <Field label="Email" value={tutor.email} icon={Mail} />
                <Field label="Phone" value={tutor.phone} icon={Phone} />
                <Field label="City" value={tutor.city} icon={MapPin} />
                <Field label="Subject" value={tutor.subject} />
                <Field label="Teaching level" value={tutor.teaching_level} />
                <Field
                  label="Experience"
                  value={tutor.experience_years ? `${tutor.experience_years} years` : null}
                />
              </div>

              <div className="mt-6 border-t border-gray-50 pt-5">
                <p className="text-xs font-semibold text-gray-400">Bio</p>
                <p className="mt-1.5 whitespace-pre-line text-sm leading-relaxed text-gray-700">
                  {tutor.bio?.trim() || (
                    <span className="text-gray-300">No bio written yet</span>
                  )}
                </p>
              </div>
            </div>

            {/* Their courses */}
            <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-100 px-6 py-4">
                <h3 className="text-sm font-bold text-gray-900">
                  Courses ({tutor.course_count})
                </h3>
                <div className="flex gap-4 text-xs text-gray-500">
                  <span className="inline-flex items-center gap-1.5">
                    <BookOpen className="size-3.5" />
                    {tutor.published_course_count} published
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <Users className="size-3.5" />
                    {tutor.student_count} students
                  </span>
                </div>
              </div>

              {tutor.courses.length === 0 ? (
                <p className="px-6 py-10 text-center text-sm text-gray-400">
                  This tutor has not created any courses yet.
                </p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[600px] text-sm">
                    <thead className="border-b border-gray-100 bg-gray-50">
                      <tr>
                        <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500">
                          Course
                        </th>
                        <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500">
                          Status
                        </th>
                        <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500">
                          Lessons
                        </th>
                        <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500">
                          Students
                        </th>
                        <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500">
                          Price
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {tutor.courses.map((c) => (
                        <tr key={c.id} className="hover:bg-gray-50">
                          <td className="px-5 py-4">
                            <Link
                              href={`/admin/courses/${c.id}`}
                              className="font-medium text-blue-600 hover:underline"
                            >
                              {c.title}
                            </Link>
                          </td>
                          <td className="px-5 py-4">
                            <Badge variant={STATUS_VARIANT[c.status] ?? "muted"}>
                              {STATUS_LABEL[c.status] ?? c.status}
                            </Badge>
                          </td>
                          <td className="px-5 py-4 text-gray-600">{c.total_lessons}</td>
                          <td className="px-5 py-4 text-gray-600">{c.enrollment_count}</td>
                          <td className="px-5 py-4 text-gray-600">
                            {c.price === 0 ? "Free" : `${c.price.toLocaleString()} XAF`}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </>
  );
}
