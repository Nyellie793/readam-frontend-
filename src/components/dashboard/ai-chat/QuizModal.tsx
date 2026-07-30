"use client";

import { useState } from "react";
import { CheckCircle2, XCircle, Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import AI from "@/services/ai.service";
import { errorMessage } from "@/lib/api";
import { toast } from "sonner";
import type { QuizResponse, QuizAttemptResponse } from "@/types/api.types";

interface QuizModalProps {
  quiz: QuizResponse | null;
  onOpenChange: (open: boolean) => void;
  onGraded: (result: QuizAttemptResponse) => void;
}

export default function QuizModal({ quiz, onOpenChange, onGraded }: QuizModalProps) {
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [result, setResult] = useState<QuizAttemptResponse | null>(null);
  const [submitting, setSubmitting] = useState(false);

  function reset() {
    setAnswers({});
    setResult(null);
  }

  async function submit() {
    if (!quiz) return;
    setSubmitting(true);
    try {
      const graded = await AI.attemptQuiz(
        quiz.quiz_id,
        Object.entries(answers).map(([question_id, selected_index]) => ({
          question_id,
          selected_index,
        }))
      );
      setResult(graded);
      onGraded(graded);
    } catch (err) {
      toast.error(errorMessage(err, "Couldn't grade your quiz."));
    } finally {
      setSubmitting(false);
    }
  }

  const allAnswered = quiz ? quiz.questions.every((q) => answers[q.question_id] !== undefined) : false;
  const resultByQuestionId = new Map(result?.results.map((r) => [r.question_id, r]) ?? []);

  return (
    <Dialog
      open={!!quiz}
      onOpenChange={(open) => {
        if (!open) reset();
        onOpenChange(open);
      }}
    >
      <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>
            {result ? `Score: ${result.score}/${result.total}` : `Quiz — ${quiz?.num_questions ?? 0} questions`}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-5">
          {quiz?.questions.map((q, qi) => {
            const graded = resultByQuestionId.get(q.question_id);
            return (
              <div key={q.question_id}>
                <p className="text-sm font-semibold text-gray-900">
                  {qi + 1}. {q.prompt}
                </p>
                <div className="mt-2 space-y-1.5">
                  {q.options.map((opt, oi) => {
                    const selected = answers[q.question_id] === oi;
                    const isCorrectOption = graded && graded.correct_index === oi;
                    const isWrongSelected = graded && selected && !graded.is_correct;
                    return (
                      <button
                        key={oi}
                        type="button"
                        disabled={!!result}
                        onClick={() => setAnswers((prev) => ({ ...prev, [q.question_id]: oi }))}
                        className={cn(
                          "flex w-full items-center justify-between rounded-xl border px-3.5 py-2.5 text-left text-sm transition-colors",
                          !result && selected && "border-blue-400 bg-blue-50 text-blue-700",
                          !result && !selected && "border-gray-200 hover:border-blue-200 hover:bg-blue-50/50",
                          isCorrectOption && "border-teal-400 bg-teal-50 text-teal-700",
                          isWrongSelected && "border-red-300 bg-red-50 text-red-600"
                        )}
                      >
                        {opt}
                        {isCorrectOption && <CheckCircle2 className="size-4 shrink-0 text-teal-600" />}
                        {isWrongSelected && <XCircle className="size-4 shrink-0 text-red-500" />}
                      </button>
                    );
                  })}
                </div>
                {graded && (
                  <p className="mt-1.5 text-xs leading-relaxed text-gray-500">{graded.explanation}</p>
                )}
              </div>
            );
          })}

          {!result ? (
            <Button
              onClick={submit}
              disabled={!allAnswered || submitting}
              className="w-full rounded-xl bg-blue-600 hover:bg-blue-700"
            >
              {submitting && <Loader2 className="mr-2 size-4 animate-spin" />}
              Submit Answers
            </Button>
          ) : (
            <Button
              variant="outline"
              onClick={reset}
              className="w-full rounded-xl border-gray-200"
            >
              Try Again
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
