import { trpc } from "@cezeri/trpc";

export function useStudents(classId?: string) {
  return trpc.students.list.useQuery(classId ? { classId } : undefined);
}
export function useStudent(id: string) {
  // staleTime: liste ekranında hover ile prefetch edilen veri, tık anına kadar
  // "taze" sayılsın ki detay mount'ında yeniden cold fetch yapılmasın.
  return trpc.students.get.useQuery({ id }, { enabled: !!id, staleTime: 60_000 });
}
export function useCheckDuplicate(fullName: string, classId?: string) {
  return trpc.students.checkDuplicate.useQuery(
    { fullName, classId },
    { enabled: fullName.trim().length >= 2, staleTime: 0 }
  );
}
export function useCreateStudent() {
  const utils = trpc.useUtils();
  return trpc.students.create.useMutation({
    onSuccess: () => utils.students.list.invalidate(),
  });
}
export function useUpdateStudent() {
  const utils = trpc.useUtils();
  return trpc.students.update.useMutation({
    onSuccess: () => utils.students.list.invalidate(),
  });
}
export function useAddQuizResult() {
  const utils = trpc.useUtils();
  return trpc.students.addQuizResult.useMutation({
    onSuccess: (_d, vars: any) => {
      utils.students.get.invalidate({ id: vars.studentId });
    },
  });
}
