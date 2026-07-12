"use client";
import { trpc } from "@cezeri/trpc";
import { useStudents } from "@cezeri/features";
import { useState, useEffect } from "react";

const STATUS_LABEL: Record<string, string> = {
  PRESENT: "✅ Geldi", ABSENT: "❌ Gelmedi", LATE: "🕐 Geç", EXCUSED: "📋 İzinli"
};

export default function VeliDevamPage(): JSX.Element {
  const students = useStudents();
  const [studentId, setStudentId] = useState("");
  useEffect(() => { if (!studentId && students.data?.[0]) setStudentId(students.data[0].id); }, [students.data, studentId]);
  const att = trpc.attendance.byStudent.useQuery({ studentId }, { enabled: !!studentId });
  const rows = att.data ?? [];
  const present = rows.filter((r) => r.status === "PRESENT").length;
  const total = rows.length;

  return (
    <div className="p-4 sm:p-6 max-w-2xl mx-auto">
      <h1 className="text-xl font-bold text-lacivert mb-4">Devam Takibi</h1>
      {(students.data?.length ?? 0) > 1 && (
        <select className="border p-2 rounded w-full mb-4" value={studentId} onChange={(e) => setStudentId(e.target.value)}>
          {students.data?.map((s) => <option key={s.id} value={s.id}>{s.fullName}</option>)}
        </select>
      )}
      {studentId && (
        <div className="bg-white border rounded-xl p-4 mb-3 flex gap-6 items-center">
          <div className="text-3xl font-bold text-mavi">{total ? `%${Math.round((present / total) * 100)}` : "—"}</div>
          <div>
            <p className="font-semibold text-lacivert">Devam Oranı</p>
            <p className="text-sm text-gray-500">{present} geldi / {total - present} gelmedi</p>
          </div>
        </div>
      )}
      <div className="space-y-1">
        {rows.map((r: any) => (
          <div key={r.id} className="flex justify-between bg-white border rounded p-2 text-sm">
            <span className="text-lacivert">{r.lesson?.topic ?? "—"}</span>
            <div className="flex gap-3 text-xs text-gray-500">
              <span>{r.lesson ? new Date(r.lesson.date).toLocaleDateString("tr") : ""}</span>
              <span>{STATUS_LABEL[r.status] ?? r.status}</span>
            </div>
          </div>
        ))}
        {!rows.length && !att.isLoading && <p className="text-sm text-gray-400">Yoklama kaydı yok.</p>}
      </div>
    </div>
  );
}
