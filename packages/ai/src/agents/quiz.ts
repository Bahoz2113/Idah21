import { getProvider, type AgeContext } from "../provider";

export type QType = "MULTIPLE_CHOICE" | "TRUE_FALSE" | "VISUAL" | "CIRCUIT_COMPLETION" | "CODE_OUTPUT" | "ORDERING" | "MINI_PROBLEM";
export type Diff = "EASY" | "MEDIUM" | "HARD";

export interface GenQuestion {
  type: QType;
  difficulty: Diff;
  body: string;
  options?: string[];
  correctAnswer: string;
  conceptTag: string;
}

export async function generateQuiz(input: { topic: string; age: AgeContext }): Promise<GenQuestion[]> {
  const { topic, age } = input;
  const system =
    `Sen CEZERİ ROBOTECH için ${age.minAge}-${age.maxAge} yaş (${age.name}) grubuna uygun test hazırlayan bir uzmansın. Türkçe yaz.`;
  const user =
    `"${topic}" konusunda TAM 20 soru üret: 7 kolay (EASY), 8 orta (MEDIUM), 5 zor (HARD). ` +
    `Soru tipleri çeşitli olsun: MULTIPLE_CHOICE, TRUE_FALSE, VISUAL, CIRCUIT_COMPLETION, CODE_OUTPUT, ORDERING, MINI_PROBLEM. ` +
    `MULTIPLE_CHOICE için "options" 4 şık içersin ve "correctAnswer" şıklardan biri olsun. ` +
    `Her sorunun ölçtüğü kavramı "conceptTag" ile belirt (ör: "direnç", "akım yönü", "pin tanımlama"). ` +
    `JSON şeması: {"questions": [{"type": ..., "difficulty": ..., "body": string, "options"?: string[], "correctAnswer": string, "conceptTag": string}]}`;
  const out = await getProvider().completeJSON<{ questions: GenQuestion[] }>(system, user, 8192);
  return out.questions;
}
