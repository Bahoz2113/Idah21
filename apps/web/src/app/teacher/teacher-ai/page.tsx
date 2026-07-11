"use client";
import { useState } from "react";
import {
  useAgeGroups, useGenerateLesson, useGenerateQuiz,
  useAdaptToAge, useVisualStoryboard, useSimplify,
  useTutorChat, useDetectWeaknesses,
} from "@cezeri/features";
import { trpc } from "@cezeri/trpc";

type Tab = "ders" | "uyarla" | "gorsel" | "canli" | "analiz";

const TABS: { id: Tab; label: string; icon: string }[] = [
  { id: "ders",   label: "Ders & Test",      icon: "📘" },
  { id: "uyarla", label: "Yaşa Uyarla",      icon: "🎯" },
  { id: "gorsel", label: "Görsel Anlatım",   icon: "🎨" },
  { id: "canli",  label: "Canlı Ders",       icon: "💬" },
  { id: "analiz", label: "Zayıflık Analizi", icon: "🔍" },
];

export default function TeacherAIPage(): JSX.Element {
  const [tab, setTab] = useState<Tab>("ders");
  const ageGroups = useAgeGroups();
  const [topic, setTopic] = useState("LED Yakma");
  const [ageGroupId, setAgeGroupId] = useState("");

  const ageOptions = (
    <select className="border border-gray-200 p-2.5 rounded-xl text-sm w-full focus:border-mavi outline-none"
      value={ageGroupId} onChange={(e) => setAgeGroupId(e.target.value)}>
      <option value="">Yaş grubu seç…</option>
      {ageGroups.data?.map((g) => <option key={g.id} value={g.id}>{g.name} ({g.minAge}-{g.maxAge})</option>)}
    </select>
  );

  return (
    <div className="p-4 sm:p-6 max-w-3xl mx-auto w-full">
      <div className="flex items-center gap-2 mb-1">
        <span className="text-2xl">🦉</span>
        <h1 className="text-2xl font-bold text-lacivert">TEACHER AI</h1>
      </div>
      <p className="text-sm text-gray-400 mb-4">Yaşa uyarlı dijital öğretmen · 10 uzman ajan (Claude)</p>

      <div className="flex gap-1 mb-5 bg-gray-100 p-1 rounded-xl overflow-x-auto">
        {TABS.map((t) => (
          <button key={t.id} onClick={() => setTab(t.id)}
            className={`flex-1 min-w-max px-3 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
              tab === t.id ? "bg-white text-lacivert shadow-sm" : "text-gray-500 hover:text-lacivert"
            }`}>
            <span className="mr-1">{t.icon}</span>{t.label}
          </button>
        ))}
      </div>

      {tab === "ders"   && <DersTab topic={topic} setTopic={setTopic} ageGroupId={ageGroupId} ageOptions={ageOptions} />}
      {tab === "uyarla" && <UyarlaTab ageGroupId={ageGroupId} ageOptions={ageOptions} />}
      {tab === "gorsel" && <GorselTab topic={topic} setTopic={setTopic} ageGroupId={ageGroupId} ageOptions={ageOptions} />}
      {tab === "canli"  && <CanliTab topic={topic} setTopic={setTopic} ageGroupId={ageGroupId} ageOptions={ageOptions} />}
      {tab === "analiz" && <AnalizTab />}
    </div>
  );
}

function Card({ children }: { children: React.ReactNode }) {
  return <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">{children}</div>;
}
function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <label className="grid gap-1.5"><span className="text-xs font-semibold text-gray-500">{label}</span>{children}</label>;
}
function inputCls() { return "border border-gray-200 p-2.5 rounded-xl text-sm w-full focus:border-mavi outline-none"; }
function ErrorBox({ msg }: { msg: string }) {
  return <div className="bg-red-50 border border-red-200 text-red-600 text-sm p-3 rounded-xl">{msg}</div>;
}

