import { getProvider, type AgeContext } from "../provider";

/**
 * GÖRSEL ÖĞRENME AGENT'I
 * Konuyu görsel hafızaya hitap eden adımlara böler. Prompt madde 12: LED Yakma'da
 * pil→kablo→direnç→LED→akış animasyonu gibi. GERÇEK GÖRSEL/ÇOCUK GÖRSELİ ÜRETMEZ —
 * her adımı METİNLE tarif eder; ön yüz bunu diyagram/ikon/animasyon olarak canlandırır (KVKK).
 */
export interface VisualStoryboard {
  konu: string;
  sahneler: {
    sira: number;
    baslik: string;
    gorselTarif: string;    // ne çizileceğinin metin tarifi (ör. "kırmızı LED, iki bacağı farklı boyda")
    animasyonNotu?: string; // hareket önerisi (ör. "elektronlar + uçtan - uca akar")
    aciklama: string;       // çocuğa söylenecek kısa cümle
  }[];
  ozetGorsel: string;       // konunun tek karede özeti (metin tarif)
}

export async function buildVisualStoryboard(input: {
  topic: string;
  age: AgeContext;
  content?: string;         // varsa ders içeriği/materyal özeti
}): Promise<VisualStoryboard> {
  const { topic, age, content } = input;

  const system =
    `Sen CEZERİ ROBOTECH'in görsel öğrenme tasarımcısısın. Konuyu ${age.minAge}-${age.maxAge} yaş ` +
    `(${age.name}) grubunun kafasında canlandırabileceği görsel sahnelere bölersin. ` +
    `Gerçek fotoğraf değil, ÇİZİLECEK ŞEYİN METİN TARİFİNİ verirsin. Çocuk görseli asla tarif etme. Türkçe yaz.`;

  const user =
    `Konu: "${topic}".${content ? ` İçerik özeti: ${content.slice(0, 3000)}` : ""}\n\n` +
    `Bu konuyu görsel hafızaya hitap eden sahnelere böl (prompt örneği: LED için pil→kablo→direnç→LED→akış). ` +
    `JSON şeması: {"konu": string, "sahneler": [{"sira": number, "baslik": string, "gorselTarif": string, ` +
    `"animasyonNotu": string, "aciklama": string}], "ozetGorsel": string}`;

  return getProvider().completeJSON<VisualStoryboard>(system, user, 3072);
}
