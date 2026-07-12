"use client";
import { trpc } from "@cezeri/trpc";

export default function StudentDerslerimPage(): JSX.Element {
  const lessons = trpc.lessons.myLessons.useQuery();
  return (
    <div className="p-4 sm:p-6 max-w-2xl mx-auto">
      <h1 className="text-xl font-bold text-lacivert mb-4">Derslerim</h1>
      {lessons.isLoading && <p className="text-sm text-gray-400">Yükleniyor…</p>}
      <div className="space-y-2">
        {lessons.data?.map((l) => (
          <div key={l.id} className="bg-white border rounded-lg p-3">
            <p className="font-semibold text-lacivert">{l.topic}</p>
            <p className="text-xs text-gray-500">{new Date(l.date).toLocaleDateString("tr")}</p>
            {l.homework && <p className="text-sm text-amber-600 mt-1">📝 Ödev: {l.homework}</p>}
            {l.nextTopic && <p className="text-xs text-turkuaz mt-1">Sıradaki konu: {l.nextTopic}</p>}
            {Array.isArray((l as any).materials) && (l as any).materials.length > 0 && (
              <p className="text-xs text-gray-400 mt-1">📎 {(l as any).materials.length} materyal</p>
            )}
          </div>
        ))}
        {!lessons.isLoading && !lessons.data?.length && <p className="text-sm text-gray-400">Henüz ders kaydı yok.</p>}
      </div>
    </div>
  );
}
