"use client";
import { useState } from "react";
import { trpc } from "@cezeri/trpc";
import { ExportButtons } from "@/components/ExportButtons";

const KATEGORILER = ["Elektronik", "Yazılım"] as const;
const EMPTY = { title: "", description: "", category: "Elektronik", ageGroup: "", orderIndex: 0 };

export default function MufredatPage(): JSX.Element {
  const [form, setForm]     = useState<any>(EMPTY);
  const [editId, setEditId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<any>({});

  const utils  = trpc.useUtils();
  const topics = trpc.curriculum.listTopics.useQuery();
  const create = trpc.curriculum.createTopic.useMutation({
    onSuccess: () => { utils.curriculum.listTopics.invalidate(); setForm(EMPTY); },
  });
  const update = trpc.curriculum.updateTopic.useMutation({
    onSuccess: () => { utils.curriculum.listTopics.invalidate(); setEditId(null); },
  });
  const remove = trpc.curriculum.deleteTopic.useMutation({
    onSuccess: () => utils.curriculum.listTopics.invalidate(),
  });

  // Kategoriye göre grupla
  const grouped = new Map<string, any[]>();
  (topics.data ?? []).forEach((t: any) => {
    const k = t.category || "Genel";
    if (!grouped.has(k)) grouped.set(k, []);
    grouped.get(k)!.push(t);
  });

  return (
    <div className="p-4 sm:p-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
        <h1 className="text-xl font-bold text-lacivert">Müfredat</h1>
        <ExportButtons
          title="Mufredat"
          headers={["Kategori", "Konu", "Yaş Grubu", "Açıklama"]}
          rows={(topics.data as any[] ?? []).map((t: any) => [t.category ?? "Genel", t.title, t.ageGroup ?? "-", t.description ?? "-"])}
        />
      </div>

      {/* Yeni konu ekle */}
      <div className="bg-white border rounded-xl p-4 mb-6 space-y-3">
        <h2 className="font-semibold text-lacivert">Yeni Konu Ekle</h2>
        <div className="grid sm:grid-cols-2 gap-3">
          <input className="border p-2 rounded-lg text-sm" placeholder="Konu başlığı *"
            value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
          <select className="border p-2 rounded-lg text-sm bg-white"
            value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
            {KATEGORILER.map((k) => <option key={k} value={k}>{k}</option>)}
          </select>
          <input className="border p-2 rounded-lg text-sm" placeholder="Yaş grubu (örn. 7-9)"
            value={form.ageGroup} onChange={(e) => setForm({ ...form, ageGroup: e.target.value })} />
          <input className="border p-2 rounded-lg text-sm" type="number" placeholder="Sıra (0,1,2…)"
            value={form.orderIndex} onChange={(e) => setForm({ ...form, orderIndex: Number(e.target.value) })} />
        </div>
        <textarea className="border p-2 rounded-lg w-full text-sm" rows={2} placeholder="Açıklama (opsiyonel)"
          value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
        <button
          disabled={!form.title || create.isPending}
          onClick={() => create.mutate({
            title: form.title,
            description: form.description || undefined,
            category: form.category,
            ageGroup: form.ageGroup || undefined,
            orderIndex: form.orderIndex || 0,
          })}
          className="bg-mavi text-white px-4 py-2 rounded-lg text-sm font-medium disabled:opacity-50">
          {create.isPending ? "Ekleniyor…" : "+ Konu Ekle"}
        </button>
      </div>

      {/* Konu listesi (kategoriye göre) */}
      {topics.isLoading && <p className="text-gray-400 text-sm">Yükleniyor…</p>}
      {topics.data && topics.data.length === 0 && (
        <p className="text-gray-400 text-sm">Henüz müfredat konusu eklenmemiş.</p>
      )}

      <div className="space-y-5">
        {Array.from(grouped.entries()).map(([category, items]) => (
          <div key={category}>
            <h3 className="text-sm font-bold text-mavi mb-2 uppercase tracking-wide">{category}</h3>
            <div className="space-y-2">
              {items.map((t: any) => (
                <div key={t.id} className="bg-white border rounded-xl p-3">
                  {editId === t.id ? (
                    <div className="space-y-2">
                      <input className="border p-2 rounded-lg w-full text-sm"
                        value={editForm.title ?? t.title} onChange={(e) => setEditForm({ ...editForm, title: e.target.value })} />
                      <div className="grid sm:grid-cols-2 gap-2">
                        <select className="border p-2 rounded-lg text-sm bg-white"
                          value={editForm.category ?? t.category ?? "Elektronik"} onChange={(e) => setEditForm({ ...editForm, category: e.target.value })}>
                          {KATEGORILER.map((k) => <option key={k} value={k}>{k}</option>)}
                        </select>
                        <input className="border p-2 rounded-lg text-sm" placeholder="Yaş grubu"
                          value={editForm.ageGroup ?? t.ageGroup ?? ""} onChange={(e) => setEditForm({ ...editForm, ageGroup: e.target.value })} />
                      </div>
                      <textarea className="border p-2 rounded-lg w-full text-sm" rows={2} placeholder="Açıklama"
                        value={editForm.description ?? t.description ?? ""} onChange={(e) => setEditForm({ ...editForm, description: e.target.value })} />
                      <div className="flex gap-2">
                        <button onClick={() => update.mutate({ id: t.id, ...editForm })}
                          className="bg-green-600 text-white px-3 py-1.5 rounded-lg text-xs">Kaydet</button>
                        <button onClick={() => setEditId(null)}
                          className="bg-gray-100 px-3 py-1.5 rounded-lg text-xs">Vazgeç</button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="font-medium text-gray-800 text-sm">{t.title}</p>
                        {t.ageGroup && <span className="inline-block text-xs bg-blue-50 text-blue-700 px-2 py-0.5 rounded mt-1">{t.ageGroup} yaş</span>}
                        {t.description && <p className="text-xs text-gray-500 mt-1">{t.description}</p>}
                      </div>
                      <div className="flex gap-1 shrink-0">
                        <button onClick={() => { setEditId(t.id); setEditForm({}); }}
                          className="text-xs text-mavi px-2 py-1">Düzenle</button>
                        <button onClick={() => { if (confirm("Bu konu ve takvimdeki ilgili kayıtlar arşivlenecek. Emin misiniz?")) remove.mutate({ id: t.id }); }}
                          className="text-xs text-red-500 px-2 py-1">Sil</button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
