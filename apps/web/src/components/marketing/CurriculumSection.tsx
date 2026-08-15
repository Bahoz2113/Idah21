"use client";

import { useMemo, useState } from "react";
import type { Locale } from "@/lib/i18n/config";
import { ui } from "@/lib/i18n/ui";
import { curriculumTotalWeeks } from "@/lib/seo/curriculum";
import { localizedCurriculum } from "@/lib/i18n/curriculum";
import { Reveal } from "./Reveal";

/**
 * MÜFREDATIMIZ — dört programın haftalık ders planı.
 *
 * Bir eğitim kurumunun verebileceği en somut güven işareti, "ne
 * öğretiyorsunuz" sorusuna hafta hafta cevap vermektir. Bu yüzden 165
 * haftanın tamamı sayfada durur.
 *
 * Okunabilirlik sorunu üç katmanla çözülür:
 *   program (4) → modül (5-6) → hafta (26-59)
 * Program seçilir, modüller listelenir, istenen modül açılınca haftalar
 * görünür. Tek seviyeli bir liste 59 satırda okunmaz hâle gelirdi.
 *
 * SEO açısından kritik nokta: seçili olmayan programın haftaları DOM'da
 * DEĞİLDİR — 165 haftanın hepsini birden basmak sayfayı gereksiz
 * şişirirdi. Bunun yerine her programın kendi başlığı, tanımı, modül
 * adları ve hafta SAYISI her zaman görünür; ayrıntı isteğe bağlı açılır.
 * Arama motorlarının ihtiyacı olan konu haritası bu üst katmanda zaten
 * tamdır, `Syllabus` şeması da onu birebir yansıtır.
 */

const LEVEL_TONE: Record<string, string> = {
  Başlangıç: "text-czr-emerald border-czr-emerald/35",
  Orta: "text-czr-ice border-white/25",
  İleri: "text-czr-orange border-czr-orange/45",
};