function DersTab({ topic, setTopic, ageGroupId, ageOptions }: any) {
  const genLesson = useGenerateLesson();
  const genQuiz = useGenerateQuiz();
  return (
    <div className="space-y-4">
      <Card>
        <div className="grid gap-3">
          <Field label="Konu"><input className={inputCls()} value={topic} onChange={(e) => setTopic(e.target.value)} placeholder="ör. LED Yakma" /></Field>
          <Field label="Yaş Grubu">{ageOptions}</Field>
          <div className="flex gap-2 pt-1">
            <button onClick={() => genLesson.mutate({ topic, ageGroupId: ageGroupId || undefined })}
              disabled={genLesson.isPending || topic.length < 2}
              className="flex-1 bg-mavi text-white py-2.5 rounded-xl font-semibold disabled:opacity-40 hover:bg-lacivert transition-colors">
              {genLesson.isPending ? "Üretiliyor…" : "📘 Ders Üret"}
            </button>
            <button onClick={() => genQuiz.mutate({ topic, ageGroupId: ageGroupId || undefined })}
              disabled={genQuiz.isPending || topic.length < 2}
              className="flex-1 bg-vurgu text-white py-2.5 rounded-xl font-semibold disabled:opacity-40 hover:bg-vurguKoyu transition-colors">
              {genQuiz.isPending ? "Üretiliyor…" : "📝 20 Soruluk Test"}
            </button>
          </div>
        </div>
      </Card>
      {genQuiz.data && (
        <div className="bg-vurgu/10 border border-vurgu/30 rounded-xl p-3 text-sm">
          ✅ {genQuiz.data.count} soruluk test hazır. Öğrenci linki:{" "}
          <a className="text-mavi font-semibold underline" href={`/quiz/${genQuiz.data.quizId}`}>/quiz/{genQuiz.data.quizId}</a>
        </div>
      )}
      {genLesson.error && <ErrorBox msg={genLesson.error.message} />}
      {genLesson.data && <LessonView lesson={genLesson.data.lesson} />}
    </div>
  );
}

function LessonView({ lesson }: { lesson: any }) {
  return (
    <Card>
      <p className="text-lacivert font-medium mb-3">{lesson.intro}</p>
      <div className="space-y-3">
        {lesson.steps?.map((s: any, i: number) => (
          <div key={i} className="border-l-2 border-mavi/40 pl-3">
            <p className="font-bold text-lacivert text-sm">{i + 1}. {s.title}</p>
            <p className="text-sm text-gray-600 mt-0.5">{s.explanation}</p>
            {s.metaphor && <p className="text-sm text-mavi mt-1">🔆 {s.metaphor}</p>}
            {s.visual && <p className="text-xs text-gray-400 mt-0.5">🖼️ {s.visual}</p>}
          </div>
        ))}
      </div>
      {lesson.checkQuestions?.length > 0 && (
        <div className="mt-4 pt-3 border-t border-gray-100">
          <p className="font-bold text-lacivert text-sm mb-1">Kontrol Soruları</p>
          {lesson.checkQuestions.map((c: any, i: number) => (
            <p key={i} className="text-sm text-gray-600">• {c.q} <span className="text-gray-400">({c.a})</span></p>
          ))}
        </div>
      )}
      <p className="text-sm bg-gray-50 p-3 rounded-xl mt-3 text-gray-600">{lesson.summary}</p>
    </Card>
  );
}

function UyarlaTab({ ageGroupId, ageOptions }: any) {
  const adapt = useAdaptToAge();
  const [content, setContent] = useState("");
  const [topic, setTopic] = useState("LED Yakma");
  return (
    <div className="space-y-4">
      <Card>
        <div className="grid gap-3">
          <Field label="Konu"><input className={inputCls()} value={topic} onChange={(e) => setTopic(e.target.value)} /></Field>
          <Field label="Uyarlanacak İçerik">
            <textarea className={inputCls() + " min-h-28"} value={content} onChange={(e) => setContent(e.target.value)}
              placeholder="Bir konu anlatımını buraya yapıştırın; seçtiğiniz yaş grubuna göre yeniden yazılsın…" />
          </Field>
          <Field label="Hedef Yaş Grubu">{ageOptions}</Field>
          <button onClick={() => adapt.mutate({ content, topic, ageGroupId: ageGroupId || undefined })}
            disabled={adapt.isPending || content.length < 10}
            className="bg-mavi text-white py-2.5 rounded-xl font-semibold disabled:opacity-40 hover:bg-lacivert transition-colors">
            {adapt.isPending ? "Uyarlanıyor…" : "🎯 Yaşa Uyarla"}
          </button>
        </div>
      </Card>
      {adapt.error && <ErrorBox msg={adapt.error.message} />}
      {adapt.data && (
        <Card>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold bg-mavi/10 text-mavi px-2 py-1 rounded-lg">{adapt.data.hedefYas}</span>
            <span className="text-xs text-gray-400">{adapt.data.dilSeviyesi}</span>
          </div>
          <p className="text-sm text-gray-700 whitespace-pre-wrap">{adapt.data.anlatim}</p>
          {adapt.data.metaforlar?.length > 0 && (
            <p className="text-sm text-mavi mt-3">🔆 Metaforlar: {adapt.data.metaforlar.join(", ")}</p>
          )}
          {adapt.data.atlananKavramlar?.length > 0 && (
            <p className="text-xs text-gray-400 mt-1">Bu yaşta atlanan: {adapt.data.atlananKavramlar.join(", ")}</p>
          )}
        </Card>
      )}
    </div>
  );
}

