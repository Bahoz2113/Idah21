import { trpc } from "@cezeri/trpc";

export function useGenerateLesson() {
  return trpc.ai.teacher.generate.useMutation();
}
export function useGenerateQuiz() {
  return trpc.ai.quiz.generate.useMutation();
}
export function useQuiz(quizId: string) {
  return trpc.ai.quiz.get.useQuery({ quizId }, { enabled: !!quizId });
}
export function useSubmitQuiz() {
  return trpc.ai.quiz.submit.useMutation();
}

// ── TEACHER AI (yaşa uyarlı dijital öğretmen ajanları) ──
export function useAdaptToAge() {
  return trpc.aiTeacher.adaptToAge.useMutation();
}
export function useVisualStoryboard() {
  return trpc.aiTeacher.visualStoryboard.useMutation();
}
export function useSimplify() {
  return trpc.aiTeacher.simplify.useMutation();
}
export function useTutorChat() {
  return trpc.aiTeacher.tutorChat.useMutation();
}
export function useDetectWeaknesses() {
  return trpc.aiTeacher.detectWeaknesses.useMutation();
}
