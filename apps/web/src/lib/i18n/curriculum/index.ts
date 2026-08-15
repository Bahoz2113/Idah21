import type { Locale } from "../config";
import { curriculum, type CurriculumProgram } from "@/lib/seo/curriculum";
import type { CurriculumTextMap } from "./types";
import { en } from "./en";
import { ku } from "./ku";
import { ar } from "./ar";

/**
 * MÜFREDAT BİRLEŞTİRİCİ — kaynak yapı + dil katmanı.
 *
 * `lib/seo/curriculum.ts` tek gerçek kaynaktır: hafta numaraları, kodlar,
 * araç listeleri ve toplamlar oradan gelir. Dil katmanı yalnızca METNİ
 * değiştirir ve SIRAYLA zip'lenir: modül i, hafta j kaynaktaki modül i,
 * hafta j'nin çevirisidir. Sayılar uyuşmazsa `eksikMufredatCevirileri()`
 * uyuşmayan yeri söyler — sessiz kayma yoktur, Türkçesi görünür.
 */

type LocalizedWeek = { no: number; title: string; detail: string };
type LocalizedModule = { title: string; summary: string; weeks: readonly LocalizedWeek[] };
export type LocalizedCurriculumProgram = Omit<CurriculumProgram, "level" | "modules"> & {
  level: string;
  modules: readonly LocalizedModule[];
};

const CEVIRILER: Partial<Record<Locale, CurriculumTextMap>> = { en, ku, ar };

export function localizedCurriculum(locale: Locale): readonly LocalizedCurriculumProgram[] {
  const harita = CEVIRILER[locale];
  if (!harita) return curriculum;
  return curriculum.map((p) => {
    const ceviri = harita[p.id];
    if (!ceviri) return p;
    return {
      ...p,
      title: ceviri.title,
      ages: ceviri.ages,
      level: ceviri.level,
      answer: ceviri.answer,
      modules: p.modules.map((m, mi) => {
        const mc = ceviri.modules[mi];
        if (!mc) return m;
        return {
          title: mc.title,
          summary: mc.summary,
          weeks: m.weeks.map((w, wi) => {
            const wc = mc.weeks[wi];
            return wc ? { no: w.no, title: wc.title, detail: wc.detail } : w;
          }),
        };
      }),
    };
  });
}

/** Denetim: yapı uyuşmazlıkları ve eksik çeviriler. Boş dönmeli. */
export function eksikMufredatCevirileri(): string[] {
  const sorunlar: string[] = [];
  for (const [dil, harita] of Object.entries(CEVIRILER)) {
    for (const p of curriculum) {
      const c = harita[p.id];
      if (!c) {
        sorunlar.push(`${dil}:${p.id} yok`);
        continue;
      }
      if (c.modules.length !== p.modules.length) {
        sorunlar.push(`${dil}:${p.id} modül sayısı ${c.modules.length}≠${p.modules.length}`);
        continue;
      }
      p.modules.forEach((m, mi) => {
        if (c.modules[mi].weeks.length !== m.weeks.length) {
          sorunlar.push(
            `${dil}:${p.id} modül ${mi} hafta sayısı ${c.modules[mi].weeks.length}≠${m.weeks.length}`,
          );
        }
      });
    }
  }
  return sorunlar;
}
