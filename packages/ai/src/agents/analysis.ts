import { getProvider, type AgeContext } from "../provider";

export interface Analysis {
  weakConcepts: string[];
  strongConcepts: string[];
  learningStyleHint: "VISUAL" | "AUDITORY" | "KINESTHETIC" | "UNKNOWN";
  recommendation: string;
}

export async function analyzeResult(input: {
  topic: string;
  age: AgeContext;
  items: { concept: string; difficulty: string; correct: boolean }[];
}): Promise<Analysis> {
  const { topic, age, items } = input;
  const system = `Sen CEZERİ ROBOTECH'in öğrenci analiz uzmanısın. ${age.name} grubundan bir öğrencinin test sonucunu yorumluyorsun. Türkçe.`;
  const user =
    `Konu: "${topic}". Soru-kavram-sonuç listesi: ${JSON.stringify(items)}. ` +
    `Hangi kavramlarda zayıf/güçlü olduğunu çıkar, olası öğrenme biçimini tahmin et ve bir sonraki ders için kısa, somut bir öneri ver. ` +
    `JSON şeması: {"weakConcepts": string[], "strongConcepts": string[], "learningStyleHint": "VISUAL"|"AUDITORY"|"KINESTHETIC"|"UNKNOWN", "recommendation": string}`;
  return getProvider().completeJSON<Analysis>(system, user, 2048);
}
