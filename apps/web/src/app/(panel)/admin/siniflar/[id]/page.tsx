"use client";
import { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useClass } from "@cezeri/features";
import { trpc } from "@cezeri/trpc";

type Tab = "ogrenciler" | "mufredat" | "materyal";

export default function ClassDetailPage(): JSX.Element {
  const params = useParams();
  const id = params.id as string;
  const cls = useClass(id);
  const [tab, setTab] = useState<Tab>("ogrenciler");

  if (cls.isLoading) return <div className="p-6 text-gray-400">Yükleniyor…</div>;
  if (cls.error || !cls.data) return <div className="p-6 text-red-500">Sınıf bulunamadı.</div>;

  const c = cls.data as any;

  return (
    <div className="p-4 sm:p-6 max-w-3xl mx-auto w-full">
      {/* Geri + başlık */}
      <Link href="/admin/siniflar" className="text-sm text-gray-400 hover:text-mavi transition-colors">← Sınıflar</Link>
      <div className="mt-2 mb-1 flex items-center gap-3">
        <div className="w-11 h-11 rounded-xl bg-mavi/10 flex items-center justify-center text-xl">📚</div>
        <div>
          <h1 className="text-2xl font-bold text-lacivert leading-tight">{c.name}</h1>
          <p className="text-sm text-gray-400">
            {c.ageGroup?.name ?? "—"} · {c.teacher?.fullName ?? "Eğitmen atanmamış"} · {c.day} {c.time}
          </p>
        </div>
      </div>

      {/* Özet rozetleri */}
      <div className="flex gap-2 flex-wrap my-4">
        <Badge icon="🎓" label={`${c.students?.length ?? 0} öğrenci`} />
        <Badge icon="📅" label={`Kontenjan ${c.capacity ?? "—"}`} />
        <Badge icon="📘" label={`${c.lessons?.length ?? 0} işlenen ders`} />
      </div>

      {/* Sekmeler */}
      <div className="flex gap-1 mb-5 bg-gray-100 p-1 rounded-xl">
        {([
          { id: "ogrenciler", label: "Öğrenciler", icon: "🎓" },
          { id: "mufredat",   label: "Aylık Müfredat", icon: "🗓️" },
          { id: "materyal",   label: "Materyaller", icon: "📎" },
        ] as const).map((t) => (
          <button key={t.id} onClick={() => setTab(t.id)}
            className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
              tab === t.id ? "bg-white text-lacivert shadow-sm" : "text-gray-500 hover:text-lacivert"
            }`}>
            <span className="mr-1">{t.icon}</span>{t.label}
          </button>
        ))}
      </div>

      {tab === "ogrenciler" && <StudentList students={c.students ?? []} />}
      {tab === "mufredat"   && <CurriculumPanel classId={id} ageGroupId={c.ageGroupId} />}
      {tab === "materyal"   && <MaterialPanel lessons={c.lessons ?? []} />}
    </div>
  );
}

function Badge({ icon, label }: { icon: string; label: string }) {
  return <span className="inline-flex items-center gap-1.5 bg-white border border-gray-100 text-lacivert text-sm px-3 py-1.5 rounded-lg">{icon} {label}</span>;
}

// ─────────────── ÖĞRENCİ LİSTESİ (tıklanabilir) ───────────────
function StudentList({ students }: { students: any[] }) {
  if (students.length === 0)
    return <div className="bg-white border border-gray-100 rounded-2xl p-8 text-center text-gray-400">Bu sınıfta henüz öğrenci yok.</div>;
  return (
    <div className="space-y-2">
      {students.map((s) => {
        const initials = (s.fullName ?? "?").split(" ").map((x: string) => x[0]).slice(0, 2).join("").toUpperCase();
        return (
          <Link key={s.id} href={`/admin/ogrenciler/${s.id}`}
            className="group bg-white border border-gray-100 rounded-xl p-3 flex items-center gap-3 hover:border-vurgu/40 hover:shadow-md transition-all">
            <div className="w-9 h-9 rounded-full bg-mavi/10 text-mavi font-bold text-sm flex items-center justify-center shrink-0">{initials}</div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-lacivert group-hover:text-mavi transition-colors truncate">{s.fullName}</p>
              <p className="text-xs text-gray-400">{s.school ?? "—"} {s.schoolGrade ? `· ${s.schoolGrade}` : ""}</p>
            </div>
            <span className={`text-xs px-2 py-0.5 rounded-full ${s.status === "ACTIVE" ? "bg-green-50 text-green-600" : "bg-gray-100 text-gray-400"}`}>
              {s.status === "ACTIVE" ? "Aktif" : "Pasif"}
            </span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="text-gray-300 group-hover:text-vurgu transition-colors">
              <path d="M9 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </Link>
        );
      })}
    </div>
  );
}

// ─────────────── AYLIK MÜFREDAT / KONU TAKVİMİ (düzenlenebilir) ───────────────
function CurriculumPanel({ classId }: { classId: string; ageGroupId?: string }) {
  const utils = trpc.useUtils();
  const now = new Date();
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth() + 1); // 1-12

  const plan = trpc.curriculum.monthPlan.useQuery({ classId, year, month }, { enabled: !!classId });
  const invalidate = () => utils.curriculum.monthPlan.invalidate({ classId, year, month });
  const add = trpc.curriculum.addWeeklyTopic.useMutation({ onSuccess: invalidate });
  const del = trpc.curriculum.deleteWeeklyTopic.useMutation({ onSuccess: invalidate });

  const [week, setWeek] = useState(1);
  const [topic, setTopic] = useState("");
  const rows = (plan.data as any[]) ?? [];

  const monthValue = `${year}-${String(month).padStart(2, "0")}`;
  function onMonthChange(v: string) {
    const [y, m] = v.split("-").map(Number);
    if (y && m) { setYear(y); setMonth(m); }
  }
  function submit() {
    if (!topic.trim()) return;
    add.mutate({ classId, year, month, weekNo: week, topic: topic.trim() });
    setTopic("");
  }

  return (
    <div className="space-y-4">
      <div className="bg-white border border-gray-100 rounded-2xl p-4">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-semibold text-lacivert">Aylık Konu Planı</span>
          <input type="month" value={monthValue} onChange={(e) => onMonthChange(e.target.value)}
            className="border border-gray-200 rounded-lg px-2 py-1 text-sm focus:border-mavi outline-none" />
        </div>

        <div className="space-y-2">
          {[1, 2, 3, 4].map((w) => {
            const wr = rows.filter((r) => r.weekNo === w);
            return (
              <div key={w} className="flex items-start gap-3 border-l-2 border-mavi/30 pl-3 py-1">
                <span className="text-xs font-bold text-mavi shrink-0 w-14 pt-0.5">{w}. Hafta</span>
                <div className="flex-1">
                  {wr.length === 0 && <span className="text-sm text-gray-300">—</span>}
                  {wr.map((r) => (
                    <div key={r.id} className="flex items-center justify-between group">
                      <span className="text-sm text-gray-700">{r.topic}</span>
                      <button onClick={() => del.mutate({ id: r.id })}
                        className="text-xs text-gray-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition">✕</button>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        <div className="flex gap-2 mt-4 pt-3 border-t border-gray-100">
          <select value={week} onChange={(e) => setWeek(Number(e.target.value))}
            className="border border-gray-200 rounded-lg px-2 text-sm focus:border-mavi outline-none">
            {[1, 2, 3, 4].map((w) => <option key={w} value={w}>{w}. Hafta</option>)}
          </select>
          <input value={topic} onChange={(e) => setTopic(e.target.value)}
            placeholder="Konu (ör. LED Yakma)" className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:border-mavi outline-none"
            onKeyDown={(e) => e.key === "Enter" && submit()} />
          <button onClick={submit} disabled={add.isPending || !topic.trim()}
            className="bg-vurgu text-white px-4 rounded-lg font-semibold text-sm disabled:opacity-40 hover:bg-vurguKoyu transition-colors">Ekle</button>
        </div>
      </div>
      <p className="text-xs text-gray-400">Veli, ay içinde çocuğunun hangi konuları göreceğini bu plandan görebilecek.</p>
    </div>
  );
}

// ─────────────── MATERYALLER (işlenen derslerin materyalleri) ───────────────
const MAT_LABEL: Record<string, string> = {
  PDF: "PDF", PPT: "Sunum", ARDUINO_CODE: "Arduino Kodu", CIRCUIT: "Devre Şeması",
  MODEL_3D: "3D Model", STL: "STL", NOTE: "Ders Notu", LINK: "Bağlantı",
};
const MAT_ICON: Record<string, string> = {
  PDF: "📄", PPT: "📊", ARDUINO_CODE: "💻", CIRCUIT: "🔌", MODEL_3D: "🧊", STL: "🧊", NOTE: "📝", LINK: "🔗",
};

function MaterialPanel({ lessons }: { lessons: any[] }) {
  const withMaterials = lessons.filter((l) => (l.materials?.length ?? 0) > 0);
  if (withMaterials.length === 0)
    return (
      <div className="bg-white border border-gray-100 rounded-2xl p-8 text-center text-gray-400">
        Bu sınıfta henüz materyal yüklenmemiş.<br />
        <Link href="/teacher/dersler" className="text-mavi text-sm hover:underline">Ders materyali eklemek için →</Link>
      </div>
    );
  return (
    <div className="space-y-3">
      {withMaterials.map((l) => (
        <div key={l.id} className="bg-white border border-gray-100 rounded-2xl p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="font-semibold text-lacivert text-sm">{l.topic ?? "İsimsiz ders"}</span>
            <span className="text-xs text-gray-400">{new Date(l.createdAt).toLocaleDateString("tr-TR")}</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {l.materials.map((m: any) => (
              <a key={m.id} href={m.url} target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 bg-gray-50 hover:bg-mavi/5 border border-gray-100 rounded-lg px-2.5 py-1.5 text-sm text-gray-700 transition-colors">
                <span>{MAT_ICON[m.type] ?? "📎"}</span>
                <span>{m.title ?? MAT_LABEL[m.type] ?? m.type}</span>
              </a>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
