"use client";
import { useState } from "react";
import { trpc } from "@cezeri/trpc";

function getWeekLabel(offset = 0) {
  const d = new Date();
  d.setDate(d.getDate() + offset * 7);
  const jan1 = new Date(d.getFullYear(), 0, 1);
  const week = Math.ceil(((d.getTime() - jan1.getTime()) / 86400000 + jan1.getDay() + 1) / 7);
  return `${d.getFullYear()}-W${String(week).padStart(2, "0")}`;
}

export default function TeacherDerslerPage(): JSX.Element {
  const utils   = trpc.useUtils();
  const classes = trpc.classes.myClasses?.useQuery?.() ?? trpc.lookup.classes.useQuery();
  const [selectedClass, setClass] = useState("");
  const [weekOffset, setWeek]     = useState(0);
  const weekLabel = getWeekLabel(weekOffset);

  const materials = trpc.weeklyMaterials.list.useQuery(
    { classId: selectedClass },
    { enabled: !!selectedClass }
  );
  const upsert = trpc.weeklyMaterials.upsert.useMutation({
    onSuccess: () => utils.weeklyMaterials.list.invalidate(),
  });

  const current = (materials.data ?? []).find((m: any) => m.weekLabel === weekLabel);
  const [topic, setTopic]   = useState("");
  const [matInput, setMat]  = useState("");
  const [matList, setMatList] = useState<string[]>([]);

  // Mevcut haftayı yükle
  const loadCurrent = () => {
    if (current) {
      setTopic(current.topic ?? "");
      try { setMatList(JSON.parse(current.materials ?? "[]")); } catch { setMatList([]); }
    } else {
      setTopic(""); setMatList([]);
    }
  };

  function addMaterial() {
    if (matInput.trim()) { setMatList([...matList, matInput.trim()]); setMat(""); }
  }

  function save() {
    if (!selectedClass) return;
    upsert.mutate({ classId: selectedClass, weekLabel, topic, materials: matList });
  }

  const classList = (classes.data ?? []) as any[];

  return (
    <div className="p-4 sm:p-6 max-w-3xl mx-auto">
      <h1 className="text-xl font-bold text-lacivert mb-4">Haftalık Ders Planı</h1>

      {/* Sınıf seç */}
      <select className="border p-2 rounded-lg w-full text-sm mb-4"
        value={selectedClass} onChange={(e) => { setClass(e.target.value); setTopic(""); setMatList([]); }}>
        <option value="">Sınıf seçin…</option>
        {classList.map((c: any) => <option key={c.id} value={c.id}>{c.name}</option>)}
      </select>

      {selectedClass && (
        <>
          {/* Hafta navigasyonu */}
          <div className="flex items-center gap-3 mb-4 bg-white border rounded-xl p-3">
            <button onClick={() => { setWeek(weekOffset - 1); setTopic(""); setMatList([]); }} className="px-3 py-1 rounded bg-gray-100 text-sm">←</button>
            <div className="flex-1 text-center">
              <span className="font-semibold text-lacivert text-sm">{weekLabel}</span>
              {weekOffset === 0 && <span className="text-xs text-mavi ml-2">(Bu Hafta)</span>}
            </div>
            <button onClick={() => { setWeek(weekOffset + 1); setTopic(""); setMatList([]); }} className="px-3 py-1 rounded bg-gray-100 text-sm">→</button>
            {weekOffset !== 0 && <button onClick={() => setWeek(0)} className="text-xs text-mavi">Bu Hafta</button>}
          </div>

          {/* Mevcut veriyi yükle butonu */}
          {current && topic === "" && (
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 mb-4 flex items-center justify-between">
              <p className="text-sm text-blue-700">Bu hafta için kayıtlı plan var.</p>
              <button onClick={loadCurrent} className="text-xs bg-mavi text-white px-3 py-1 rounded">Yükle</button>
            </div>
          )}

          {/* Konu */}
          <div className="bg-white border rounded-xl p-4 space-y-4">
            <div>
              <label className="text-sm font-semibold text-lacivert block mb-1">İşlenecek Konu</label>
              <input className="border p-2 rounded-lg w-full text-sm" placeholder="Örn: LED Devresi, Servo Motor Kontrolü…"
                value={topic} onChange={(e) => setTopic(e.target.value)} />
            </div>

            <div>
              <label className="text-sm font-semibold text-lacivert block mb-2">Kullanılacak Malzemeler</label>
              <div className="flex gap-2 mb-2">
                <input className="flex-1 border p-2 rounded-lg text-sm" placeholder="Malzeme ekle (örn: Arduino Uno)"
                  value={matInput} onChange={(e) => setMat(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && addMaterial()} />
                <button onClick={addMaterial} className="bg-mavi text-white px-3 rounded-lg text-sm">+</button>
              </div>
              <div className="flex flex-wrap gap-2">
                {matList.map((m, i) => (
                  <span key={i} className="flex items-center gap-1 bg-turkuaz/10 text-lacivert text-sm px-2 py-1 rounded-full">
                    {m}
                    <button onClick={() => setMatList(matList.filter((_, j) => j !== i))} className="text-gray-400 hover:text-red-500">✕</button>
                  </span>
                ))}
                {matList.length === 0 && <p className="text-xs text-gray-400">Henüz malzeme eklenmedi.</p>}
              </div>
            </div>

            <button onClick={save} disabled={upsert.isPending}
              className="w-full bg-mavi text-white py-2 rounded-lg font-semibold text-sm disabled:opacity-40">
              {upsert.isPending ? "Kaydediliyor…" : "💾 Kaydet"}
            </button>
            {upsert.isSuccess && <p className="text-xs text-green-600 text-center">✓ Kaydedildi!</p>}
          </div>

          {/* Geçmiş haftalar */}
          {(materials.data ?? []).length > 0 && (
            <div className="mt-4 space-y-2">
              <p className="text-sm font-semibold text-gray-500">Kayıtlı Haftalar</p>
              {(materials.data as any[]).map((m: any) => (
                <div key={m.id} className="bg-white border rounded-xl p-3 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-lacivert">{m.weekLabel}</span>
                    <button onClick={() => { setWeek(0); setTopic(m.topic ?? ""); try { setMatList(JSON.parse(m.materials ?? "[]")); } catch { setMatList([]); } }}
                      className="text-xs text-mavi">Düzenle</button>
                  </div>
                  {m.topic && <p className="text-gray-600 mt-1">{m.topic}</p>}
                  {m.materials && (() => { try { const ml = JSON.parse(m.materials); return ml.length > 0 ? <p className="text-xs text-gray-400 mt-1">{ml.join(", ")}</p> : null; } catch { return null; } })()}
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
