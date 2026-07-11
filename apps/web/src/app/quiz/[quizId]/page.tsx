"use client";
import { useState } from "react";
import { useParams } from "next/navigation";
import { useQuiz, useSubmitQuiz } from "@cezeri/features";

export default function QuizPage(): JSX.Element {
  const { quizId } = useParams<{ quizId: string }>();
  const quiz = useQuiz(quizId);
  const submit = useSubmitQuiz();
  const [answers, setAnswers] = useState<Record<string, string>>({});

  function setAns(qid: string, val: string) {
    setAnswers((a) => ({ ...a, [qid]: val }));
  }
  function send() {
    submit.mutate({ quizId, answers: Object.entries(answers).map(([questionId, answer]) => ({ questionId, answer })) });
  }

  if (quiz.isLoading) return <main className="p-6">Yükleniyor…</main>;
  if (!quiz.data) return <main className="p-6">Quiz bulunamadı.</main>;

  if (submit.data) {
    const r = submit.data;
    return (
      <main className="p-6 max-w-xl mx-auto">
        <h1 className="text-2xl font-bold text-lacivert mb-3">Sonuç</h1>
        <div className="bg-white border rounded-xl p-4 space-y-2">
          <p className="text-lg">✅ Doğru: <b>{r.correct}</b> / {r.total} &nbsp; ❌ Yanlış: {r.wrong}</p>
          <p><b>Zayıf kavramlar:</b> {r.analysis.weakConcepts?.join(", ") || "—"}</p>
          <p><b>Güçlü kavramlar:</b> {r.analysis.strongConcepts?.join(", ") || "—"}</p>
          <p><b>Öğrenme biçimi (tahmin):</b> {r.analysis.learningStyleHint}</p>
          <p className="bg-turkuaz/10 p-2 rounded"><b>Öneri:</b> {r.analysis.recommendation}</p>
        </div>
      </main>
    );
  }

  return (
    <main className="p-6 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold text-lacivert mb-1">{quiz.data.topic}</h1>
      <p className="text-sm text-gray-500 mb-4">{quiz.data.questions.length} soru</p>
      <div className="space-y-3">
        {quiz.data.questions.map((q: any, i: number) => (
          <div key={q.id} className="bg-white border rounded-lg p-3">
            <p className="font-semibold text-lacivert">{i + 1}. {q.body}</p>
            {Array.isArray(q.options) && q.options.length ? (
              <div className="flex flex-wrap gap-2 mt-2">
                {q.options.map((opt: string) => (
                  <button key={opt} onClick={() => setAns(q.id, opt)}
                    className={`px-3 py-1 rounded text-sm ${answers[q.id] === opt ? "bg-mavi text-white" : "bg-gray-100"}`}>
                    {opt}
                  </button>
                ))}
              </div>
            ) : (
              <input className="border p-2 rounded w-full mt-2 text-sm" placeholder="Cevabın…"
                value={answers[q.id] ?? ""} onChange={(e) => setAns(q.id, e.target.value)} />
            )}
          </div>
        ))}
      </div>
      <button onClick={send} disabled={submit.isPending} className="mt-4 w-full bg-turkuaz text-lacivert font-bold p-3 rounded">
        {submit.isPending ? "Değerlendiriliyor…" : "Testi Bitir"}
      </button>
    </main>
  );
}
