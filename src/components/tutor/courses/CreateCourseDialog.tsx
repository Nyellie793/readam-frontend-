"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Loader2, Plus } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { COURSE_CATEGORIES } from "@/constants/course-categories";
import TUTOR from "@/services/tutor.service";
import { errorMessage } from "@/lib/api";
import { useTranslations } from "next-intl";

export default function CreateCourseDialog() {
  const t = useTranslations("tutor");
  const tc = useTranslations("cat");
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [creating, setCreating] = useState(false);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState<string>(COURSE_CATEGORIES[0].value);
  const [price, setPrice] = useState("");

  function reset() {
    setTitle("");
    setDescription("");
    setCategory(COURSE_CATEGORIES[0].value);
    setPrice("");
  }

  async function handleCreate() {
    if (!title.trim()) {
      toast.error(t("needTitle"));
      return;
    }
    setCreating(true);
    try {
      const course = await TUTOR.createCourse({
        title: title.trim(),
        description: description.trim() || undefined,
        category,
        price: Number(price) || 0,
        is_premium: Number(price) > 0,
      });
      toast.success(t("courseCreated"));
      setOpen(false);
      reset();
      router.push(`/tutor/courses/${course.id}`);
    } catch (err) {
      toast.error(errorMessage(err, t("errCreate")));
    } finally {
      setCreating(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-blue-700"
      >
        <Plus className="size-4" />
        New Course
      </button>

      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{t("createCourse")}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-gray-700">{t("courseTitle")}</label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={t("courseTitlePh")}
              className="h-10 w-full rounded-xl border border-gray-200 px-3.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-gray-700">{t("description")}</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              placeholder={t("descriptionPh")}
              className="w-full resize-none rounded-xl border border-gray-200 px-3.5 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-700">{t("category")}</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="h-10 w-full rounded-xl border border-gray-200 bg-white px-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              >
                {COURSE_CATEGORIES.map((c) => (
                  <option key={c.value} value={c.value}>
                    {tc(c.value)}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-700">{t("price")}</label>
              <input
                type="number"
                min={0}
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder={t("pricePh")}
                className="h-10 w-full rounded-xl border border-gray-200 px-3.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>
          </div>

        </div>

        <DialogFooter>
          <button
            type="button"
            onClick={handleCreate}
            disabled={creating}
            className="flex h-10 items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-blue-700 disabled:opacity-60"
          >
            {creating && <Loader2 className="size-4 animate-spin" />}
            Create Course
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
