"use client";
import { useState } from "react";
import Link from "next/link";
import { useClasses, useCreateClass, useAgeGroups, useTeachers } from "@cezeri/features";

export default function SiniflarPage(): JSX.Element {
  const classes = useClasses();
  const ageGroups = useAgeGroups();
  const teachers = useTeachers();
  const create = useCreateClass();
  const [name, setName] = useState("");
  const [ageGroupId, setAgeGroupId] = useState("");
  const [teacherId, setTeacherId] = useState("");
  const [day, setDay] = useState("");
  const [time, setTime] = useState("");

  function submit() {
    if (name.length < 2) return;
    create.mutate(
      { name, ageGroupId: ageGroupId || undefined, teacherId: teacherId || undefined, day: day || undefined, time: time || undefined, capacity: 12 },
      { onSuccess: () => { setName(""); setDay(""); setTime(""); } }
    );
  }

  return (
    <div className="p-4 sm:p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold text-lacivert mb-4">Sınıflar</h1>

      <div className="bg-white border rounded-xl p-4 grid grid-cols-2 gap-3 mb-6">
        <input className="border p-2 rounded col-span-2" placeholder="Sınıf adı" value={name} onChange={(e) => setName(e.target.value)} />
        <select className="border p-2 rounded" value={ageGroupId} onChange={(e) => setAgeGroupId(e.target.value)}>
          <option value="">Yaş grubu…</option>
          {ageGroups.data?.map((g) => <option key={g.id} value={g.id}>{g.name}</option>)}
        </select>
        <select className="border p-2 rounded" value={teacherId} onChange={(e) => setTeacherId(e.target.value)}>
          <option value="">Eğitmen…</option>
          {teachers.data?.map((t) => <option key={t.id} value={t.id}>{t.fullName}</option>)}
        </select>
        <input className="border p-2 rounded" placeholder="Gün (ör. Cumartesi)" value={day} onChange={(e) => setDay(e.target.value)} />
        <input className="border p-2 rounded" placeholder="Saat (ör. 10:00)" value={time} onChange={(e) => setTime(e.target.value)} />
        <button onClick={submit} disabled={create.isPending} className="col-span-2 bg-mavi text-white p-2 rounded">
          {create.isPending ? "Ekleniyor…" : "Sınıf Ekle"}
        </button>
      </div>

      <div className="space-y-2">
        {classes.isLoading && <p>Yükleniyor…</p>}
        {classes.data?.map((c) => (
          <Link key={c.id} href={`/admin/siniflar/${c.id}`}
            className="group bg-white border border-gray-100 rounded-xl p-3.5 flex justify-between items-center hover:border-vurgu/40 hover:shadow-md transition-all">
            <div>
              <p className="font-semibold text-lacivert group-hover:text-mavi transition-colors">{c.name}</p>
              <p className="text-sm text-gray-500">{c.ageGroup?.name} · {c.teacher?.fullName ?? "—"} · {c.day} {c.time}</p>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-turkuaz font-bold text-sm">{c._count.students} öğrenci</span>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="text-gray-300 group-hover:text-vurgu transition-colors">
                <path d="M9 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
