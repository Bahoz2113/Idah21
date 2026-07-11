"use client";
import { useState } from "react";
import { useStudents, useGenerateParentReport, useGenerateTeacherReport } from "@cezeri/features";

const PERIOD = new Date().toISOString().slice(0, 7);

export default function TeacherRaporlarPage(): JSX.Element {
  const students = useStudents();
  const parentRep = useGenerateParentReport();
  const teacherRep = useGenerateTeacherReport();
  const [studentId, setStudentId] = useState("");

  return (
    <div className="p-4 sm:p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold text-lacivert mb-1">Raporlar</h1>
      <p className="text-sm text-gray-500 mb-4">Dönem: {PERIOD} · AI ile üretilir</p>

      <select className="border p-2 rounded w-full mb-4" value={studentId} onChange={(e) => setStudentId(e.target.value)}>
        <option value="">Öğrenci seç…</option>
        {students.data?.map((s) => <option key={s.id} value={s.id}>{s.fullName}</option>)}
      </select>

      {studentId && (
        <div className="flex gap-2 mb-4">
          <button onClick={() => parentRep.mutate({ studentId, period: PERIOD })} disabled={parentRep.isPending}
            className="flex-1 bg-mavi text-white p-2 rounded">{parentRep.isPending ? "Üretiliyor…" : "Veli Raporu Üret"}</button>
          <button onClick={() => teacherRep.mutate({ studentId, period: PERIOD })} disabled={teacherRep.isPending}
            className="flex-1 bg-vurgu text-white p-2 rounded">{teacherRep.isPending ? "Üretiliyor…" : "Öğretmen Raporu"}</button>
        </div>
      )}

      {parentRep.data && (
        <div className="bg-white border rounded-xl p-4 space-y-2 mb-4">
          <p className="font-bold text-lacivert">Veli Raporu</p>
          <p>{parentRep.data.content.summary}</p>
          <p className="text-sm"><b>Devam:</b> {parentRep.data.content.attendanceComment}</p>
          <p className="text-sm"><b>Performans:</b> {parentRep.data.content.performanceComment}</p>
          <p className="text-sm text-turkuaz"><b>Güçlü:</b> {parentRep.data.content.strengths?.join(", ")}</p>
          <p className="text-sm bg-turkuaz/10 p-2 rounded"><b>Gelecek ay:</b> {parentRep.data.content.nextMonth}</p>
          <p className="text-xs text-green-600">✓ Veliye bildirim gönderildi</p>
        </div>
      )}
      {teacherRep.data && (
        <div className="bg-white border rounded-xl p-4 space-y-1">
          <p className="font-bold text-lacivert">Öğretmen Raporu</p>
          <p>{teacherRep.data.content.summary}</p>
          <p className="text-sm text-red-500"><b>Zayıf:</b> {teacherRep.data.content.weakAreas?.join(", ")}</p>
          <p className="text-sm bg-gray-50 p-2 rounded"><b>Öneri:</b> {teacherRep.data.content.recommendation}</p>
        </div>
      )}
    </div>
  );
}
