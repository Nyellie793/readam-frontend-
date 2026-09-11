"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { getToken } from "@/lib/auth";
import STUDENT from "@/services/student.service";
import { errorMessage } from "@/lib/api";
import { useTranslations } from "next-intl";

/**
 * The catalogue's course detail page is a server component with no view of the
 * visitor's session, so its buy button always pointed at /signup or /checkout.
 * A signed-in student who already owns the course was sent to pay again, or to
 * create a second account — the page actively turned away the people most
 * likely to be on it.
 *
 * This runs on the client, reads the session, and checks enrolment across every
 * page of /v1/enrollments (the same sweep the dashboard lesson page does — a
 * single-page check misses anyone whose enrolment has scrolled onto page 2).
 * Signed-out visitors keep the original behaviour exactly.
 */

const BTN =
  "mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3 text-center text-sm font-bold text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60";

type Access = "checking" | "guest" | "enrolled" | "member";

export default function CoursePurchaseCta({
  courseId,
  price,
}: {
  courseId: string;
  price: number;
}) {
  const t = useTranslations("courses");
  const router = useRouter();
  const isFree = price === 0;

  const [access, setAccess] = useState<Access>("checking");
  const [enrolling, setEnrolling] = useState(false);

  useEffect(() => {
    if (!getToken()) {
      setAccess("guest");
      return;
    }

    let cancelled = false;

    (async () => {
      try {
        let page = 1;
        for (;;) {
          const data = await STUDENT.getEnrollments(page);
          if (cancelled) return;

          const enrollment = data.items.find((e) => e.course_id === courseId);
          if (enrollment) {
            const active =
              enrollment.status === "active" &&
              (!enrollment.expires_at || new Date(enrollment.expires_at) > new Date());
            setAccess(active ? "enrolled" : "member");
            return;
          }

          const seen = data.page * data.page_size;
          if (data.items.length === 0 || seen >= data.total) break;
          page += 1;
        }
        setAccess("member");
      } catch {
        // Fail open to the paid/enrol path — the worst case is a signed-in
        // student sees "Get this course" and the checkout tells them they
        // already own it, rather than being stranded here.
        if (!cancelled) setAccess("member");
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [courseId]);

  const priceLabel = isFree ? t("free") : `${price.toLocaleString()} XAF`;

  if (access === "checking") {
    return (
      <>
        <p className="text-2xl font-black text-gray-900">{priceLabel}</p>
        <button type="button" disabled className={BTN}>
          <Loader2 className="size-4 animate-spin" />
          {t("checkingAccess")}
        </button>
      </>
    );
  }

  if (access === "enrolled") {
    return (
      <>
        <p className="text-2xl font-black text-gray-900">{priceLabel}</p>
        <Link href={`/dashboard/courses/${courseId}`} className={BTN}>
          {t("goToCourse")}
        </Link>
        <p className="mt-3 text-center text-[11px] text-gray-400">{t("enrolledNote")}</p>
      </>
    );
  }

  // Signed in, not enrolled: a free course just needs an enrolment record, so
  // do it here and drop them straight into the lessons instead of bouncing
  // through /signup.
  if (access === "member" && isFree) {
    async function enroll() {
      setEnrolling(true);
      try {
        await STUDENT.enroll(courseId);
        router.push(`/dashboard/courses/${courseId}`);
      } catch (err) {
        setEnrolling(false);
        toast.error(errorMessage(err, t("enrollFailed")));
      }
    }

    return (
      <>
        <p className="text-2xl font-black text-gray-900">{priceLabel}</p>
        <button type="button" onClick={enroll} disabled={enrolling} className={BTN}>
          {enrolling && <Loader2 className="size-4 animate-spin" />}
          {enrolling ? t("enrolling") : t("startFree")}
        </button>
      </>
    );
  }

  // Signed in, not enrolled, paid course: go to checkout (no sign-in prompt).
  if (access === "member") {
    return (
      <>
        <p className="text-2xl font-black text-gray-900">{priceLabel}</p>
        <Link href={`/checkout?course=${courseId}`} className={BTN}>
          {t("getCourse")}
        </Link>
      </>
    );
  }

  // Signed out: unchanged from before.
  return (
    <>
      <p className="text-2xl font-black text-gray-900">{priceLabel}</p>
      <Link href={isFree ? "/signup" : `/checkout?course=${courseId}`} className={BTN}>
        {isFree ? t("startFree") : t("getCourse")}
      </Link>
      <p className="mt-3 text-center text-[11px] text-gray-400">{t("signInFirst")}</p>
    </>
  );
}
