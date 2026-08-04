import { api, assertUploadable, putToPresigned } from "@/lib/api";
import type {
  AISessionResponse,
  AISessionDetailResponse,
  AISessionListItem,
  SendMessageResponse,
  AttachmentUploadResponse,
  RevisionResponse,
  QuizResponse,
  QuizAnswerItem,
  QuizAttemptResponse,
  StudyPlanResponse,
  SuggestedTopicsResponse,
  SessionSummaryResponse,
} from "@/types/api.types";

const AI = {
  // POST /v1/ai/sessions — lessonId omitted starts a general session
  startSession: (lessonId?: string) =>
    api.post<AISessionResponse>("/v1/ai/sessions", { lesson_id: lessonId ?? null }, true),

  // GET /v1/ai/sessions/:id
  getSession: (sessionId: string) =>
    api.get<AISessionDetailResponse>(`/v1/ai/sessions/${sessionId}`),

  // GET /v1/ai/sessions
  listSessions: () => api.get<AISessionListItem[]>("/v1/ai/sessions"),

  // POST /v1/ai/sessions/:id/messages
  sendMessage: (sessionId: string, content: string, attachmentIds: string[] = []) =>
    api.post<SendMessageResponse>(
      `/v1/ai/sessions/${sessionId}/messages`,
      { content, attachment_ids: attachmentIds },
      true
    ),

  // POST /v1/ai/uploads — presign, then PUT the file directly to upload_url
  createUpload: (filename: string, contentType: string) =>
    api.post<AttachmentUploadResponse>(
      "/v1/ai/uploads",
      { filename, content_type: contentType },
      true
    ),

  uploadFile: async (file: File): Promise<AttachmentUploadResponse> => {
    assertUploadable(file, "attachment");
    const presigned = await AI.createUpload(file.name, file.type);
    // Throws if the PUT is rejected, so the caller never attaches an id for an
    // object that was never written.
    await putToPresigned(presigned.upload_url, file);
    return presigned;
  },

  // POST /v1/ai/sessions/:id/revision
  generateRevision: (sessionId: string) =>
    api.post<RevisionResponse>(`/v1/ai/sessions/${sessionId}/revision`, {}, true),

  // POST /v1/ai/sessions/:id/quiz
  generateQuiz: (sessionId: string, numQuestions = 5) =>
    api.post<QuizResponse>(
      `/v1/ai/sessions/${sessionId}/quiz`,
      { num_questions: numQuestions },
      true
    ),

  // POST /v1/ai/quizzes/:id/attempt
  attemptQuiz: (quizId: string, answers: QuizAnswerItem[]) =>
    api.post<QuizAttemptResponse>(`/v1/ai/quizzes/${quizId}/attempt`, { answers }, true),

  // POST /v1/ai/sessions/:id/study-plan
  generateStudyPlan: (sessionId: string) =>
    api.post<StudyPlanResponse>(`/v1/ai/sessions/${sessionId}/study-plan`, {}, true),

  // GET /v1/ai/hub/topics
  getSuggestedTopics: () => api.get<SuggestedTopicsResponse>("/v1/ai/hub/topics"),

  // GET /v1/ai/sessions/:id/summary
  getSessionSummary: (sessionId: string) =>
    api.get<SessionSummaryResponse>(`/v1/ai/sessions/${sessionId}/summary`),
};

export default AI;
