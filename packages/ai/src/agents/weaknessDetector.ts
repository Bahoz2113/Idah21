import { getProvider } from "../provider";

/**
 * ZAYIFLIK TESPİTİ AGENT'I
 * Quiz sonuçları + öğretmen değerlendirmelerinden öğrencinin zayıf olduğu konuları/kavramları
 * tespit eder ve tekrar planı önerir. Prompt madde 10: "Öğrencinin eksiklerini öğretmene raporlayacak."
 */
export interface WeaknessReport {
  zayifKonular: {
    konu: string;
    seviye: "düşük" | "orta" | "kritik";
    kanit: string;              // hangi veriye dayanıyor
    tekrarOnerisi: string;      // nasıl telafi edilmeli
  }[];
  gucluKonular: string[];
  oncelikliTekrar: string;      // ilk ele alınması gereken konu
  ogretmenNotu: string;         // öğretmene tek cümlelik özet öneri
}

export async function detectWeaknesses(input: {
  studentName?: string;
  quizResults?: { topic: string; correct: number; wrong: number; empty: number; weakConcepts?: string[] }[];
  evaluationScores?: Record<string, number>;   // 18 kriter (1-10)
  recentTopics?: string[];
}): Promise<WeaknessReport> {
  const { studentName, quizResults, evaluationScores, recentTopics } = input;

  const system =
    "Sen CEZERİ ROBOTECH'in öğrenci zayıflık analistisin. Quiz sonuçları ve değerlendirme puanlarından " +
    "öğrencinin eksik olduğu konuları tespit eder, somut tekrar önerisi verirsin. Veriye dayan, uydurma. Türkçe yaz.";

  const user =
    `Öğrenci: ${studentName ?? "(isimsiz)"}\n` +
    (quizResults?.length ? `Quiz sonuçları: ${JSON.stringify(quizResults)}\n` : "") +
    (evaluationScores ? `Değerlendirme puanları (1-10): ${JSON.stringify(evaluationScores)}\n` : "") +
    (recentTopics?.length ? `Son işlenen konular: ${recentTopics.join(", ")}\n` : "") +
    `\nZayıflıkları tespit et. JSON: {"zayifKonular": [{"konu": string, "seviye": "düşük"|"orta"|"kritik", ` +
    `"kanit": string, "tekrarOnerisi": string}], "gucluKonular": string[], "oncelikliTekrar": string, "ogretmenNotu": string}`;

  return getProvider().completeJSON<WeaknessReport>(system, user, 2048);
}
