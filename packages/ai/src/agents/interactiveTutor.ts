import { getProvider, type AgeContext } from "../provider";

/**
 * İNTERAKTİF DERS MOTORU (TEACHER AI çekirdeği)
 * Öğrenci konuyu dinlerken soru sorabilir, cevap verebilir. AI:
 *  - yaşına uygun konuşur
 *  - öğrencinin cevabını analiz eder (doğru/eksik/yanlış)
 *  - anlamadıysa farklı anlatır
 *  - anladıysa bir sonraki adıma geçer
 * Prompt madde 10'daki interaktif döngü. Konuşma geçmişi AiTeacherSession.messages'a yazılır.
 */
export interface TutorTurn {
  cevap: string;                 // AI'nın öğrenciye söyledikleri
  ogrenciDurumu: "anladı" | "kısmen" | "anlamadı" | "soru_sordu" | "başlangıç";
  sonrakiAdim: "devam" | "tekrar" | "sonraki_konu" | "test_zamanı";
  ipucu?: string;                // öğrenci zorlanıyorsa küçük ipucu
  cesaretlendirme: string;       // yaşa uygun motive edici kısa cümle
}

export async function tutorRespond(input: {
  topic: string;
  age: AgeContext;
  lessonContent?: string;                        // üretilmiş ders içeriği (bağlam)
  history: { role: "ai" | "student"; text: string }[];  // önceki konuşma
  studentMessage: string;                        // öğrencinin yeni mesajı
}): Promise<TutorTurn> {
  const { topic, age, lessonContent, history, studentMessage } = input;

  const system =
    `Sen CEZERİ ROBOTECH'in dijital öğretmeni TEACHER AI'sın. ${age.minAge}-${age.maxAge} yaş (${age.name}) ` +
    `grubundan bir öğrenciye "${topic}" konusunu birebir, interaktif anlatıyorsun. Anlatım dilin: ${age.tone}. ` +
    `Kurallar: (1) Öğrencinin mesajını analiz et. (2) Anlamadıysa farklı/daha basit anlat, asla azarlама. ` +
    `(3) Doğru anladıysa öv ve ilerle. (4) Her yanıtın kısa olsun (bu yaşa uygun). (5) Türkçe konuş. ` +
    `(6) Güvenlik: kişisel bilgi isteme, konu dışına çıkma, sadece bu robotik/STEM konusunda kal.`;

  const convo = history.slice(-20).map((m) => `${m.role === "ai" ? "Öğretmen" : "Öğrenci"}: ${m.text}`).join("\n");
  const user =
    (lessonContent ? `Ders içeriği (bağlam): ${lessonContent.slice(0, 3000)}\n\n` : "") +
    (convo ? `--- ŞİMDİYE KADARKİ KONUŞMA ---\n${convo}\n--- SON ---\n\n` : "") +
    `Öğrencinin yeni mesajı: "${studentMessage}"\n\n` +
    `Öğretmen olarak yanıtla. JSON şeması: {"cevap": string, ` +
    `"ogrenciDurumu": "anladı"|"kısmen"|"anlamadı"|"soru_sordu"|"başlangıç", ` +
    `"sonrakiAdim": "devam"|"tekrar"|"sonraki_konu"|"test_zamanı", "ipucu": string, "cesaretlendirme": string}`;

  return getProvider().completeJSON<TutorTurn>(system, user, 2048);
}
