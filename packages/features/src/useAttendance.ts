import { useEffect, useState } from "react";
import { trpc } from "@cezeri/trpc";

export type AttStatus = "PRESENT" | "ABSENT" | "LATE" | "EXCUSED";

export interface AttRow {
  studentId: string;
  fullName: string;
  status: AttStatus;
  homeworkDone: boolean;
}

export function useAttendance(lessonId: string) {
  const utils = trpc.useUtils();
  const query = trpc.attendance.byLesson.useQuery({ lessonId }, { enabled: !!lessonId });
  const save = trpc.attendance.take.useMutation({
    onSuccess: () => utils.attendance.byLesson.invalidate({ lessonId }),
  });

  const [rows, setRows] = useState<AttRow[]>([]);

  // Sunucu verisi gelince satırları kur (varsa mevcut kaydı uygula)
  useEffect(() => {
    if (!query.data) return;
    const existing = new Map(query.data.records.map((r) => [r.studentId, r]));
    setRows(
      query.data.students.map((s) => {
        const r = existing.get(s.id);
        return {
          studentId: s.id,
          fullName: s.fullName,
          status: (r?.status as AttStatus) ?? "PRESENT",
          homeworkDone: r?.homeworkDone ?? false,
        };
      })
    );
  }, [query.data]);

  function setStatus(studentId: string, status: AttStatus) {
    setRows((rs) => rs.map((r) => (r.studentId === studentId ? { ...r, status } : r)));
  }
  function toggleHomework(studentId: string) {
    setRows((rs) => rs.map((r) => (r.studentId === studentId ? { ...r, homeworkDone: !r.homeworkDone } : r)));
  }
  function submit() {
    save.mutate({
      lessonId,
      records: rows.map((r) => ({ studentId: r.studentId, status: r.status, homeworkDone: r.homeworkDone })),
    });
  }

  return { lesson: query.data?.lesson, rows, isLoading: query.isLoading, setStatus, toggleHomework, submit, saving: save.isPending };
}
