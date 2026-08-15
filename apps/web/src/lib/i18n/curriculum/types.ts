/**
 * Müfredat çeviri katmanının biçimi. Yapı `lib/seo/curriculum.ts` ile
 * paraleldir; modüller ve haftalar SIRAYLA eşlenir (zip). Hafta numarası
 * ve araç listeleri çevrilmez — numara yapısaldır, araç adları üründür.
 */
export type CurriculumWeekText = { title: string; detail: string };

export type CurriculumModuleText = {
  title: string;
  summary: string;
  weeks: readonly CurriculumWeekText[];
};

export type CurriculumProgramText = {
  title: string;
  ages: string;
  level: string;
  answer: string;
  modules: readonly CurriculumModuleText[];
};

export type CurriculumTextMap = Record<string, CurriculumProgramText>;
