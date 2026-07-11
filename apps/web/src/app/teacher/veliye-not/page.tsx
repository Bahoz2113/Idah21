"use client";
import { useState } from "react";
import { trpc } from "@cezeri/trpc";
import { useStudents, useRealtime } from "@cezeri/features";

export default function VeliyeNotPage(): JSX.Element {
  useRealtime(["students"]);
  const students = useStudents();
  const [studentId, setStudentId] = useState("");
  const [note, setNote] = useState("");
  const [visible, setVisible] = useState(true);
  const utils = trpc.useUtils();

  const noteList = trpc.teacherNotes.list.useQuery({ studentId }, { enabled: !!studentId });
  const addNote = trpc.teacherNotes.add.useMutation({
    onSuccess: () => { setNote(""); utils.teacherNotes.list.invalidate({ studentId }); },
  });

  return (
    <div className="p-4 sm:p-6 max-w-2xl mx-auto">
      <h1 className="text-xl font-bold text-lacivert mb-4">Veliye Not</h1>
      <div className="bg-white border rounded-xl p-4 space-y-2 mb-4">
        <select className="border p-2 rounded w-full" value={studentId} onChange={(e) => setStudentId(e.target.value)}>
          <option value="">Öğrenci seç…</option>
          {students.data?.map((s) => <option key={s.id} value={s.id}>{s.fullName}</option>)}
        </select>
        <textarea className="border p-2 rounded w-full h-24" placeholder="Not içeriği…"
          value={note} onChange={(e) => setNote(e.target.value)} />
        <label className="flex items-center gap-2 text-sm cursor-pointer">
          <input type="checkbox" checked={visible} onChange={(e) => setVisible(e.target.checked)} />
          Veliye görünsün
        </label>
        <button onClick={() => addNote.mutate({ studentId, note, visibleToParent: visible })}
          disabled={!studentId || !note.trim() || addNote.isPending}
          className="bg-mavi text-white px-4 py-2 rounded disabled:opacity-40">
          {addNote.isPending ? "Kaydediliyor…" : "Not Ekle"}
        </button>
        {addNote.error && <p className="text-red-500 text-sm">{addNote.error.message}</p>}
      </div>
      {studentId && (
        <div className="space-y-2">
          {noteList.data?.map((n) => (
            <div key={n.id} className={`border rounded-lg p-3 ${n.visibleToParent ? "bg-blue-50 border-blue-200" : "bg-white"}`}>
              <p className="text-sm text-lacivert">{n.note}</p>
              <p className="text-xs text-gray-400">{new Date(n.createdAt).toLocaleString("tr")} · {n.visibleToParent ? "Veliye görünür" : "Sadece eğitmen"}</p>
            </div>
          ))}
          {!noteList.data?.length && <p className="text-sm text-gray-400">Not yok.</p>}
        </div>
      )}
    </div>
  );
}