export function CurriculumSection({ locale }: { locale: Locale }) {
  const t = ui(locale);
  // Program metinleri dile göre (kurucunun kuralı: seçilen dilde her
  // yazılı içerik o dile döner). Yapı ve hafta numaraları kaynaktan.
  const curriculum = useMemo(() => localizedCurriculum(locale), [locale]);
  const [active, setActive] = useState(curriculum[0].id);
  const [openModule, setOpenModule] = useState<string | null>(null);

  const program = curriculum.find((p) => p.id === active) ?? curriculum[0];

  return (
    <div className="mt-14">
      {/* Program seçici */}
      <Reveal>
        <div
          role="tablist"
          aria-label={t.curriculumPrograms}
          className="flex flex-wrap gap-2.5"
        >
          {curriculum.map((p) => {
            const selected = p.id === active;
            return (
              <button
                key={p.id}
                type="button"
                role="tab"
                aria-selected={selected}
                onClick={() => {
                  setActive(p.id);
                  setOpenModule(null);
                }}
                className={`czr-rim rounded-2xl border px-4 py-3 text-left transition duration-500 ease-czr-cine ${
                  selected
                    ? "border-czr-orange/50 bg-czr-orange/10"
                    : "czr-glass-panel hover:border-white/25"
                }`}
              >
                <span className="czr-mono block text-[10px] tabular-nums text-czr-orange">
                  {p.code}
                </span>
                <span
                  className={`mt-1 block max-w-[15rem] text-balance text-[14px] font-semibold leading-snug ${
                    selected ? "text-white" : "text-czr-ice/80"
                  }`}
                >
                  {p.title}
                </span>
                <span className="czr-mono mt-1.5 block text-[10px] uppercase tracking-[0.12em] text-czr-ice/45">
                  {p.ages} · {p.totalWeeks} {t.weeks}
                </span>
              </button>
            );
          })}
        </div>
      </Reveal>

      {/* Seçili program */}
      <div className="mt-10 grid gap-10 lg:grid-cols-12">
        <Reveal className="lg:col-span-7">
          <p className="text-pretty text-[15px] leading-relaxed text-czr-ice/80 sm:text-base">
            {program.answer}
          </p>
        </Reveal>

        <Reveal delay={80} className="lg:col-span-5">
          <div className="czr-glass-panel czr-rim rounded-2xl p-6">
            <div className="flex flex-wrap items-center gap-2.5">
              <span
                className={`rounded-full border px-2.5 py-1 czr-mono text-[10px] uppercase tracking-[0.14em] ${
                  LEVEL_TONE[program.level] ?? "text-czr-ice border-white/25"
                }`}
              >
                {program.level}
              </span>
              <span className="czr-mono text-[11px] tabular-nums text-czr-ice/55">
                {program.ages} · {program.totalWeeks} {t.weeks} · {program.modules.length}{" "}
                {t.modules}
              </span>
            </div>

            <h4 className="czr-mono mt-6 text-[10px] uppercase tracking-[0.16em] text-czr-ice/45">
              {t.curriculumTools}
            </h4>
            <ul className="mt-3 flex flex-wrap gap-1.5">
              {program.tools.map((t) => (
                <li
                  key={t}
                  className="rounded-full border border-white/10 bg-white/[0.03] px-2.5 py-1 text-[11px] text-czr-ice/65"
                >
                  {t}
                </li>
              ))}
            </ul>
          </div>
        </Reveal>
      </div>

      {/* Modüller */}
      <ol className="mt-10 divide-y divide-white/8 border-y border-white/8">
        {program.modules.map((m, i) => {
          const key = `${program.id}:${m.title}`;
          const isOpen = openModule === key;

          return (
            <li key={key}>
              <Reveal delay={Math.min(i, 5) * 50}>
                <details open={isOpen} className="group py-1">
                  <summary
                    onClick={(e) => {
                      e.preventDefault();
                      setOpenModule(isOpen ? null : key);
                    }}
                    className="flex cursor-pointer list-none items-start gap-4 py-5 [&::-webkit-details-marker]:hidden sm:gap-6"
                  >
                    <span className="czr-mono mt-1 shrink-0 text-[11px] tabular-nums text-czr-orange">
                      {String(i + 1).padStart(2, "0")}
                    </span>

                    <span className="min-w-0 flex-1">
                      <h4 className="text-balance text-[17px] font-bold leading-snug text-white transition-colors duration-300 group-open:text-czr-orange sm:text-lg">
                        {m.title}
                      </h4>
                      <p className="mt-1 text-[14px] leading-relaxed text-czr-ice/60">
                        {m.summary}
                      </p>
                    </span>

                    <span className="mt-1 flex shrink-0 items-center gap-3">
                      <span className="czr-mono hidden rounded-full border border-white/12 px-2.5 py-0.5 text-[10px] tabular-nums text-czr-ice/55 sm:inline">
                        {m.weeks.length} {t.weeks}
                      </span>
                      <span
                        aria-hidden="true"
                        className="rounded-full border border-white/12 p-1.5 text-czr-ice/60 transition duration-300 ease-czr-cine group-open:rotate-45 group-open:border-czr-orange/50 group-open:text-czr-orange"
                      >
                        <svg viewBox="0 0 20 20" className="h-3.5 w-3.5" fill="currentColor">
                          <path d="M9 4h2v5h5v2h-5v5H9v-5H4V9h5z" />
                        </svg>
                      </span>
                    </span>
                  </summary>

                  <ol className="space-y-0 pb-8 sm:pl-[52px]">
                    {m.weeks.map((w) => (
                      <li
                        key={`${key}:${w.no}`}
                        className="flex gap-4 border-l border-white/8 py-3 pl-5 transition-colors duration-300 hover:border-czr-orange/40 sm:gap-6"
                      >
                        <span className="czr-mono w-16 shrink-0 pt-0.5 text-[10px] uppercase tabular-nums tracking-[0.1em] text-czr-ice/40">
                          {t.weekLabel.replace("{n}", String(w.no))}
                        </span>
                        <span className="min-w-0">
                          <span className="block text-[15px] font-semibold text-white">
                            {w.title}
                          </span>
                          <span className="mt-1 block text-[14px] leading-relaxed text-czr-ice/60">
                            {w.detail}
                          </span>
                        </span>
                      </li>
                    ))}
                  </ol>
                </details>
              </Reveal>
            </li>
          );
        })}
      </ol>

      <Reveal>
        <p className="mt-8 text-[13px] leading-relaxed text-czr-ice/45">
          {t.curriculumTotalPre}{" "}
          <span className="tabular-nums text-czr-ice/70">{curriculumTotalWeeks}</span>{" "}
          {t.curriculumTotalPost}
        </p>
      </Reveal>
    </div>
  );
}
