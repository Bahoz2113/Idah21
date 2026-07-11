import { getProvider } from "../provider";

/**
 * MATERYAL ANALİZİ AGENT'I
 * Eğitmenin yüklediği materyalin (PDF metni, Arduino kodu, ders notu, devre açıklaması)
 * ham metnini alır; TEACHER AI'ın ders üretiminde kullanacağı yapılandırılmış bir özet çıkarır.
 * Çocuk fotoğrafı/videosu ANALİZ ETMEZ — yalnızca öğretim materyali metni işlenir (KVKK).
 */
export interface MaterialSummary {
  konu: string;                    // materyalin ana konusu
  ozet: string;                    // 2-3 cümlelik özet
  kavramlar: string[];             // öğretilen anahtar kavramlar
  onKosullar: string[];            // bu konuyu anlamak için gereken ön bilgiler
  materyalTipi: string;            // "kod" | "teori" | "devre" | "proje" | "karma"
  kodVarsa: {                      // Arduino/kod materyali ise
    dil: string;
    aciklama: string;
    anahtarSatirlar: string[];
  } | null;
  ogretimNoktalari: string[];      // derste vurgulanması gereken noktalar
  olasiZorluklar: string[];        // öğrencilerin zorlanabileceği yerler
}

export async function analyzeMaterial(input: {
  title?: string;
  materialType: string;            // MaterialType enum değeri (PDF, ARDUINO_CODE, NOTE, ...)
  extractedText: string;           // materyalden çıkarılmış ham metin
}): Promise<MaterialSummary> {
  const { title, materialType, extractedText } = input;

  const system =
    "Sen CEZERİ ROBOTECH'in eğitim materyali analistisin. Robotik, Arduino, elektronik, kodlama ve " +
    "STEM materyallerini analiz edip öğretim için yapılandırılmış özet çıkarırsın. Türkçe yaz. " +
    "Yalnızca öğretim içeriğini analiz et; kişisel veri/çocuk bilgisi görürsen yok say.";

  const user =
    `Materyal başlığı: ${title ?? "(başlıksız)"}\n` +
    `Materyal tipi: ${materialType}\n` +
    `--- MATERYAL İÇERİĞİ ---\n${extractedText.slice(0, 12000)}\n--- SON ---\n\n` +
    `Bu materyali analiz et ve şu JSON şemasında döndür: ` +
    `{"konu": string, "ozet": string, "kavramlar": string[], "onKosullar": string[], ` +
    `"materyalTipi": "kod"|"teori"|"devre"|"proje"|"karma", ` +
    `"kodVarsa": {"dil": string, "aciklama": string, "anahtarSatirlar": string[]} | null, ` +
    `"ogretimNoktalari": string[], "olasiZorluklar": string[]}`;

  return getProvider().completeJSON<MaterialSummary>(system, user, 3072);
}
