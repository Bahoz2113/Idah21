import { trpc } from "@cezeri/trpc";

export function useStudentEvaluations(studentId: string) {
  return trpc.evaluations.forStudent.useQuery({ studentId }, { enabled: !!studentId });
}

export function useSubmitEvaluation() {
  const u = trpc.useUtils();
  return trpc.evaluations.submit.useMutation({
    onSuccess: (_, v) => {
      u.evaluations.forStudent.invalidate({ studentId: v.studentId });
      u.evaluations.graph.invalidate({ studentId: v.studentId });
    },
  });
}

export function useStudentGraph(studentId: string) {
  return trpc.evaluations.graph.useQuery({ studentId }, { enabled: !!studentId });
}
