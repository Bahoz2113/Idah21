"use client";
import { useState } from "react";
import { trpc } from "@cezeri/trpc";

export default function AdminEtkinlikPage(): JSX.Element {
  const events = trpc.events.list.useQuery();
  const create = trpc.events.create.useMutation({ onSuccess: () => events.refetch() });
  const del = trpc.events.delete.useMutation({ onSuccess: () => events.refetch() });

  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [desc, setDesc] = useState("");

  function handleCreate() {
    if (!title || !date) return;
    create.mutate({ title, date: new Date(date).toISOString(), description: desc || undefined });
    setTitle(""); setDate(""); setDesc("");
  }

  return (
    <div className="p-4 sm:p-6 max-w-2xl mx-auto">
      <h1 className="text-xl font-bold text-lacivert mb-4">Duyuru / Etkinlik</h1>
      <div className="bg-white border rounded-xl p-4 mb-4 space-y-2">
        <input className="border p-2 rounded w-full" placeholder="Etkinlik / duyuru başlığı *"
          value={title} onChange={(e) => setTitle(e.target.value)} />
        <input className="border p-2 rounded w-full" type="datetime-local"
          value={date} onChange={(e) => setDate(e.target.value)} />
        <textarea className="border p-2 rounded w-full h-20" placeholder="Açıklama (opsiyonel)"
          value={desc} onChange={(e) => setDesc(e.target.value)} />
        <button onClick={handleCreate} disabled={!title || !date || create.isPending}
          className="bg-mavi text-white px-4 py-2 rounded disabled:opacity-40">
          {create.isPending ? "Kaydediliyor…" : "Ekle"}
        </button>
      </div>
      <div className="space-y-2">
        {events.data?.map((e) => (
          <div key={e.id} className="bg-white border rounded-lg p-3 flex justify-between items-start">
            <div>
              <p className="font-semibold text-lacivert">{e.title}</p>
              <p className="text-xs text-gray-500">{new Date(e.date).toLocaleString("tr")}</p>
              {e.description && <p className="text-sm text-gray-600 mt-1">{e.description}</p>}
            </div>
            <button onClick={() => del.mutate({ id: e.id })} className="text-red-400 hover:text-red-600 text-xs ml-3 shrink-0">Sil</button>
          </div>
        ))}
        {!events.data?.length && <p className="text-sm text-gray-400">Henüz etkinlik yok.</p>}
      </div>
    </div>
  );
}
