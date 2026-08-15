"use client";
import { useState } from "react";
import { trpc } from "@cezeri/trpc";

export default function AdminEgitmenlerPage(): JSX.Element {
  const utils     = trpc.useUtils();
  const teachers  = trpc.teachers.list.useQuery();
  const createInv = trpc.invitations.createTeacher.useMutation();
  const resetPw   = trpc.invitations.resetPassword.useMutation();
  const deactivate = trpc.adminUsers.deactivate.useMutation({ onSuccess: () => utils.teachers.list.invalidate() });
  const activate   = trpc.adminUsers.activate.useMutation({ onSuccess: () => utils.teachers.list.invalidate() });

  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ firstName: "", lastName: "", phone: "" });
  const [waUrl, setWaUrl]   = useState<string | null>(null);
  const [link, setLink]     = useState<string | null>(null);
  const [busy, setBusy]     = useState(false);

  async function handleInvite() {
    if (!form.firstName || !form.lastName) return;
    setBusy(true);
    try {
      const res = await createInv.mutateAsync(form);
      setWaUrl(res.waUrl);
      setLink(res.link);
      setForm({ firstName: "", lastName: "", phone: "" });
      setShowForm(false);
    } catch (e: any) { alert(e.message); }
    setBusy(false);
  }

  async function handleReset(t: any) {
    if (!confirm(`${t.firstName} ${t.lastName} için şifre sıfırlama linki oluşturulsun mu?`)) return;
    const res = await resetPw.mutateAsync({ userId: t.userId ?? "", firstName: t.firstName, phone: t.phone ?? undefined });
    setWaUrl(res.waUrl);
    setLink(res.link);
  }

  const list = (teachers.data ?? []) as any[];

  return (
    <div className="p-4 sm:p-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-bold text-lacivert">Eğitmenler</h1>
        <button onClick={() => setShowForm(!showForm)} className="bg-mavi text-white px-4 py-2 rounded-lg text-sm font-semibold">+ Eğitmen Ekle</button>
      </div>

      {/* Davet formu */}
      {showForm && (
        <div className="bg-white border rounded-xl p-4 mb-4 space-y-3">
          <p className="text-sm text-gray-500">Eğitmen bilgilerini girin, WhatsApp davet linki oluşturulsun.</p>
          <div className="flex gap-2">
            <input className="border p-2 rounded-lg flex-1 text-sm" placeholder="Ad *" value={form.firstName} onChange={(e) => setForm({...form, firstName: e.target.value})} />
            <input className="border p-2 rounded-lg flex-1 text-sm" placeholder="Soyad *" value={form.lastName} onChange={(e) => setForm({...form, lastName: e.target.value})} />
          </div>
          <div className="flex border rounded-lg overflow-hidden">
            <span className="bg-gray-100 px-3 flex items-center text-sm text-gray-500 border-r">🇹🇷 +90</span>
            <input className="flex-1 p-2 outline-none text-sm" placeholder="5XX XXX XX XX (opsiyonel)" value={form.phone} onChange={(e) => setForm({...form, phone: e.target.value})} />
          </div>
          <div className="flex gap-2">
            <button onClick={handleInvite} disabled={busy || !form.firstName || !form.lastName} className="bg-green-500 text-white px-4 py-2 rounded-lg text-sm disabled:opacity-40">
              {busy ? "Oluşturuluyor…" : "📲 WhatsApp Davet Linki Oluştur"}
            </button>
            <button onClick={() => setShowForm(false)} className="bg-gray-100 px-4 py-2 rounded-lg text-sm">İptal</button>
          </div>
        </div>
      )}

      {/* Oluşturulan davet linki */}
      {waUrl && (
        <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-4 space-y-2">
          <p className="text-sm font-semibold text-green-700">✅ Davet linki hazır!</p>
          <p className="text-xs text-gray-500 break-all">{link}</p>
          <div className="flex gap-2">
            <a href={waUrl} target="_blank" rel="noopener noreferrer"
              className="bg-green-500 text-white px-4 py-2 rounded-lg text-sm font-semibold">
              📲 WhatsApp'ta Gönder
            </a>
            <button onClick={() => { navigator.clipboard.writeText(link ?? ""); alert("Link kopyalandı!"); }}
              className="bg-gray-100 px-4 py-2 rounded-lg text-sm">📋 Kopyala</button>
            <button onClick={() => { setWaUrl(null); setLink(null); }} className="text-gray-400 text-sm px-2">✕</button>
          </div>
        </div>
      )}

      {/* Eğitmen listesi */}
      <div className="space-y-2">
        {list.map((t: any) => (
          <div key={t.id} className="bg-white border rounded-xl p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-mavi text-white flex items-center justify-center font-bold shrink-0">
              {(t.firstName?.[0] ?? "?").toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-lacivert">{t.firstName} {t.lastName}</p>
              <p className="text-xs text-gray-400">{t.phone ?? "Telefon yok"} · {t.email ?? ""}</p>
            </div>
            <div className="flex gap-2 shrink-0">
              <button onClick={() => handleReset(t)} className="text-xs px-2 py-1 rounded bg-amber-50 text-amber-600 border border-amber-200">🔑 Şifre Sıfırla</button>
              {t.status === "ACTIVE"
                ? <button onClick={() => t.userId && deactivate.mutate({userId: t.userId})} className="text-xs px-2 py-1 rounded bg-red-50 text-red-500 border border-red-200">Pasif Et</button>
                : <button onClick={() => t.userId && activate.mutate({userId: t.userId})} className="text-xs px-2 py-1 rounded bg-green-50 text-green-600 border border-green-200">Aktif Et</button>
              }
            </div>
          </div>
        ))}
        {!list.length && <p className="text-gray-400 text-sm text-center py-8">Henüz eğitmen yok. + Eğitmen Ekle ile davet edin.</p>}
      </div>
    </div>
  );
}
