import { getProvider, type AgeContext } from "../provider";

export interface TeacherReport {
  summary: string;
  weakAreas: string[];
  strongAreas: string[];
  recommendation: string;
}

export async function generateTeacherReport(input: {
  studentName: string;
  age: AgeContext;
  scope: string; // hafta/dönem etiketi
  topics: string[];
  weakConcepts?: string[];
  strongConcepts?: string[];
  evaluationAvg?: number;
}): Promise<TeacherReport> {
  const system = `Sen CEZERİ ROBOTECH'in pedagoji uzmanısın. Eğitmene yönelik kısa, eyleme dönük bir gelişim raporu yazıyorsun. Türkçe.`;
  const user =
    `Öğrenci: ${input.studentName} (${input.age.name}). Kapsam: ${input.scope}. ` +
    `Konular: ${input.topics.join(", ") || "—"}. ` +
    `${input.evaluationAvg != null ? `Performans ort.: ${input.evaluationAvg}. ` : ""}` +
    `${input.strongConcepts?.length ? `Güçlü: ${input.strongConcepts.join(", ")}. ` : ""}` +
    `${input.weakConcepts?.length ? `Zayıf: ${input.weakConcepts.join(", ")}. ` : ""}` +
    `Bir sonraki ders için somut öneri ver. JSON şeması: {"summary": string, "weakAreas": string[], "strongAreas": string[], "recommendation": string}`;
  return getProvider().completeJSON<TeacherReport>(system, user, 1536);
}
