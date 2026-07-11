import { trpc } from "@cezeri/trpc";

export function useGenerateParentReport() {
  const u = trpc.useUtils();
  return trpc.reports.parentMonthly.useMutation({
    onSuccess: (_, v) => u.reports.parentList.invalidate({ studentId: v.studentId }),
  });
}
export function useParentReports(studentId: string) {
  return trpc.reports.parentList.useQuery({ studentId }, { enabled: !!studentId });
}
export function useGenerateTeacherReport() {
  return trpc.reports.teacherWeekly.useMutation();
}
