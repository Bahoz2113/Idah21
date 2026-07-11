"use client";
import { useState } from "react";
import { useStudents, useSubmitEvaluation, useStudentGraph } from "@cezeri/features";
import { EVALUATION_CRITERIA } from "@cezeri/config";

const PERIOD = new Date().toISOString().slice(0, 7); // YYYY-MM

export default function DegerlendirmePage(): JSX.Element {
  const students = useStudents();
  const submit = useSubmitEvaluation();
  const [studentId, setStudentId] = useState("");
  const graph = useStudentGraph(studentId);
  const [scores, setScores] = useState<Record<string, number>>(
    Object.fromEntries(EVALUATION_CRITERIA.map((c) => [c.key, 5]))
  );

  function save() {
    if (!studentId) return;
    submit.mutate({ studentId, period: PERIOD, scores });
  }

  return (
    <div className="p-4 sm:p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold text-lacivert mb-1">Değerlendirme</h1>
      <p className="text-sm text-gray-500 mb-4">Dönem: {PERIOD}</p>

      <select className="border p-2 rounded w-full mb-4" value={studentId} onChange={(e) => setStudentId(e.target.value)}>
        <option value="">Öğrenci seç…</option>
        {students.data?.map((s) => <option key={s.id} value={s.id}>{s.fullName}</option>)}
      </select>

      {studentId && (
        <>
          <div className="bg-white border rounded-xl p-4 space-y-2 mb-4">
            {EVALUATION_CRITERIA.map((c) => (
              <div key={c.key} className="flex items-center justify-between gap-3">
                <span className="text-sm text-lacivert flex-1">{c.label}</span>
                <input type="range" min={1} max={10} value={scores[c.key]}
                  onChange={(e) => setScores((s) => ({ ...s, [c.key]: Number(e.target.value) }))} />
                <span className="w-6 text-right font-bold text-mavi">{scores[c.key]}</span>
              </div>
            ))}
          </div>
          <button onClick={save} disabled={submit.isPending} className="w-full bg-turkuaz text-lacivert font-bold p-3 rounded mb-6">
            {submit.isPending ? "Kaydediliyor…" : "Değerlendirmeyi Kaydet"}
          </button>

          <h2 className="font-bold text-lacivert mb-2">Aylık Gelişim</h2>
          <div className="space-y-1">
            {graph.data?.length ? graph.data.map((g) => (
              <div key={g.period} className="flex items-center gap-2">
                <span className="w-16 text-xs text-gray-500">{g.period}</span>
                <div className="flex-1 bg-gray-100 rounded h-4">
                  <div className="bg-mavi h-4 rounded" style={{ width: `${g.average * 10}%` }} />
                </div>
                <span className="w-8 text-right text-sm font-bold">{g.average}</span>
              </div>
            )) : <p className="text-sm text-gray-400">Henüz değerlendirme yok.</p>}
          </div>
        </>
      )}
    </div>
  );
}
