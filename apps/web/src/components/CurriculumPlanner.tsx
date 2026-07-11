"use client";
import { useState } from "react";
import { trpc } from "@cezeri/trpc";

const MONTHS = ["Ocak","Şubat","Mart","Nisan","Mayıs","Haziran","Temmuz","Ağustos","Eylül","Ekim","Kasım","Aralık"];

export function CurriculumPlanner(): JSX.Element {
  const now = new Date();
  const [classId, setClassId] = useState<string>("");
  const [year, setYear]   = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth() + 1);
  const [selected, setSelected] = useState<string | null>(null); // "YYYY-MM-DD"
  const [pick, setPick] = useState<Set<string>>(new Set());      // seçilen topicId'ler
  const [notes, setNotes] = useState("");

  const utils   = trpc.useUtils();
  const classes = trpc.classes.list.useQuery();
  const topics  = trpc.curriculum.listTopics.useQuery();
  const plan    = trpc.curriculum.listPlan.useQuery(
    { classId, year, month },
    { enabled: !!classId },
  );
  const create  = trpc.curriculum.createPlan.useMutation({
    onSuccess: () => { utils.curriculum.listPlan.invalidate(); setPick(new Set()); setNotes(""); },
  });
  const remove  = trpc.curriculum.deletePlan.useMutation({
    onSuccess: () => utils.curriculum.listPlan.invalidate(),
  });

  // Takvim ızgarası
  const daysInMonth = new Date(year, month, 0).getDate();
  const firstDay    = (new Date(year, month - 1, 1).getDay() + 6) % 7; // Pzt başlangıç
  const days   = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const blanks = Array.from({ length: firstDay });

  const planMap = new Map<string, any[]>();
  (plan.data ?? []).forEach((p: any) => {
    const d = typeof p.planDate === "string" ? p.planDate.slice(0, 10)
            : new Date(p.planDate).toISOString().slice(0, 10);
    if (!planMap.has(d)) planMap.set(d, []);
    planMap.get(d)!.push(p);
  });

  const dayKey = (d: number) => `${year}-${String(month).padStart(2,"0")}-${String(d).padStart(2,"0")}`;
  function prevMonth() { if (month === 1) { setYear(y=>y-1); setMonth(12); } else setMonth(m=>m-1); setSelected(null); }
  function nextMonth() { if (month === 12) { setYear(y=>y+1); setMonth(1); } else setMonth(m=>m+1); setSelected(null); }

  const selPlan = selected ? (planMap.get(selected) ?? []) : [];

  // Konuları kategoriye göre grupla (modal'daki seçim listesi için)
  const grouped = new Map<string, any[]>();
  (topics.data ?? []).forEach((t: any) => {
    const k = t.category || "Genel";
    if (!grouped.has(k)) grouped.set(k, []);
    grouped.get(k)!.push(t);
  });

  function togglePick(id: string) {
    setPick(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

  return (
    <div className="p-4 sm:p-6 max-w-5xl mx-auto">
      <h1 className="text-xl font-bold text-lacivert mb-4">Ders Planı (Müfredat Takvimi)</h1>

      {/* Sınıf seçimi */}
      <div className="mb-4">
        <label className="block text-xs text-gray-500 mb-1">Sınıf seçin</label>
        <select className="border p-2 rounded-lg text-sm w-full sm:w-72"
          value={classId} onChange={(e) => { setClassId(e.target.value); setSelected(null); }}>
          <option value="">— Sınıf seçin —</option>
          {(classes.data ?? []).map((c: any) => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
      </div>

      {!classId && <p className="text-gray-400 text-sm">Planı görüntülemek için önce bir sınıf seçin.</p>}

      {classId && (
        <>
          {/* Ay navigasyonu */}
          <div className="flex items-center gap-3 mb-4">
            <button onClick={prevMonth} className="px-3 py-2 rounded-lg bg-gray-100 text-sm">←</button>
            <h2 className="flex-1 text-center font-semibold text-lacivert">{MONTHS[month-1]} {year}</h2>
            <button onClick={nextMonth} className="px-3 py-2 rounded-lg bg-gray-100 text-sm">→</button>
            <button onClick={() => { setYear(now.getFullYear()); setMonth(now.getMonth()+1); }} className="text-xs text-mavi">Bugün</button>
          </div>

          {/* Takvim */}
          <div className="bg-white border rounded-xl overflow-hidden mb-4">
            <div className="grid grid-cols-7 bg-lacivert text-white text-xs text-center">
              {["Pzt","Sal","Çar","Per","Cum","Cmt","Paz"].map(d => <div key={d} className="py-2 font-semibold">{d}</div>)}
            </div>
            <div className="grid grid-cols-7">
              {blanks.map((_, i) => <div key={`b${i}`} className="h-20 border-b border-r border-gray-100 bg-gray-50" />)}
              {days.map(d => {
                const key  = dayKey(d);
                const list = planMap.get(key) ?? [];
                const isToday = key === now.toISOString().slice(0,10);
                const isSel   = key === selected;
                return (
                  <div key={d} onClick={() => { setSelected(key); setPick(new Set()); setNotes(""); }}
                    className={`h-20 border-b border-r border-gray-100 p-1 cursor-pointer transition hover:bg-blue-50 ${isSel ? "bg-blue-100" : ""}`}>
                    <div className={`text-xs font-semibold w-6 h-6 flex items-center justify-center rounded-full ${isToday ? "bg-mavi text-white" : "text-gray-700"}`}>{d}</div>
                    <div className="space-y-0.5 mt-0.5">
                      {list.slice(0,2).map((p: any) => (
                        <div key={p.id} className="text-xs px-1 rounded truncate bg-green-100 text-green-700">{p.topicTitle}</div>
                      ))}
                      {list.length > 2 && <div className="text-xs text-gray-400">+{list.length-2}</div>}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </>
      )}

      {/* Açılır pencere: seçili gün */}
      {selected && (
        <div className="fixed inset-0 bg-black/40 flex items-end sm:items-center justify-center z-50 p-0 sm:p-4"
          onClick={() => setSelected(null)}>
          <div className="bg-white w-full sm:max-w-lg rounded-t-2xl sm:rounded-2xl p-4 max-h-[85vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-lacivert">
                {new Date(selected + "T12:00:00").toLocaleDateString("tr-TR", { day:"numeric", month:"long", year:"numeric" })}
              </h3>
              <button onClick={() => setSelected(null)} className="text-gray-400 text-xl">✕</button>
            </div>

            {/* Bu güne eklenmiş konular */}
            {selPlan.length > 0 && (
              <div className="mb-4">
                <p className="text-xs font-semibold text-gray-500 mb-1">Bu güne eklenmiş konular</p>
                <div className="space-y-1">
                  {selPlan.map((p: any) => (
                    <div key={p.id} className="flex items-center justify-between bg-green-50 rounded-lg px-3 py-2">
                      <div className="min-w-0">
                        <span className="text-sm text-gray-800">{p.topicTitle}</span>
                        {p.topicCategory && <span className="text-xs text-gray-400 ml-2">{p.topicCategory}</span>}
                      </div>
                      <button onClick={() => remove.mutate({ id: p.id })} className="text-xs text-red-500 shrink-0 ml-2">Kaldır</button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Müfredattan konu seç */}
            <p className="text-xs font-semibold text-gray-500 mb-2">Müfredattan konu ekle</p>
            {(!topics.data || topics.data.length === 0) ? (
              <p className="text-xs text-gray-400 mb-3">Önce Müfredat sekmesinden konu ekleyin.</p>
            ) : (
              <div className="space-y-3 mb-3">
                {Array.from(grouped.entries()).map(([category, items]) => (
                  <div key={category}>
                    <p className="text-xs font-bold text-mavi mb-1">{category}</p>
                    <div className="space-y-1">
                      {items.map((t: any) => (
                        <label key={t.id} className="flex items-center gap-2 text-sm cursor-pointer">
                          <input type="checkbox" checked={pick.has(t.id)} onChange={() => togglePick(t.id)} />
                          <span>{t.title}</span>
                          {t.ageGroup && <span className="text-xs text-gray-400">({t.ageGroup})</span>}
                        </label>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}

            <textarea className="border p-2 rounded-lg w-full text-sm mb-3" rows={2}
              placeholder="Not (opsiyonel)" value={notes} onChange={(e) => setNotes(e.target.value)} />

            <button
              disabled={pick.size === 0 || create.isPending}
              onClick={() => create.mutate({
                classId, planDate: selected,
                topicIds: Array.from(pick),
                notes: notes || undefined,
              })}
              className="w-full bg-mavi text-white py-2.5 rounded-lg text-sm font-medium disabled:opacity-50">
              {create.isPending ? "Ekleniyor…" : `Seçili ${pick.size} konuyu ekle`}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
