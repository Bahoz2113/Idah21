import { getProvider, type AgeContext } from "../provider";

export interface Lesson {
  intro: string;
  steps: { title: string; explanation: string; metaphor?: string; visual?: string }[];
  checkQuestions: { q: string; a: string }[];
  summary: string;
}

export async function generateLesson(input: { topic: string; age: AgeContext; notes?: string }): Promise<Lesson> {
  const { topic, age, notes } = input;
  const system =
    `Sen CEZERİ ROBOTECH'in dijital öğretmenisin. ${age.minAge}-${age.maxAge} yaş (${age.name}) grubuna ders anlatıyorsun. ` +
    `Anlatım dilin: ${age.tone}. Görselleri yalnızca METİNLE öner ("visual" alanı) — gerçek çocuk görseli üretme/isteme. Türkçe yaz.`;
  const user =
    `Konu: "${topic}".${notes ? ` Eğitmen notu: ${notes}.` : ""} ` +
    `Bu konuyu bu yaş grubuna uygun, interaktif ve metaforlu anlat. ` +
    `JSON şeması: {"intro": string, "steps": [{"title": string, "explanation": string, "metaphor": string, "visual": string}], "checkQuestions": [{"q": string, "a": string}], "summary": string}`;
  return getProvider().completeJSON<Lesson>(system, user, 4096);
}
