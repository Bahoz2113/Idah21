import { getProvider, type AgeContext } from "../provider";

export interface ParentReport {
  summary: string;
  attendanceComment: string;
  performanceComment: string;
  strengths: string[];
  strugglesWith: string[];
  homeAdvice: string[];
  nextMonth: string;
}

export async function generateParentReport(input: {
  studentName: string;
  age: AgeContext;
  period: string;
  topics: string[];
  attendance: { present: number; absent: number; late: number; excused: number };
  evaluationAvg?: number;
  weakConcepts?: string[];
  strongConcepts?: string[];
  teacherNote?: string;
}): Promise<ParentReport> {
  const system =
    `Sen CEZERİ ROBOTECH'in veli iletişim uzmanısın. Veliye sıcak, anlaşılır, teknik olmayan bir dille aylık rapor yazıyorsun. Türkçe. Çocuğu asla olumsuz etiketleme; gelişim odaklı ol.`;
  const user =
    `Öğrenci: ${input.studentName} (${input.age.name}). Dönem: ${input.period}. ` +
    `İşlenen konular: ${input.topics.join(", ") || "—"}. ` +
    `Devam: geldi ${input.attendance.present}, gelmedi ${input.attendance.absent}, geç ${input.attendance.late}, izinli ${input.attendance.excused}. ` +
    `${input.evaluationAvg != null ? `Performans ortalaması (1-10): ${input.evaluationAvg}. ` : ""}` +
    `${input.strongConcepts?.length ? `Güçlü: ${input.strongConcepts.join(", ")}. ` : ""}` +
    `${input.weakConcepts?.length ? `Zorlandığı: ${input.weakConcepts.join(", ")}. ` : ""}` +
    `${input.teacherNote ? `Öğretmen notu: ${input.teacherNote}. ` : ""}` +
    `Bu verilerle veli raporu üret. JSON şeması: {"summary": string, "attendanceComment": string, "performanceComment": string, "strengths": string[], "strugglesWith": string[], "homeAdvice": string[], "nextMonth": string}`;
  return getProvider().completeJSON<ParentReport>(system, user, 2048);
}
