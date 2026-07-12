"use client";
import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { trpc } from "@cezeri/trpc";
import { measureTTFD, markDetailMount } from "@/lib/perf-ttfd";
import {
  useStudent, useSubmitEvaluation, useAddTeacherNote, useAddQuizResult,
} from "@cezeri/features";
import { RadarChart, LineChart } from "@/components/Charts";
import { EVALUATION_CRITERIA } from "@cezeri/config";

type Tab = "profil" | "degerlendirme" | "sinavlar" | "notlar";

const ATT_LABEL: Record<string, string> = {
  PRESENT: "Geldi", ABSENT: "Gelmedi", LATE: "Geç geldi", EXCUSED: "İzinli",
};

export default function StudentDetailPage(): JSX.Element {
  const params = useParams();
  const id = params.id as string;
  const student = useStudent(id);
  const [tab, setTab] = useState<Tab>("profil");

  // TTFD profilleme (loop-mrgp6m54-2963ab): nav+route+mount segmenti. No-op unless localStorage.ttfd==="1".
  useEffect(() => { markDetailMount(); }, []);
  // veri ilk geldiginde toplam TTFD.
  useEffect(() => {
    if (student.data) measureTTFD();
  }, [student.data]);

  if (student.isLoading) return <div className="p-6 text-gray-400">Yükleniyor…</div>;
  if (student.error || !student.data) return <div className="p-6 text-red-500">Öğrenci bulunamadı.</div>;

  const s = student.data as any;
  const initials = (s.fullName ?? "?").split(" ").map((x: string) => x[0]).slice(0, 2).join("").toUpperCase();

  return (
    <div className="p-4 sm:p-6 max-w-3xl mx-auto w-full">
      <Link href="/admin/ogrenciler" className="text-sm text-gray-400 hover:text-mavi transition-colors">← Öğrenciler</Link>

      {/* Profil başlık */}
      <div className="mt-2 mb-4 flex items-center gap-3">
        <div className="w-14 h-14 rounded-full bg-mavi/10 text-mavi font-bold text-lg flex items-center justify-center shrink-0">{initials}</div>
        <div className="flex-1 min-w-0">
          <h1 className="text-2xl font-bold text-lacivert leading-tight truncate">{s.fullName}</h1>
          <p className="text-sm text-gray-400">
            {s.class?.name ?? "Sınıfsız"} · {s.ageGroup?.name ?? "—"}
            {s.birthDate && ` · ${calcAge(s.birthDate)} yaş`}
          </p>
        </div>
        <span className={`text-xs px-2.5 py-1 rounded-full ${s.status === "ACTIVE" ? "bg-green-50 text-green-600" : "bg-gray-100 text-gray-400"}`}>
          {s.status === "ACTIVE" ? "Aktif" : "Pasif"}
        </span>
      </div>

      {/* Sekmeler */}
      <div className="flex gap-1 mb-5 bg-gray-100 p-1 rounded-xl overflow-x-auto">
        {([
          { id: "profil",        label: "Profil & Veli", icon: "👤" },
          { id: "degerlendirme", label: "Değerlendirme",  icon: "📊" },
          { id: "sinavlar",      label: "Sınavlar",       icon: "📝" },
          { id: "notlar",        label: "Öğretmen Notu",  icon: "🗒️" },
        ] as const).map((t) => (
          <button key={t.id} onClick={() => setTab(t.id)}
            className={`flex-1 min-w-max px-3 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
              tab === t.id ? "bg-white text-lacivert shadow-sm" : "text-gray-500 hover:text-lacivert"
            }`}>
            <span className="mr-1">{t.icon}</span>{t.label}
          </button>
        ))}
      </div>

      {tab === "profil"        && <ProfilTab s={s} />}
      {tab === "degerlendirme" && <DegerlendirmeTab studentId={id} evaluations={s.evaluations ?? []} />}
      {tab === "sinavlar"      && <SinavlarTab studentId={id} quizReports={s.quizReports ?? []} />}
      {tab === "notlar"        && <NotlarTab studentId={id} notes={s.teacherNotes ?? []} />}
    </div>
  );
}

function calcAge(birthDate: string): number {
  const b = new Date(birthDate); const now = new Date();
  let age = now.getFullYear() - b.getFullYear();
  if (now.getMonth() < b.getMonth() || (now.getMonth() === b.getMonth() && now.getDate() < b.getDate())) age--;
  return age;
}

