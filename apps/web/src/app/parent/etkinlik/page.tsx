"use client";
import { trpc } from "@cezeri/trpc";

export default function ParentEtkinlikPage(): JSX.Element {
  const events = trpc.events.list.useQuery();
  return (
    <div className="p-4 sm:p-6 max-w-2xl mx-auto">
      <h1 className="text-xl font-bold text-lacivert mb-4">Duyurular & Etkinlikler</h1>
      <div className="space-y-2">
        {events.data?.map((e) => (
          <div key={e.id} className="bg-white border rounded-lg p-3">
            <p className="font-semibold text-lacivert">{e.title}</p>
            <p className="text-xs text-gray-500">{new Date(e.date).toLocaleString("tr")}</p>
            {e.description && <p className="text-sm text-gray-600 mt-1">{e.description}</p>}
          </div>
        ))}
        {!events.data?.length && <p className="text-sm text-gray-400">Etkinlik yok.</p>}
      </div>
    </div>
  );
}
