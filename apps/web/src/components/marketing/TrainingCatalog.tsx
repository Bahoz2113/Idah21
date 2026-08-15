"use client";

import Image from "next/image";
import { useState } from "react";
import { defaultLocale, type Locale } from "@/lib/i18n/config";
import { ui } from "@/lib/i18n/ui";
import { localizedDisciplines } from "@/lib/i18n/view";
import { serviceAreaSentence, trainingSeoById } from "@/lib/seo/trainings";
import { Reveal } from "./Reveal";

/**
 * EĞİTİMLERİMİZ — kategori kataloğu.
 *
 * ARAMA İÇİN AÇIK. Her kategorinin tam metni — tanım, arama ifadeleri,
 * soru-cevap, kazanımlar — HER ZAMAN DOM'dadır. Yalnızca açık olanın
 * gösterildiği bir sekme yapısı, tarayıcı botunun ve yanıt motorlarının
 * diğer dokuz kategoriyi hiç görmemesi demekti. Görsel olarak katlanır,
 * yapısal olarak katlanmaz: `<details>` içeriği kapalıyken de belgede durur.
 *
 * Kategori açılınca arkadaki 3B sahneye efekt bildiren bir kanal vardı
 * (`setWorldFx`); o sahne tanıtım sayfasından kaldırıldığında kanal da
 * kaldırıldı. `trainingSeoById` kayıtlarındaki `fx` alanı duruyor ama artık
 * hiçbir şeyi sürmüyor.
 *
 * ARAMA EKLERİ YALNIZCA TÜRKÇEDE. `trainingSeoById` kayıtlarındaki uzun
 * cevap, soru-cevap ve anahtar kelime listesi Türkçe arama talebine göre
 * yazılmıştır — "Batman drone eğitimi" ifadesi Türkçe arayan bir veliyi
 * karşılar. Bunları çevirmek, olmayan bir arama talebini varmış gibi
 * göstermek olurdu; ayrıca Arapça bir sayfada Türkçe anahtar kelime
 * rozetleri basmak okuru yanıltır. Diğer üç dilde bu bloklar GİZLENİR ve
 * açıklama olarak disiplinin çevrilmiş `detail` metni kullanılır — kapak
 * görselleri dilden bağımsız olduğu için her dilde durur.
 */

export function TrainingCatalog({ locale }: { locale: Locale }) {
  const [open, setOpen] = useState<string | null>(null);
  const t = ui(locale);
  const disciplines = localizedDisciplines(locale);
  const withSeoCopy = locale === defaultLocale;

  return (
    <div className="mt-14">
      <ol className="divide-y divide-white/8 border-y border-white/8">
        {disciplines.map((d, i) => {
          const seo = trainingSeoById.get(d.id);
          const isOpen = open === d.id;

          return (
            <li key={d.id}>
              <Reveal delay={Math.min(i, 6) * 50}>
                <details open={isOpen} className="group py-1">
                  <summary
                    id={`egitim-${d.id}`}
                    // Denetimli akordeon: aynı anda tek kategori açık kalsın
                    // diye açılışı tarayıcıya bırakmıyoruz. `open` prop'u
                    // React'ten geldiği için içerik kapalıyken de DOM'da.
                    onClick={(e) => {
                      e.preventDefault();
                      setOpen(isOpen ? null : d.id);
                    }}
                    className="flex cursor-pointer list-none items-start gap-4 py-6 [&::-webkit-details-marker]:hidden sm:gap-6"
                  >
                    <span className="czr-mono mt-1.5 shrink-0 text-[11px] tabular-nums text-czr-orange">
                      {d.code}
                    </span>

                    <span className="min-w-0 flex-1">
                      <h3 className="text-balance text-xl font-bold leading-snug text-white transition-colors duration-300 group-open:text-czr-orange sm:text-2xl">
                        {d.title}
                      </h3>
                      <p className="mt-1.5 text-[15px] leading-relaxed text-czr-ice/65">
                        {d.summary}
                      </p>
                    </span>

                    <span className="mt-1 flex shrink-0 items-center gap-3">
                      <span className="hidden rounded-full border border-white/12 px-2.5 py-0.5 czr-mono text-[10px] text-czr-ice/55 sm:inline">
                        {d.ageRange}
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

                  <div className="grid gap-8 pb-10 pl-0 pr-0 sm:pl-[68px] lg:grid-cols-3 lg:gap-10">
                    {/* Kategori kapağı — bölüm açıldığında yüklenir.
                        `loading="lazy"` ile on kapak birden inmez. */}
                    {seo?.cover ? (
                      <div className="czr-rim relative overflow-hidden rounded-2xl border border-white/10 lg:col-span-3">
                        <div className="relative aspect-[21/9]">
                          <Image
                            src={seo.cover}
                            alt=""
                            fill
                            sizes="(min-width: 1024px) 1100px, 92vw"
                            loading="lazy"
                            className="object-cover"
                          />
                          <span
                            aria-hidden="true"
                            className="absolute inset-0 bg-gradient-to-t from-czr-base/80 via-transparent to-czr-base/25"
                          />
                        </div>
                      </div>
                    ) : null}

                    {/* Yanıt motorlarının alıntılayacağı tanım */}
                    <div className="lg:col-span-2">
                      <p className="text-pretty text-[15px] leading-relaxed text-czr-ice/80 sm:text-base">
                        {withSeoCopy ? seo?.answer ?? d.detail : d.detail}
                      </p>

                      {withSeoCopy && seo?.faq?.length ? (
                        <dl className="mt-7 space-y-5 border-l border-czr-orange/25 pl-5">
                          {seo.faq.map((f) => (
                            <div key={f.q}>
                              <dt className="text-[15px] font-semibold text-white">{f.q}</dt>
                              <dd className="mt-1.5 text-[14px] leading-relaxed text-czr-ice/65">
                                {f.a}
                              </dd>
                            </div>
                          ))}
                        </dl>
                      ) : null}
                    </div>

                    <div className="space-y-7">
                      <div>
                        <h4 className="czr-mono text-[10px] uppercase tracking-[0.16em] text-czr-ice/45">
                          {t.endOfTerm}
                        </h4>
                        <ul className="mt-3 space-y-2">
                          {d.outcomes.map((o) => (
                            <li key={o} className="flex gap-2.5 text-[14px] text-czr-ice/75">
                              <span
                                aria-hidden="true"
                                className="mt-[7px] h-1 w-1 shrink-0 rounded-full bg-czr-emerald"
                              />
                              {o}
                            </li>
                          ))}
                        </ul>
                      </div>

                      {withSeoCopy && seo?.keywords?.length ? (
                        <div>
                          <h4 className="czr-mono text-[10px] uppercase tracking-[0.16em] text-czr-ice/45">
                            {t.searchesFor}
                          </h4>
                          <ul className="mt-3 flex flex-wrap gap-1.5">
                            {seo.keywords.map((k) => (
                              <li
                                key={k}
                                className="rounded-full border border-white/10 bg-white/[0.03] px-2.5 py-1 text-[11px] text-czr-ice/55"
                              >
                                {k}
                              </li>
                            ))}
                          </ul>
                        </div>
                      ) : null}
                    </div>
                  </div>
                </details>
              </Reveal>
            </li>
          );
        })}
      </ol>

      {withSeoCopy ? (
        <Reveal>
          <p className="mt-10 max-w-3xl text-pretty text-[14px] leading-relaxed text-czr-ice/55">
            {serviceAreaSentence}
          </p>
        </Reveal>
      ) : null}
    </div>
  );
}