function GorselTab({ topic, setTopic, ageGroupId, ageOptions }: any) {
  const visual = useVisualStoryboard();
  return (
    <div className="space-y-4">
      <Card>
        <div className="grid gap-3">
          <Field label="Konu"><input className={inputCls()} value={topic} onChange={(e) => setTopic(e.target.value)} /></Field>
          <Field label="Yaş Grubu">{ageOptions}</Field>
          <button onClick={() => visual.mutate({ topic, ageGroupId: ageGroupId || undefined })}
            disabled={visual.isPending || topic.length < 2}
            className="bg-mavi text-white py-2.5 rounded-xl font-semibold disabled:opacity-40 hover:bg-lacivert transition-colors">
            {visual.isPending ? "Hazırlanıyor…" : "🎨 Görsel Storyboard Üret"}
          </button>
        </div>
      </Card>
      {visual.error && <ErrorBox msg={visual.error.message} />}
      {visual.data && (
        <Card>
          <p className="text-sm text-gray-400 mb-3">Her sahne, ekranda canlandırılabilecek bir görsel adımdır.</p>
          <div className="space-y-3">
            {visual.data.sahneler?.map((s: any) => (
              <div key={s.sira} className="flex gap-3">
                <div className="w-7 h-7 shrink-0 rounded-lg bg-vurgu/15 text-vurgu font-bold text-sm flex items-center justify-center">{s.sira}</div>
                <div>
                  <p className="font-semibold text-lacivert text-sm">{s.baslik}</p>
                  <p className="text-sm text-gray-600">🖼️ {s.gorselTarif}</p>
                  {s.animasyonNotu && <p className="text-xs text-mavi mt-0.5">▶️ {s.animasyonNotu}</p>}
                  <p className="text-xs text-gray-500 mt-0.5">💬 {s.aciklama}</p>
                </div>
              </div>
            ))}
          </div>
          {visual.data.ozetGorsel && (
            <p className="text-sm bg-gray-50 p-3 rounded-xl mt-3 text-gray-600">📌 Özet kare: {visual.data.ozetGorsel}</p>
          )}
        </Card>
      )}
    </div>
  );
}

