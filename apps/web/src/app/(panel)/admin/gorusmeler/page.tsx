"use client";
import { ExportButtons } from "@/components/ExportButtons";
import { useState } from "react";
import { trpc } from "@cezeri/trpc";

const MONTHS = ["Ocak","Şubat","Mart","Nisan","Mayıs","Haziran","Temmuz","Ağustos","Eylül","Ekim","Kasım","Aralık"];
const STATUS_LABEL: Record<string, string> = { planned:"📅 Planlandı", completed:"✅ Tamamlandı", cancelled:"❌ İptal" };
const STATUS_COLOR: Record<string, string> = { planned:"bg-blue-50 text-blue-700", completed:"bg-green-50 text-green-700", cancelled:"bg-red-50 text-red-500" };

export default function GorusmelerPage(): JSX.Element {
  const now   = new Date();
  const [year, setYear]   = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth() + 1);
  const [selected, setSelected] = useState<string | null>(null); // "YYYY-MM-DD"
  const [form, setForm]   = useState({ personName:"", institution:"", subject:"", notes:"" });
  const [editId, setEditId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<any>({});

  const utils    = trpc.useUtils();
  const meetings = trpc.meetings.list.useQuery({ year, month });
  const create   = trpc.meetings.create.useMutation({ onSuccess: () => { utils.meetings.list.invalidate(); setSelected(null); setForm({personName:"",institution:"",subject:"",notes:""}); }});
  const update   = trpc.meetings.update.useMutation({ onSuccess: () => { utils.meetings.list.invalidate(); setEditId(null); }});
  const remove   = trpc.meetings.delete.useMutation({ onSuccess: () => utils.meetings.list.invalidate() });

  // Takvim oluştur
  const daysInMonth = new Date(year, month, 0).getDate();
  const firstDay    = (new Date(year, month - 1, 1).getDay() + 6) % 7; // Pazartesi başlangıç
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const blanks = Array.from({ length: firstDay });

  const meetingMap = new Map<string, any[]>();
  (meetings.data ?? []).forEach((m: any) => {
    const d = m.meetingDate?.slice(0, 10) ?? "";
    if (!meetingMap.has(d)) meetingMap.set(d, []);
    meetingMap.get(d)!.push(m);
  });

  function dayKey(d: number) {
    return `${year}-${String(month).padStart(2,"0")}-${String(d).padStart(2,"0")}`;
  }

  function prevMonth() { if (month === 1) { setYear(y => y-1); setMonth(12); } else setMonth(m => m-1); setSelected(null); }
  function nextMonth() { if (month === 12) { setYear(y => y+1); setMonth(1); } else setMonth(m => m+1); setSelected(null); }

  const selectedMeetings = selected ? (meetingMap.get(selected) ?? []) : [];

  return (
    <div className="p-4 sm:p-6 max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
        <h1 className="text-xl font-bold text-lacivert">Kurumsal Görüşmeler</h1>
        <ExportButtons
          title={`Görüşmeler_${MONTHS[month-1]}_${year}`}
          headers={["Tarih","Kişi","Kurum","Konu","Durum","Notlar"]}
          rows={(meetings.data as any[]??[]).map((m: any)=>[new Date(m.meetingDate+"T12:00:00").toLocaleDateString("tr-TR"),m.personName,m.institution??"-",m.subject,m.status==="planned"?"Planlandı":m.status==="completed"?"Tamamlandı":"İptal",m.notes??"-"])}
        />
      </div>

      {/* Ay navigasyonu */}
      <div className="flex items-center gap-3 mb-4">
        <button onClick={prevMonth} className="px-3 py-2 rounded-lg bg-gray-100 text-sm">←</button>
        <h2 className="flex-1 text-center font-semibold text-lacivert">{MONTHS[month-1]} {year}</h2>
        <button onClick={nextMonth} className="px-3 py-2 rounded-lg bg-gray-100 text-sm">→</button>
        <button onClick={() => { setYear(now.getFullYear()); setMonth(now.getMonth()+1); }} className="text-xs text-mavi">Bugün</button>
      </div>

      {/* Takvim */}
      <div className="bg-white border rounded-xl overflow-hidden mb-4">
        {/* Haftanın günleri */}
        <div className="grid grid-cols-7 bg-lacivert text-white text-xs text-center">
          {["Pzt","Sal","Çar","Per","Cum","Cmt","Paz"].map(d => (
            <div key={d} className="py-2 font-semibold">{d}</div>
          ))}
        </div>
        {/* Günler */}
        <div className="grid grid-cols-7">
          {blanks.map((_, i) => <div key={`b${i}`} className="h-16 border-b border-r border-gray-100 bg-gray-50" />)}
          {days.map(d => {
            const key      = dayKey(d);
            const dayMeets = meetingMap.get(key) ?? [];
            const isToday  = key === now.toISOString().slice(0,10);
            const isSel    = key === selected;
            return (
              <div key={d} onClick={() => setSelected(key)}
                className={`h-16 border-b border-r border-gray-100 p-1 cursor-pointer transition hover:bg-blue-50 ${isSel ? "bg-blue-100" : ""}`}>
                <div className={`text-xs font-semibold w-6 h-6 flex items-center justify-center rounded-full ${isToday ? "bg-mavi text-white" : "text-gray-700"}`}>{d}</div>
                <div className="space-y-0.5 mt-0.5">
                  {dayMeets.slice(0,2).map((m: any) => (
                    <div key={m.id} className={`text-xs px-1 rounded truncate ${
                      m.status==="completed" ? "bg-green-100 text-green-700" :
                      m.status==="cancelled" ? "bg-red-100 text-red-500" : "bg-blue-100 text-blue-700"
                    }`}>{m.personName}</div>
                  ))}
                  {dayMeets.length > 2 && <div className="text-xs text-gray-400">+{dayMeets.length-2}</div>}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Seçili günün detayı */}
      {selected && (
        <div className="bg-white border rounded-xl p-4 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-lacivert">
              {new Date(selected + "T12:00:00").toLocaleDateString("tr-TR", { day:"numeric", month:"long", year:"numeric" })}
            </h3>
            <button onClick={() => setSelected(null)} className="text-gray-400 text-lg">✕</button>
          </div>

          {/* Mevcut görüşmeler */}
          {selectedMeetings.map((m: any) => (
            <div key={m.id} className="border rounded-xl p-3 space-y-2">
              {editId === m.id ? (
                <div className="space-y-2">
                  <input className="border p-2 rounded-lg w-full text-sm" placeholder="Kişi adı" value={editForm.personName ?? m.personName} onChange={(e) => setEditForm({...editForm, personName: e.target.value})} />
                  <input className="border p-2 rounded-lg w-full text-sm" placeholder="Kurum" value={editForm.institution ?? m.institution ?? ""} onChange={(e) => setEditForm({...editForm, institution: e.target.value})} />
                  <input className="border p-2 rounded-lg w-full text-sm" placeholder="Konu" value={editForm.subject ?? m.subject} onChange={(e) => setEditForm({...editForm, subject: e.target.value})} />
                  <textarea className="border p-2 rounded-lg w-full text-sm" rows={2} placeholder="Notlar" value={editForm.notes ?? m.notes ?? ""} onChange={(e) => setEditForm({...editForm, notes: e.target.value})} />
                  <select className="border p-2 rounded-lg w-full text-sm" value={editForm.status ?? m.status} onChange={(e) => setEditForm({...editForm, status: e.target.value})}>
                    <option value="planned">📅 Planlandı</option>
                    <option value="completed">✅ Tamamlandı</option>
                    <option value="cancelled">❌ İptal</option>
                  </select>
                  <div className="flex gap-2">
                    <button onClick={() => update.mutate({ id: m.id, ...editForm })} className="bg-mavi text-white px-4 py-2 rounded-lg text-sm">Kaydet</button>
                    <button onClick={() => setEditId(null)} className="bg-gray-100 px-4 py-2 rounded-lg text-sm">İptal</button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="flex items-start gap-2">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-semibold text-lacivert">{m.personName}</span>
                        {m.institution && <span className="text-xs text-gray-500">— {m.institution}</span>}
                        <span className={`text-xs px-2 py-0.5 rounded-full ${STATUS_COLOR[m.status]}`}>{STATUS_LABEL[m.status]}</span>
                      </div>
                      <p className="text-sm text-gray-700 mt-1">{m.subject}</p>
                      {m.notes && <p className="text-xs text-gray-500 mt-1">{m.notes}</p>}
                    </div>
                    <div className="flex gap-1 shrink-0">
                      <button onClick={() => { setEditId(m.id); setEditForm({}); }} className="text-xs px-2 py-1 rounded bg-gray-100">Düzenle</button>
                      <button onClick={() => { if(confirm("Sil?")) remove.mutate({id: m.id}); }} className="text-xs px-2 py-1 rounded bg-red-50 text-red-500">Sil</button>
                    </div>
                  </div>
                </>
              )}
            </div>
          ))}

          {/* Yeni görüşme ekle */}
          <div className="border-t pt-3 space-y-2">
            <p className="text-sm font-semibold text-gray-500">+ Yeni Görüşme Ekle</p>
            <div className="flex gap-2">
              <input className="border p-2 rounded-lg flex-1 text-sm" placeholder="Kişi adı *" value={form.personName} onChange={(e) => setForm({...form, personName: e.target.value})} />
              <input className="border p-2 rounded-lg flex-1 text-sm" placeholder="Kurum (opsiyonel)" value={form.institution} onChange={(e) => setForm({...form, institution: e.target.value})} />
            </div>
            <input className="border p-2 rounded-lg w-full text-sm" placeholder="Görüşme konusu *" value={form.subject} onChange={(e) => setForm({...form, subject: e.target.value})} />
            <textarea className="border p-2 rounded-lg w-full text-sm" rows={2} placeholder="Notlar (opsiyonel)" value={form.notes} onChange={(e) => setForm({...form, notes: e.target.value})} />
            <button
              onClick={() => { if(form.personName && form.subject) create.mutate({ meetingDate: selected, ...form }); }}
              disabled={!form.personName || !form.subject || create.isPending}
              className="w-full bg-mavi text-white py-2 rounded-lg text-sm font-semibold disabled:opacity-40">
              {create.isPending ? "Kaydediliyor…" : "💾 Kaydet"}
            </button>
          </div>
        </div>
      )}

      {/* Ay listesi */}
      <div className="mt-4 space-y-2">
        <p className="text-sm font-semibold text-gray-500">{MONTHS[month-1]} {year} — Tüm Görüşmeler</p>
        {(meetings.data ?? []).length === 0 && <p className="text-gray-400 text-sm">Bu ay görüşme yok. Takvimde bir güne tıklayın.</p>}
        {(meetings.data as any[] ?? []).map((m: any) => (
          <div key={m.id} className="bg-white border rounded-xl p-3 flex items-center gap-3">
            <div className="text-center bg-lacivert text-white rounded-lg px-2 py-1 min-w-12 shrink-0">
              <div className="text-lg font-bold">{new Date(m.meetingDate + "T12:00:00").getDate()}</div>
              <div className="text-xs opacity-70">{MONTHS[month-1].slice(0,3)}</div>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-semibold text-sm text-lacivert">{m.personName}</span>
                {m.institution && <span className="text-xs text-gray-400">{m.institution}</span>}
                <span className={`text-xs px-2 py-0.5 rounded-full ${STATUS_COLOR[m.status]}`}>{STATUS_LABEL[m.status]}</span>
              </div>
              <p className="text-xs text-gray-600 truncate">{m.subject}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
