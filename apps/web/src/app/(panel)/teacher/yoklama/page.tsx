"use client";
import { useState } from "react";
import { trpc } from "@cezeri/trpc";
import { useClasses, useAttendance, type AttStatus } from "@cezeri/features";

const STATUSES: { key: AttStatus; label: string }[] = [
  { key: "PRESENT", label: "Geldi" },
  { key: "LATE", label: "Geç" },
  { key: "EXCUSED", label: "İzinli" },
  { key: "ABSENT", label: "Gelmedi" },
];

export default function YoklamaPage(): JSX.Element {
  const classes = useClasses();
  const [classId, setClassId] = useState("");
  const [lessonId, setLessonId] = useState("");
  const lessons = trpc.lessons.listByClass.useQuery({ classId }, { enabled: !!classId });
  const att = useAttendance(lessonId);

  return (
    <div className="p-4 sm:p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold text-lacivert mb-4">Yoklama</h1>

      <div className="flex gap-3 mb-4">
        <select className="border p-2 rounded flex-1" value={classId} onChange={(e) => { setClassId(e.target.value); setLessonId(""); }}>
          <option value="">Sınıf seç…</option>
          {classes.data?.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
        <select className="border p-2 rounded flex-1" value={lessonId} onChange={(e) => setLessonId(e.target.value)} disabled={!classId}>
          <option value="">Ders seç…</option>
          {lessons.data?.map((l) => <option key={l.id} value={l.id}>{new Date(l.date).toLocaleDateString("tr")} · {l.topic}</option>)}
        </select>
      </div>

      {lessonId && (
        <>
          <div className="space-y-2">
            {att.rows.map((r) => (
              <div key={r.studentId} className="bg-white border rounded-lg p-3">
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-lacivert">{r.fullName}</span>
                  <label className="text-sm flex items-center gap-1">
                    <input type="checkbox" checked={r.homeworkDone} onChange={() => att.toggleHomework(r.studentId)} /> Ödev
                  </label>
                </div>
                <div className="flex gap-2 mt-2">
                  {STATUSES.map((s) => (
                    <button key={s.key} onClick={() => att.setStatus(r.studentId, s.key)}
                      className={`px-3 py-1 rounded text-sm ${r.status === s.key ? "bg-mavi text-white" : "bg-gray-100"}`}>
                      {s.label}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <button onClick={att.submit} disabled={att.saving} className="mt-4 w-full bg-turkuaz text-lacivert font-bold p-3 rounded">
            {att.saving ? "Kaydediliyor…" : "Yoklamayı Kaydet"}
          </button>
        </>
      )}
    </div>
  );
}
