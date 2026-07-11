import { getProvider, type AgeContext } from "../provider";

/**
 * YAŞ ADAPTASYONU AGENT'I
 * Var olan bir içeriği (ders metni, materyal özeti) hedef yaş grubuna yeniden uyarlar.
 * Prompt'taki örnek: "LED Yakma" konusu 6-8 yaşa metaforlu, 14-18 yaşa voltaj/direnç hesabıyla.
 */
export interface AdaptedContent {
  hedefYas: string;
  dilSeviyesi: string;              // kullanılan anlatım dili özeti
  anlatim: string;                  // yaşa uyarlanmış tam anlatım
  metaforlar: string[];             // bu yaş için kullanılan metaforlar
  atlananKavramlar: string[];       // bu yaş için erken olan, atlanan kavramlar
}

export async function adaptToAge(input: {
  content: string;                  // uyarlanacak ham içerik
  topic: string;
  age: AgeContext;
}): Promise<AdaptedContent> {
  const { content, topic, age } = input;

  const system =
    `Sen CEZERİ ROBOTECH'in yaş adaptasyon uzmanısın. Bir içeriği ${age.minAge}-${age.maxAge} yaş ` +
    `(${age.name}) grubuna uyarlıyorsun. Bu yaş için anlatım dili: ${age.tone}. ` +
    `Küçük yaşlarda soyut kavramları (voltaj hesabı, diyot fiziği) atla; büyük yaşlarda derinleştir. Türkçe yaz.`;

  const user =
    `Konu: "${topic}"\n--- KAYNAK İÇERİK ---\n${content.slice(0, 8000)}\n--- SON ---\n\n` +
    `Bu içeriği ${age.name} (${age.minAge}-${age.maxAge} yaş) grubuna uyarla. ` +
    `JSON şeması: {"hedefYas": string, "dilSeviyesi": string, "anlatim": string, ` +
    `"metaforlar": string[], "atlananKavramlar": string[]}`;

  return getProvider().completeJSON<AdaptedContent>(system, user, 4096);
}
