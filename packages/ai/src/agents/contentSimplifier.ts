import { getProvider, type AgeContext } from "../provider";

/**
 * İÇERİK SADELEŞTİRME AGENT'I
 * Öğrenci "anlamadım" dediğinde konuyu FARKLI bir metafor/açıdan yeniden anlatır.
 * Prompt madde 10: "Çocuk anlamazsa farklı metaforlarla tekrar anlatacak."
 */
export interface SimplifiedExplanation {
  yeniAnlatim: string;         // farklı metaforla sade anlatım
  kullanilanMetafor: string;   // bu sefer kullanılan metafor
  gunlukHayatOrnegi: string;   // çocuğun bildiği günlük hayattan örnek
  kontrolSorusu: string;       // anladığını ölçen tek basit soru
}

export async function simplify(input: {
  topic: string;
  age: AgeContext;
  previousExplanation: string;   // öğrencinin anlamadığı önceki anlatım
  studentConfusion?: string;     // öğrencinin "neyi anlamadım" dediği (varsa)
  triedMetaphors?: string[];     // daha önce denenmiş metaforlar (tekrar kullanma)
}): Promise<SimplifiedExplanation> {
  const { topic, age, previousExplanation, studentConfusion, triedMetaphors } = input;

  const system =
    `Sen CEZERİ ROBOTECH'in dijital öğretmenisin. ${age.minAge}-${age.maxAge} yaş (${age.name}) grubundan ` +
    `bir öğrenci konuyu anlamadı. Aynı şeyi TEKRAR ETME; TAMAMEN FARKLI bir metafor ve günlük hayat örneğiyle, ` +
    `daha sade anlat. Anlatım dilin: ${age.tone}. Türkçe yaz.`;

  const user =
    `Konu: "${topic}"\n` +
    `Öğrencinin anlamadığı anlatım: "${previousExplanation.slice(0, 2000)}"\n` +
    (studentConfusion ? `Öğrenci şunu diyor: "${studentConfusion}"\n` : "") +
    (triedMetaphors?.length ? `Daha önce denenen metaforlar (KULLANMA): ${triedMetaphors.join(", ")}\n` : "") +
    `\nFarklı bir metaforla yeniden, daha basit anlat. ` +
    `JSON şeması: {"yeniAnlatim": string, "kullanilanMetafor": string, "gunlukHayatOrnegi": string, "kontrolSorusu": string}`;

  return getProvider().completeJSON<SimplifiedExplanation>(system, user, 2048);
}
