"use client";

import { useState } from "react";
import { toast } from "sonner";
import {
  ChevronDown,
  ChevronRight,
  Plus,
  Trash2,
  Pencil,
  Video,
  FileText,
  HelpCircle,
  Eye,
  Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import TUTOR from "@/services/tutor.service";
import { errorMessage } from "@/lib/api";
import LessonEditorDialog from "./LessonEditorDialog";
import type { CourseModule, ModuleLesson } from "@/types/api.types";

const LESSON_ICONS = { video: Video, pdf: FileText, quiz: HelpCircle };

interface ModuleListProps {
  courseId: string;
  modules: CourseModule[];
  editable: boolean;
  onChanged: () => void;
}

export default function ModuleList({ courseId, modules, editable, onChanged }: ModuleListProps) {
  const [expanded, setExpanded] = useState<Set<string>>(new Set(modules[0] ? [modules[0].id] : []));
  const [newModuleTitle, setNewModuleTitle] = useState("");
  const [addingModule, setAddingModule] = useState(false);
  const [busyModuleId, setBusyModuleId] = useState<string | null>(null);
  const [renamingModuleId, setRenamingModuleId] = useState<string | null>(null);
  const [renameValue, setRenameValue] = useState("");
  const [lessonDialog, setLessonDialog] = useState<{ moduleId: string; lesson: ModuleLesson | null } | null>(null);

  function toggle(moduleId: string) {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(moduleId)) next.delete(moduleId);
      else next.add(moduleId);
      return next;
    });
  }

  async function handleAddModule() {
    if (!newModuleTitle.trim()) return;
    setAddingModule(true);
    try {
      const module = await TUTOR.addModule(courseId, { title: newModuleTitle.trim(), order: modules.length });
      setNewModuleTitle("");
      setExpanded((prev) => new Set(prev).add(module.id));
      onChanged();
    } catch (err) {
      toast.error(errorMessage(err, "Couldn't add module."));
    } finally {
      setAddingModule(false);
    }
  }

  async function handleRenameModule(moduleId: string) {
    if (!renameValue.trim()) return;
    setBusyModuleId(moduleId);
    try {
      await TUTOR.updateModule(courseId, moduleId, { title: renameValue.trim() });
      setRenamingModuleId(null);
      onChanged();
    } catch (err) {
      toast.error(errorMessage(err, "Couldn't rename module."));
    } finally {
      setBusyModuleId(null);
    }
  }

  async function handleDeleteModule(moduleId: string) {
    if (!confirm("Delete this module and all its lessons?")) return;
    setBusyModuleId(moduleId);
    try {
      await TUTOR.deleteModule(courseId, moduleId);
      onChanged();
    } catch (err) {
      toast.error(errorMessage(err, "Couldn't delete module."));
    } finally {
      setBusyModuleId(null);
    }
  }

  async function handleDeleteLesson(moduleId: string, lessonId: string) {
    if (!confirm("Delete this lesson?")) return;
    try {
      await TUTOR.deleteLesson(courseId, moduleId, lessonId);
      onChanged();
    } catch (err) {
      toast.error(errorMessage(err, "Couldn't delete lesson."));
    }
  }

  return (
    <div className="space-y-3">
      {modules.map((module) => {
        const isOpen = expanded.has(module.id);
        return (
          <div key={module.id} className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
            <div className="flex items-center gap-2 px-4 py-3">
              <button
                type="button"
                onClick={() => toggle(module.id)}
                className="flex flex-1 items-center gap-2 text-left"
              >
                {isOpen ? (
                  <ChevronDown className="size-4 shrink-0 text-gray-400" />
                ) : (
                  <ChevronRight className="size-4 shrink-0 text-gray-400" />
                )}
                {renamingModuleId === module.id ? (
                  <input
                    autoFocus
                    value={renameValue}
                    onClick={(e) => e.stopPropagation()}
                    onChange={(e) => setRenameValue(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleRenameModule(module.id)}
                    className="h-8 flex-1 rounded-lg border border-gray-200 px-2 text-sm outline-none focus:border-blue-500"
                  />
                ) : (
                  <span className="text-sm font-bold text-gray-900">{module.title}</span>
                )}
                <span className="text-xs text-gray-400">({module.lessons.length})</span>
              </button>

              {editable && (
                <div className="flex items-center gap-1">
                  {busyModuleId === module.id ? (
                    <Loader2 className="size-4 animate-spin text-gray-400" />
                  ) : renamingModuleId === module.id ? (
                    <button
                      type="button"
                      onClick={() => handleRenameModule(module.id)}
                      className="rounded-lg px-2 py-1 text-xs font-semibold text-blue-600 hover:bg-blue-50"
                    >
                      Save
                    </button>
                  ) : (
                    <>
                      <button
                        type="button"
                        onClick={() => {
                          setRenamingModuleId(module.id);
                          setRenameValue(module.title);
                        }}
                        className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-50 hover:text-gray-600"
                        aria-label="Rename module"
                      >
                        <Pencil className="size-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteModule(module.id)}
                        className="rounded-lg p-1.5 text-gray-400 hover:bg-red-50 hover:text-red-500"
                        aria-label="Delete module"
                      >
                        <Trash2 className="size-3.5" />
                      </button>
                    </>
                  )}
                </div>
              )}
            </div>

            {isOpen && (
              <div className="border-t border-gray-50 px-4 py-3">
                {module.lessons.length === 0 ? (
                  <p className="py-2 text-xs text-gray-400">No lessons yet.</p>
                ) : (
                  <div className="space-y-1.5">
                    {module.lessons.map((lesson) => {
                      const Icon = LESSON_ICONS[lesson.type];
                      return (
                        <div
                          key={lesson.id}
                          className="flex items-center gap-3 rounded-xl border border-gray-50 px-3 py-2.5"
                        >
                          <Icon className="size-4 shrink-0 text-blue-500" />
                          <span className="flex-1 truncate text-sm font-medium text-gray-800">{lesson.title}</span>
                          {lesson.is_preview && <Eye className="size-3.5 shrink-0 text-gray-400" />}
                          {editable && (
                            <div className="flex shrink-0 items-center gap-1">
                              <button
                                type="button"
                                onClick={() => setLessonDialog({ moduleId: module.id, lesson })}
                                className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-50 hover:text-gray-600"
                                aria-label="Edit lesson"
                              >
                                <Pencil className="size-3.5" />
                              </button>
                              <button
                                type="button"
                                onClick={() => handleDeleteLesson(module.id, lesson.id)}
                                className="rounded-lg p-1.5 text-gray-400 hover:bg-red-50 hover:text-red-500"
                                aria-label="Delete lesson"
                              >
                                <Trash2 className="size-3.5" />
                              </button>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}

                {editable && (
                  <button
                    type="button"
                    onClick={() => setLessonDialog({ moduleId: module.id, lesson: null })}
                    className="mt-3 flex items-center gap-1.5 rounded-lg px-2 py-1.5 text-xs font-semibold text-blue-600 hover:bg-blue-50"
                  >
                    <Plus className="size-3.5" />
                    Add Lesson
                  </button>
                )}
              </div>
            )}
          </div>
        );
      })}

      {editable && (
        <div className={cn("flex items-center gap-2 rounded-2xl border border-dashed border-gray-200 bg-white p-3")}>
          <input
            value={newModuleTitle}
            onChange={(e) => setNewModuleTitle(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleAddModule()}
            placeholder="New module title…"
            className="h-9 flex-1 rounded-lg border border-gray-200 px-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          />
          <button
            type="button"
            onClick={handleAddModule}
            disabled={addingModule || !newModuleTitle.trim()}
            className="flex h-9 items-center gap-1.5 rounded-lg bg-blue-600 px-3 text-xs font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
          >
            {addingModule ? <Loader2 className="size-3.5 animate-spin" /> : <Plus className="size-3.5" />}
            Add Module
          </button>
        </div>
      )}

      {lessonDialog && (
        <LessonEditorDialog
          courseId={courseId}
          moduleId={lessonDialog.moduleId}
          lesson={lessonDialog.lesson}
          open={!!lessonDialog}
          onOpenChange={(open) => !open && setLessonDialog(null)}
          onSaved={onChanged}
        />
      )}
    </div>
  );
}
