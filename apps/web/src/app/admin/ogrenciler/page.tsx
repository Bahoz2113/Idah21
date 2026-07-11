"use client";
import Link from "next/link";
import { useState } from "react";
import { trpc } from "@cezeri/trpc";
import { ExportButtons } from "@/components/ExportButtons";

export default function AdminOgrencilerPage(): JSX.Element {
  const utils     = trpc.useUtils();
  const students  = trpc.students.list.useQuery({ includeArchived: false });
  const classes   = trpc.lookup.classes.useQuery();
  const moveClass = trpc.students.changeClass?.useMutation?.({ onSuccess: () => utils.students.list.invalidate() });
  const softDel   = trpc.students.softDelete?.useMutation?.({ onSuccess: () => utils.students.list.invalidate() });
  const [filter, setFilter]   = useState("");
  const [classFilter, setCF]  = useState("");
  const [showInvite, setInv]  = useState<string | null>(null);

  const createInv = trpc.invitations.createParent.useMutation();
  const [invForm, setInvForm] = useState({ firstName:"", lastName:"", phone:"", studentName:"" });
  const [waUrl, setWaUrl]     = useState<string | null>(null);

  const list = (students.data ?? []) as any[];
  const classList = (classes.data ?? []) as any[];

  const filtered = list.filter(s =>
    (!filter || `${s.firstName} ${s.lastName}`.toLowerCase().includes(filter.toLowerCase())) &&
    (!classFilter || s.classId === classFilter)
  );

  // Export verisi
  const exportHeaders = ["Ad", "Soyad", "Sınıf", "Yaş Grubu", "Telefon (Veli)"];
  const exportRows    = filtered.map(s => [s.firstName, s.lastName, s.className ?? "-", s.ageGroupName ?? "-", s.parentPhone ?? "-"]);

  return (
    <div className="p-4 sm:p-6 max-w-5xl mx-auto">
      {/* Başlık + Export */}
      <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
        <h1 className="text-xl font-bold text-lacivert">Öğrenciler ({filtered.length})</h1>
        <ExportButtons title="Öğrenci Listesi" headers={exportHeaders} rows={exportRows} />
      </div>

      {/* Filtreler */}
      <div className="flex gap-2 mb-4 flex-wrap">
        <input className="border p-2 rounded-lg text-sm flex-1 min-w-40" placeholder="🔍 Öğrenci ara…"
          value={filter} onChange={(e) => setFilter(e.target.value)} />
        <select className="border p-2 rounded-lg text-sm" value={classFilter} onChange={(e) => setCF(e.target.value)}>
          <option value="">Tüm Sınıflar</option>
          {classList.map((c: any) => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
      </div>

      {/* WhatsApp davet sonucu */}
      {waUrl && (
        <div className="bg-green-50 border border-green-200 rounded-xl p-3 mb-4 flex items-center gap-3">
          <span className="text-sm text-green-700 flex-1">✅ Davet linki hazır!</span>
          <a href={waUrl} target="_blank" rel="noopener" className="bg-green-500 text-white px-3 py-1.5 rounded-lg text-sm">📲 WhatsApp</a>
          <button onClick={() => setWaUrl(null)} className="text-gray-400">✕</button>
        </div>
      )}

      {/* Öğrenci listesi */}
      <div className="space-y-2">
        {filtered.map((s: any) => (
          <div key={s.id} className="bg-white border rounded-xl p-3 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-turkuaz/20 text-lacivert font-bold text-sm flex items-center justify-center shrink-0">
              {s.firstName?.[0]}{s.lastName?.[0]}
            </div>
            <div className="flex-1 min-w-0">
              <Link href={`/admin/ogrenciler/${s.id}`}
                className="font-semibold text-lacivert text-sm hover:text-mavi transition-colors truncate block">
                {s.fullName ?? `${s.firstName ?? ""} ${s.lastName ?? ""}`.trim() || "İsimsiz"}
              </Link>
              <p className="text-xs text-gray-400">{s.class?.name ?? s.className ?? "Sınıfsız"} · {s.ageGroup?.name ?? s.ageGroupName ?? ""}</p>
            </div>
            {/* Sınıf değiştir */}
            <select className="border rounded-lg text-xs p-1.5 max-w-32"
              value={s.classId ?? ""} onChange={(e) => moveClass?.mutate?.({ studentId: s.id, classId: e.target.value })}>
              <option value="">Sınıfsız</option>
              {classList.map((c: any) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
            {/* Veliye davet */}
            <button onClick={() => { setInv(s.id); setInvForm({ firstName:"", lastName:"", phone:"", studentName:`${s.firstName} ${s.lastName}` }); }}
              className="text-xs px-2 py-1.5 rounded-lg bg-blue-50 text-mavi border border-blue-200 shrink-0">
              📲 Veli Davet
            </button>
          </div>
        ))}
        {!filtered.length && <p className="text-gray-400 text-sm text-center py-8">Öğrenci bulunamadı.</p>}
      </div>

      {/* Veli davet modal */}
      {showInvite && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm space-y-3">
            <h3 className="font-bold text-lacivert">Veliye WhatsApp Daveti</h3>
            <p className="text-xs text-gray-500">Öğrenci: <b>{invForm.studentName}</b></p>
            <div className="flex gap-2">
              <input className="border p-2 rounded-lg flex-1 text-sm" placeholder="Veli adı *" value={invForm.firstName} onChange={(e) => setInvForm({...invForm, firstName: e.target.value})} />
              <input className="border p-2 rounded-lg flex-1 text-sm" placeholder="Soyad *" value={invForm.lastName} onChange={(e) => setInvForm({...invForm, lastName: e.target.value})} />
            </div>
            <div className="flex border rounded-lg overflow-hidden">
              <span className="bg-gray-100 px-2 flex items-center text-sm text-gray-500 border-r">+90</span>
              <input className="flex-1 p-2 outline-none text-sm" placeholder="5XX XXX XX XX" value={invForm.phone} onChange={(e) => setInvForm({...invForm, phone: e.target.value})} />
            </div>
            <div className="flex gap-2">
              <button onClick={async () => {
                if (!invForm.firstName || !invForm.lastName) return;
                const res = await createInv.mutateAsync({ ...invForm, studentId: showInvite });
                setWaUrl(res.waUrl); setInv(null);
              }} disabled={createInv.isPending || !invForm.firstName || !invForm.lastName}
                className="flex-1 bg-green-500 text-white py-2 rounded-lg text-sm font-semibold disabled:opacity-40">
                {createInv.isPending ? "…" : "📲 Link Oluştur"}
              </button>
              <button onClick={() => setInv(null)} className="px-4 py-2 bg-gray-100 rounded-lg text-sm">İptal</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