function Card({ children, title }: { children: React.ReactNode; title?: string }) {
  return (
    <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
      {title && <h3 className="font-semibold text-lacivert text-sm mb-3">{title}</h3>}
      {children}
    </div>
  );
}
function Row({ label, value }: { label: string; value?: string | null }) {
  return (
    <div className="flex justify-between py-1.5 border-b border-gray-50 last:border-0">
      <span className="text-sm text-gray-400">{label}</span>
      <span className="text-sm text-lacivert font-medium text-right">{value || "—"}</span>
    </div>
  );
}

// ─────────────── PROFİL & VELİ ───────────────
function ProfilTab({ s }: { s: any }) {
  const parents = (s.parents ?? []).map((p: any) => p.parent).filter(Boolean);
  const att = s.attendanceSummary ?? {};
  return (
    <div className="space-y-4">
      <Card title="Öğrenci Bilgileri">
        <Row label="Ad Soyad" value={s.fullName} />
        <Row label="Doğum tarihi" value={s.birthDate ? new Date(s.birthDate).toLocaleDateString("tr-TR") : null} />
        <Row label="Okul" value={s.school} />
        <Row label="Okul sınıfı" value={s.schoolGrade} />
        <Row label="Yaş grubu" value={s.ageGroup?.name} />
        <Row label="CEZERİ sınıfı" value={s.class?.name} />
        <Row label="Kayıt tarihi" value={s.registeredAt ? new Date(s.registeredAt).toLocaleDateString("tr-TR") : null} />
        {s.allergyNotes && <Row label="Sağlık / dikkat notu" value={s.allergyNotes} />}
      </Card>

      <Card title="Veli Bilgileri">
        {parents.length === 0 && <p className="text-sm text-gray-400">Veli kaydı yok.</p>}
        {parents.map((p: any, i: number) => (
          <div key={i} className="py-2 border-b border-gray-50 last:border-0">
            <p className="font-medium text-lacivert text-sm">{p.fullName ?? `${p.firstName ?? ""} ${p.lastName ?? ""}`.trim()}</p>
            <div className="flex flex-wrap gap-3 mt-1 text-sm text-gray-500">
              {p.phone && <a href={`tel:${p.phone}`} className="hover:text-mavi">📞 {p.phone}</a>}
              {p.phone && <a href={`https://wa.me/${p.phone.replace(/\D/g, "")}`} target="_blank" rel="noopener noreferrer" className="text-green-600 hover:underline">📲 WhatsApp</a>}
              {p.email && <span>✉️ {p.email}</span>}
            </div>
          </div>
        ))}
      </Card>

      <Card title="Devam Özeti">
        <div className="grid grid-cols-4 gap-2">
          {["PRESENT", "ABSENT", "LATE", "EXCUSED"].map((k) => (
            <div key={k} className="text-center bg-gray-50 rounded-xl py-3">
              <div className="text-xl font-bold text-lacivert">{att[k] ?? 0}</div>
              <div className="text-xs text-gray-400">{ATT_LABEL[k]}</div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

// ─────────────── DEĞERLENDİRME (18 kriter + radar + çizgi + açıklama) ───────────────
function DegerlendirmeTab({ studentId, evaluations }: { studentId: string; evaluations: any[] }) {
  const submit = useSubmitEvaluation();
  const graph = trpc.evaluations.graph.useQuery({ studentId }, { enabled: !!studentId });

  const period = new Date().toISOString().slice(0, 7); // YYYY-MM
  const current = evaluations.find((e) => e.period === period);

  // Düzenlenebilir puanlar + açıklamalar
  const [scores, setScores] = useState<Record<string, number>>(() => {
    const init: Record<string, number> = {};
    EVALUATION_CRITERIA.forEach((c) => { init[c.key] = (current?.scores as any)?.[c.key] ?? 5; });
    return init;
  });
  const [notes, setNotes] = useState<Record<string, string>>(() => (current?.notes as any) ?? {});
  const [saved, setSaved] = useState(false);

  // Radar için en güncel değerlendirme (kaydedilmiş) veya düzenlenen
  const radarData = useMemo(
    () => EVALUATION_CRITERIA.map((c) => ({ label: c.label, value: scores[c.key] ?? 0 })),
    [scores]
  );
  const lineData = (graph.data as any[]) ?? [];

  function save() {
    submit.mutate(
      { studentId, period, scores, notes },
      { onSuccess: () => { setSaved(true); setTimeout(() => setSaved(false), 2500); } }
    );
  }

  return (
    <div className="space-y-4">
      {/* Radar + çizgi grafik */}
      <Card title="Gelişim Grafiği">
        <RadarChart data={radarData} />
        <div className="mt-4 pt-4 border-t border-gray-100">
          <p className="text-xs font-semibold text-gray-400 mb-2">Aylık Gelişim (dönem ortalaması)</p>
          <LineChart data={lineData} />
        </div>
      </Card>

      {/* 18 kriter — puan + açıklama (senin görselindeki tablo) */}
      <Card title={`Ölçüm Metrikleri · ${period}`}>
        <div className="space-y-3">
          {EVALUATION_CRITERIA.map((c) => (
            <div key={c.key} className="border-b border-gray-50 pb-3 last:border-0">
              <div className="flex items-center gap-3">
                <span className="text-sm text-lacivert flex-1">{c.label}</span>
                <input type="range" min={1} max={10} value={scores[c.key]}
                  onChange={(e) => setScores({ ...scores, [c.key]: Number(e.target.value) })}
                  className="w-32 accent-mavi" />
                <span className="w-8 text-right font-bold text-mavi">{scores[c.key]}</span>
              </div>
              <input value={notes[c.key] ?? ""} onChange={(e) => setNotes({ ...notes, [c.key]: e.target.value })}
                placeholder="Açıklama (isteğe bağlı)…"
                className="mt-1.5 w-full border border-gray-100 rounded-lg px-2.5 py-1.5 text-xs text-gray-600 focus:border-mavi outline-none" />
            </div>
          ))}
        </div>
        <button onClick={save} disabled={submit.isPending}
          className="mt-4 w-full bg-mavi text-white py-2.5 rounded-xl font-semibold disabled:opacity-40 hover:bg-lacivert transition-colors">
          {submit.isPending ? "Kaydediliyor…" : saved ? "✓ Kaydedildi" : "Değerlendirmeyi Kaydet"}
        </button>
      </Card>
    </div>
  );
}

// ─────────────── SINAVLAR (AI quiz sonuçları + elle ekleme) ───────────────
function SinavlarTab({ studentId, quizReports }: { studentId: string; quizReports: any[] }) {
  const add = useAddQuizResult();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ topic: "", correct: "", wrong: "", zorlanilan: "" });

  function submit() {
    const correct = parseInt(form.correct || "0", 10);
    const wrong = parseInt(form.wrong || "0", 10);
    if (!form.topic.trim() || correct + wrong === 0) return;
    add.mutate(
      { studentId, topic: form.topic.trim(), correct, wrong, zorlanilanKonu: form.zorlanilan.trim() || undefined },
      { onSuccess: () => { setForm({ topic: "", correct: "", wrong: "", zorlanilan: "" }); setOpen(false); } }
    );
  }

  return (
    <div className="space-y-3">
      {/* Sınav sonucu ekle */}
      {!open ? (
        <button onClick={() => setOpen(true)}
          className="w-full border-2 border-dashed border-mavi/30 text-mavi py-2.5 rounded-xl font-semibold text-sm hover:bg-mavi/5 transition-colors">
          + Sınav Sonucu Ekle
        </button>
      ) : (
        <Card title="Yeni Sınav Sonucu">
          <div className="space-y-2.5">
            <input value={form.topic} onChange={(e) => setForm({ ...form, topic: e.target.value })}
              placeholder="Konu (ör. LED Yakma)"
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:border-mavi outline-none" />
            <div className="flex gap-2">
              <input type="number" min={0} value={form.correct} onChange={(e) => setForm({ ...form, correct: e.target.value })}
                placeholder="Doğru sayısı"
                className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:border-mavi outline-none" />
              <input type="number" min={0} value={form.wrong} onChange={(e) => setForm({ ...form, wrong: e.target.value })}
                placeholder="Yanlış sayısı"
                className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:border-mavi outline-none" />
            </div>
            <input value={form.zorlanilan} onChange={(e) => setForm({ ...form, zorlanilan: e.target.value })}
              placeholder="Zorlandığı konu (isteğe bağlı)"
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:border-mavi outline-none" />
            {add.error && <p className="text-xs text-red-500">{add.error.message}</p>}
            <div className="flex gap-2 pt-1">
              <button onClick={submit} disabled={add.isPending || !form.topic.trim()}
                className="flex-1 bg-mavi text-white py-2 rounded-lg font-semibold text-sm disabled:opacity-40 hover:bg-lacivert transition-colors">
                {add.isPending ? "Kaydediliyor…" : "Kaydet"}
              </button>
              <button onClick={() => { setOpen(false); add.reset(); }}
                className="px-4 py-2 bg-gray-100 rounded-lg text-sm text-gray-600">İptal</button>
            </div>
          </div>
        </Card>
      )}

      {/* Mevcut sonuçlar */}
      {quizReports.length === 0 && (
        <Card><p className="text-sm text-gray-400 text-center py-6">Henüz sınav/test sonucu yok.</p></Card>
      )}
      {quizReports.map((r: any) => {
        const p = r.payload ?? {};
        const total = p.total ?? ((p.correct ?? 0) + (p.wrong ?? 0));
        const pct = total ? Math.round((p.correct / total) * 100) : 0;
        return (
          <Card key={r.id}>
            <div className="flex items-center justify-between mb-2">
              <span className="font-semibold text-lacivert text-sm">{p.topic ?? "Test"}</span>
              <span className="text-xs text-gray-400">{new Date(r.createdAt).toLocaleDateString("tr-TR")}</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex-1 bg-gray-100 rounded-full h-2.5 overflow-hidden">
                <div className="h-full rounded-full bg-mavi" style={{ width: `${pct}%` }} />
              </div>
              <span className="text-sm font-bold text-mavi">{pct}%</span>
            </div>
            <p className="text-xs text-gray-400 mt-1.5">
              ✅ {p.correct ?? 0} doğru · ❌ {p.wrong ?? 0} yanlış {total ? `· ${total} soru` : ""}
            </p>
            {p.zorlanılanKonu && <p className="text-xs text-vurgu mt-1">Zorlandığı: {p.zorlanılanKonu}</p>}
          </Card>
        );
      })}
    </div>
  );
}

// ─────────────── ÖĞRETMEN NOTLARI (düzenlenebilir/eklenebilir) ───────────────
function NotlarTab({ studentId, notes }: { studentId: string; notes: any[] }) {
  const add = useAddTeacherNote();
  const [text, setText] = useState("");
  const [visibleToParent, setVisibleToParent] = useState(false);

  function submit() {
    if (!text.trim()) return;
    add.mutate({ studentId, note: text.trim(), visibleToParent }, { onSuccess: () => setText("") });
  }

  return (
    <div className="space-y-4">
      <Card>
        <textarea value={text} onChange={(e) => setText(e.target.value)}
          placeholder="Öğrenci hakkında not ekle…"
          className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm min-h-20 focus:border-mavi outline-none" />
        <div className="flex items-center justify-between mt-2">
          <label className="flex items-center gap-2 text-sm text-gray-500">
            <input type="checkbox" checked={visibleToParent} onChange={(e) => setVisibleToParent(e.target.checked)} className="accent-mavi" />
            Veliye görünür
          </label>
          <button onClick={submit} disabled={add.isPending || !text.trim()}
            className="bg-vurgu text-white px-4 py-2 rounded-xl font-semibold text-sm disabled:opacity-40 hover:bg-vurguKoyu transition-colors">
            {add.isPending ? "Ekleniyor…" : "Not Ekle"}
          </button>
        </div>
      </Card>

      <div className="space-y-2">
        {notes.length === 0 && <p className="text-sm text-gray-400 text-center py-4">Henüz not yok.</p>}
        {notes.map((n: any) => (
          <div key={n.id} className="bg-white border border-gray-100 rounded-xl p-3">
            <p className="text-sm text-gray-700">{n.note}</p>
            <div className="flex items-center justify-between mt-1.5">
              <span className="text-xs text-gray-400">
                {n.teacher?.user ? `${n.teacher.user.firstName ?? ""} ${n.teacher.user.lastName ?? ""}`.trim() : "Öğretmen"}
                {" · "}{new Date(n.createdAt).toLocaleDateString("tr-TR")}
              </span>
              {n.visibleToParent && <span className="text-xs text-green-600 bg-green-50 px-2 py-0.5 rounded-full">Veli görür</span>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
