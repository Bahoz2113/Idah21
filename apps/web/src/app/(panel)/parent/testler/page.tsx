"use client";
import { useStudents } from "@cezeri/features";
import { trpc } from "@cezeri/trpc";
import { useState, useEffect } from "react";

export default function VeliTestlerPage(): JSX.Element {
  const students = useStudents();
  const [studentId, setStudentId] = useState("");
  useEffect(() => { if (!studentId && students.data?.[0]) setStudentId(students.data[0].id); }, [students.data, studentId]);

  const reports = trpc.reports.parentList.useQuery({ studentId }, { enabled: !!studentId });

  return (
    <div className="p-4 sm:p-6 max-w-2xl mx-auto">
      <h1 className="text-xl font-bold text-lacivert mb-4">Test Sonuçları</h1>
      {(students.data?.length ?? 0) > 1 && (
        <select className="border p-2 rounded w-full mb-4" value={studentId} onChange={(e) => setStudentId(e.target.value)}>
          {students.data?.map((s) => <option key={s.id} value={s.id}>{s.fullName}</option>)}
        </select>
      )}
      <div className="space-y-2">
        {reports.data?.map((r) => {
          const c = r.content as any;
          const quiz = c?.quizId ? { correct: c.correct, wrong: c.wrong, total: c.total } : null;
          return (
            <div key={r.id} className="bg-white border rounded-lg p-3">
              <p className="font-semibold text-lacivert text-sm">{r.period}</p>
              {quiz ? (
                <p className="text-sm">✅ {quiz.correct}/{quiz.total} doğru · ❌ {quiz.wrong} yanlış</p>
              ) : (
                <p className="text-sm text-gray-500">{c?.performanceComment ?? "Detay yok"}</p>
              )}
            </div>
          );
        })}
        {!reports.data?.length && <p className="text-sm text-gray-400">Henüz test sonucu yok.</p>}
      </div>
    </div>
  );
}
