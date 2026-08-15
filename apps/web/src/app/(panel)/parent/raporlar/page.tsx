"use client";
import { useState, useEffect } from "react";
import { useStudents, useParentReports } from "@cezeri/features";

export default function VeliRaporlarPage(): JSX.Element {
  const students = useStudents();
  const [studentId, setStudentId] = useState("");
  useEffect(() => { if (!studentId && students.data?.[0]) setStudentId(students.data[0].id); }, [students.data, studentId]);
  const reports = useParentReports(studentId);
  const [openId, setOpenId] = useState("");

  return (
    <div className="p-4 sm:p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold text-lacivert mb-4">Raporlar</h1>
      {(students.data?.length ?? 0) > 1 && (
        <select className="border p-2 rounded w-full mb-4" value={studentId} onChange={(e) => setStudentId(e.target.value)}>
          {students.data?.map((s) => <option key={s.id} value={s.id}>{s.fullName}</option>)}
        </select>
      )}
      <div className="space-y-2">
        {reports.data?.length ? reports.data.map((r) => {
          const c = r.content as any;
          return (
            <div key={r.id} className="bg-white border rounded-lg">
              <button onClick={() => setOpenId(openId === r.id ? "" : r.id)} className="w-full text-left p-3 font-semibold text-lacivert">
                📄 {r.period} raporu
              </button>
              {openId === r.id && (
                <div className="border-t p-3 text-sm space-y-2">
                  <p>{c.summary}</p>
                  <p><b>Devam:</b> {c.attendanceComment}</p>
                  <p><b>Performans:</b> {c.performanceComment}</p>
                  {c.strengths?.length ? <p className="text-turkuaz"><b>Güçlü:</b> {c.strengths.join(", ")}</p> : null}
                  {c.strugglesWith?.length ? <p className="text-amber-600"><b>Zorlandığı:</b> {c.strugglesWith.join(", ")}</p> : null}
                  {c.homeAdvice?.length ? <p><b>Evde:</b> {c.homeAdvice.join(" · ")}</p> : null}
                  <p className="bg-turkuaz/10 p-2 rounded"><b>Gelecek ay:</b> {c.nextMonth}</p>
                </div>
              )}
            </div>
          );
        }) : <p className="text-sm text-gray-400">Henüz rapor yok.</p>}
      </div>
    </div>
  );
}
