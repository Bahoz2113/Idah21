"use client";
import { useNotifications, useMarkRead, useMarkAllRead } from "@cezeri/features";

export function BildirimlerView() {
  const list = useNotifications();
  const markRead = useMarkRead();
  const markAll = useMarkAllRead();

  return (
    <div className="p-4 sm:p-6 max-w-xl mx-auto">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl sm:text-2xl font-bold text-lacivert">Bildirimler</h1>
        <button onClick={() => markAll.mutate()} className="text-sm text-mavi">Tümünü okundu yap</button>
      </div>
      <div className="space-y-2">
        {list.data?.length ? list.data.map((n) => (
          <div key={n.id} onClick={() => !n.readAt && markRead.mutate({ id: n.id })}
            className={`border rounded-lg p-3 cursor-pointer ${n.readAt ? "bg-white" : "bg-turkuaz/10 border-turkuaz"}`}>
            <p className="font-semibold text-lacivert text-sm">{n.title}</p>
            {n.body && <p className="text-sm text-gray-600">{n.body}</p>}
            <p className="text-xs text-gray-400">{new Date(n.createdAt).toLocaleString("tr")}</p>
          </div>
        )) : <p className="text-sm text-gray-400">Bildirim yok.</p>}
      </div>
    </div>
  );
}
