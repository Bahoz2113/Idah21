import { trpc } from "@cezeri/trpc";

export function useStudents(classId?: string) {
  return trpc.students.list.useQuery(classId ? { classId } : undefined);
}
export function useStudent(id: string) {
  return trpc.students.get.useQuery({ id }, { enabled: !!id });
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
