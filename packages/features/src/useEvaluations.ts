import { trpc } from "@cezeri/trpc";

export function useStudentEvaluations(studentId: string) {
  return trpc.evaluations.forStudent.useQuery({ studentId }, { enabled: !!studentId });
}
export function useStudentGraph(studentId: string) {
  return trpc.evaluations.graph.useQuery({ studentId }, { enabled: !!studentId });
}
export function useSubmitEvaluation() {
  const utils = trpc.useUtils();
  return trpc.evaluations.submit.useMutation({
    onSuccess: (_d, vars) => {
      utils.evaluations.forStudent.invalidate({ studentId: vars.studentId });
      utils.evaluations.graph.invalidate({ studentId: vars.studentId });
      utils.students.get.invalidate({ id: vars.studentId });
    },
  });
}

export function useTeacherNotes(studentId: string) {
  return trpc.teacherNotes.list.useQuery({ studentId }, { enabled: !!studentId });
}
export function useAddTeacherNote() {
  const utils = trpc.useUtils();
  return trpc.teacherNotes.add.useMutation({
    onSuccess: (_d, vars: any) => {
      utils.teacherNotes.list.invalidate({ studentId: vars.studentId });
      utils.students.get.invalidate({ id: vars.studentId });
    },
  });
}