function CanliTab({ topic, setTopic, ageGroupId, ageOptions }: any) {
  const genLesson = useGenerateLesson();
  const tutor = useTutorChat();
  const simplify = useSimplify();
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [messages, setMessages] = useState<{ role: "ai" | "student"; text: string }[]>([]);
  const [input, setInput] = useState("");
  const [lastAiText, setLastAiText] = useState("");

  async function startSession() {
    const res = await genLesson.mutateAsync({ topic, ageGroupId: ageGroupId || undefined });
    setSessionId(res.id);
    const intro = res.lesson.intro ?? "Merhaba! Hazırsan başlayalım.";
    setMessages([{ role: "ai", text: intro }]);
    setLastAiText(intro);
  }
  async function send() {
    if (!sessionId || !input.trim()) return;
    const msg = input.trim();
    setInput("");
    setMessages((m) => [...m, { role: "student", text: msg }]);
    const res = await tutor.mutateAsync({ sessionId, message: msg });
    setMessages((m) => [...m, { role: "ai", text: res.turn.cevap }]);
    setLastAiText(res.turn.cevap);
  }
  async function askSimplify() {
    if (!sessionId) return;
    const res = await simplify.mutateAsync({
      topic, ageGroupId: ageGroupId || undefined,
      previousExplanation: lastAiText, studentConfusion: "Anlamadım, daha basit anlatır mısın?",
    });
    setMessages((m) => [...m, { role: "student", text: "Anlamadım 🤔" }, { role: "ai", text: res.yeniAnlatim + "\n\n(" + res.gunlukHayatOrnegi + ")" }]);
    setLastAiText(res.yeniAnlatim);
  }

  return (
    <div className="space-y-4">
      {!sessionId ? (
        <Card>
          <div className="grid gap-3">
            <Field label="Konu"><input className={inputCls()} value={topic} onChange={(e) => setTopic(e.target.value)} /></Field>
            <Field label="Yaş Grubu">{ageOptions}</Field>
            <button onClick={startSession} disabled={genLesson.isPending || topic.length < 2}
              className="bg-vurgu text-white py-2.5 rounded-xl font-semibold disabled:opacity-40 hover:bg-vurguKoyu transition-colors">
              {genLesson.isPending ? "Ders hazırlanıyor…" : "💬 Canlı Dersi Başlat"}
            </button>
          </div>
          <p className="text-xs text-gray-400 mt-3">TEACHER AI konuyu anlatır, öğrenci soru sorar, anlamazsa farklı anlatır.</p>
        </Card>
      ) : (
        <Card>
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-semibold text-lacivert">🦉 {topic}</span>
            <button onClick={() => { setSessionId(null); setMessages([]); }} className="text-xs text-gray-400 hover:text-gray-600">Yeni ders</button>
          </div>
          <div className="space-y-2.5 mb-3 max-h-96 overflow-y-auto">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === "student" ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[80%] px-3 py-2 rounded-2xl text-sm whitespace-pre-wrap ${
                  m.role === "student" ? "bg-mavi text-white rounded-br-sm" : "bg-gray-100 text-lacivert rounded-bl-sm"
                }`}>{m.text}</div>
              </div>
            ))}
            {tutor.isPending && <div className="text-xs text-gray-400">TEACHER AI yazıyor…</div>}
          </div>
          <div className="flex gap-2">
            <input className={inputCls()} value={input} onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && send()} placeholder="Sorunu yaz…" />
            <button onClick={send} disabled={tutor.isPending || !input.trim()}
              className="bg-mavi text-white px-4 rounded-xl font-semibold disabled:opacity-40">Gönder</button>
          </div>
          <button onClick={askSimplify} disabled={simplify.isPending}
            className="text-xs text-vurgu font-semibold mt-2 hover:text-vurguKoyu">
            {simplify.isPending ? "Sadeleştiriliyor…" : "🤔 Anlamadım, farklı anlat"}
          </button>
        </Card>
      )}
    </div>
  );
}

function AnalizTab() {
  const weakness = useDetectWeaknesses();
  const students = trpc.students.list.useQuery({});
  const [studentId, setStudentId] = useState("");
  return (
    <div className="space-y-4">
      <Card>
        <div className="grid gap-3">
          <Field label="Öğrenci">
            <select className={inputCls()} value={studentId} onChange={(e) => setStudentId(e.target.value)}>
              <option value="">Öğrenci seç…</option>
              {(students.data as any[])?.map((s) => (
                <option key={s.id} value={s.id}>{s.firstName} {s.lastName}</option>
              ))}
            </select>
          </Field>
          <button onClick={() => studentId && weakness.mutate({ studentId })}
            disabled={weakness.isPending || !studentId}
            className="bg-mavi text-white py-2.5 rounded-xl font-semibold disabled:opacity-40 hover:bg-lacivert transition-colors">
            {weakness.isPending ? "Analiz ediliyor…" : "🔍 Zayıflıkları Tespit Et"}
          </button>
        </div>
        <p className="text-xs text-gray-400 mt-3">Öğrencinin son test sonuçları ve değerlendirme puanlarından zayıf konular çıkarılır.</p>
      </Card>
      {weakness.error && <ErrorBox msg={weakness.error.message} />}
      {weakness.data && (
        <Card>
          <p className="text-sm bg-vurgu/10 text-lacivert p-3 rounded-xl mb-3">💡 {weakness.data.ogretmenNotu}</p>
          {weakness.data.oncelikliTekrar && (
            <p className="text-sm mb-3"><span className="font-semibold text-lacivert">Öncelikli tekrar:</span> {weakness.data.oncelikliTekrar}</p>
          )}
          {weakness.data.zayifKonular?.map((z: any, i: number) => (
            <div key={i} className="border-l-2 pl-3 mb-3" style={{ borderColor: z.seviye === "kritik" ? "#ef4444" : z.seviye === "orta" ? "#F2951F" : "#4A9FC4" }}>
              <p className="font-semibold text-lacivert text-sm">{z.konu} <span className="text-xs text-gray-400">({z.seviye})</span></p>
              <p className="text-sm text-gray-600">{z.tekrarOnerisi}</p>
              <p className="text-xs text-gray-400 mt-0.5">Kanıt: {z.kanit}</p>
            </div>
          ))}
          {weakness.data.gucluKonular?.length > 0 && (
            <p className="text-sm text-green-700 bg-green-50 p-2 rounded-xl mt-2">💪 Güçlü: {weakness.data.gucluKonular.join(", ")}</p>
          )}
        </Card>
      )}
    </div>
  );
}
