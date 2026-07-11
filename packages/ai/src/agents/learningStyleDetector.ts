import { getProvider } from "../provider";

/**
 * ÖĞRENME STİLİ TANIMA AGENT'I
 * Öğrencinin ders içi etkileşim geçmişinden (sorular, cevaplar, hangi anlatımda "anladım" dediği)
 * öğrenme stilini çıkarır. Prompt madde 10: "Görerek mi, dinleyerek mi, uygulayarak mı öğrendiğini analiz edecek."
 */
export interface LearningStyleResult {
  stil: "VISUAL" | "AUDITORY" | "KINESTHETIC" | "UNKNOWN";
  guven: number;               // 0-100 güven yüzdesi
  gerekce: string;             // neden bu stile karar verildi
  oneriler: string[];          // bu stile göre öğretmene öneriler
}

export async function detectLearningStyle(input: {
  interactions: { role: string; text: string }[];   // ders içi konuşma geçmişi
  quizPatterns?: string;                              // varsa quiz davranış özeti
}): Promise<LearningStyleResult> {
  const { interactions, quizPatterns } = input;

  if (interactions.length < 3) {
    return { stil: "UNKNOWN", guven: 0, gerekce: "Stil tespiti için yeterli etkileşim verisi yok.", oneriler: [] };
  }

  const system =
    "Sen CEZERİ ROBOTECH'in öğrenme stili analistisin. Öğrencinin etkileşim geçmişine bakarak " +
    "görsel (VISUAL), işitsel (AUDITORY) veya uygulamalı (KINESTHETIC) öğrenme eğilimini belirlersin. " +
    "Yetersiz veri varsa UNKNOWN de. Abartma, kanıta dayan. Türkçe yaz.";

  const convo = interactions.slice(-30).map((m) => `${m.role}: ${m.text}`).join("\n");
  const user =
    `--- ETKİLEŞİM GEÇMİŞİ ---\n${convo}\n--- SON ---\n` +
    (quizPatterns ? `Quiz davranışı: ${quizPatterns}\n` : "") +
    `\nÖğrenme stilini belirle. JSON: {"stil": "VISUAL"|"AUDITORY"|"KINESTHETIC"|"UNKNOWN", ` +
    `"guven": number, "gerekce": string, "oneriler": string[]}`;

  return getProvider().completeJSON<LearningStyleResult>(system, user, 1536);
}
