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
