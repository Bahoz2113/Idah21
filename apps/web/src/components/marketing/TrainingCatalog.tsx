"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { disciplines } from "@/lib/seo/site";
import { serviceAreaSentence, trainingSeoById } from "@/lib/seo/trainings";
import { setWorldFx } from "./world/progress";
import { Reveal } from "./Reveal";

/**
 * EĞİTİMLERİMİZ — kategori kataloğu.
 *
 * İki işi aynı anda yapar:
 *
 *   1. ARAMA. Her kategorinin tam metni — tanım, arama ifadeleri, soru-cevap,
 *      kazanımlar — HER ZAMAN DOM'dadır. Yalnızca açık olanın gösterildiği
 *      bir sekme yapısı, tarayıcı botunun ve yanıt motorlarının diğer dokuz
 *      kategoriyi hiç görmemesi demekti. Görsel olarak katlanır, yapısal
 *      olarak katlanmaz: `<details>` içeriği kapalıyken de belgede durur.
 *
 *   2. SAHNE. Açılan kategori arkadaki dünyaya kendi animasyonunu bildirir
 *      (roketçilikte fırlatma, İHA'da sürü uçuşu). Bildirim `setWorldFx`
 *      ile mutable kutuya yazılır; sahne onu `useFrame` içinde okur, sayfa
 *      yeniden render olmaz.
 *
 * Fareyle üzerine gelmek de efekti tetikler — kullanıcı tıklamadan önce
 * kategorinin dünyada neye karşılık geldiğini görür. Fare ayrılınca son
 * AÇIK kategoriye dönülür, boşluğa değil; yoksa sahne titrerdi.
 */

export function TrainingCatalog() {
  const [open, setOpen] = useState<string | null>(null);
  const openRef = useRef<string | null>(null);

  useEffect(() => {
    openRef.current = open;
    const fx = open ? trainingSeoById.get(open)?.fx ?? null : null;
    setWorldFx(fx);
  }, [open]);

  // Sayfadan ayrılırken sahneyi temiz bırak.
  useEffect(() => () => setWorldFx(null), []);

  const preview = useCallback((id: string | null) => {
    const target = id ?? openRef.current;
    setWorldFx(target ? trainingSeoById.get(target)?.fx ?? null : null);
  }, []);

  return (
    <div className="mt-14">
      <ol className="divide-y divide-white/8 border-y border-white/8">
        {disciplines.map((d, i) => {
          const seo = trainingSeoById.get(d.id);
          const isOpen = open === d.id;

          return (
            <li key={d.id}>
              <Reveal delay={Math.min(i, 6) * 50}>
                <details
                  open={isOpen}
                  onMouseEnter={() => preview(d.id)}
                  onMouseLeave={() => preview(null)}
                  onFocus={() => preview(d.id)}
                  onBlur={() => preview(null)}
                  className="group py-1"
                >
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
                    {/* Yanıt motorlarının alıntılayacağı tanım */}
                    <div className="lg:col-span-2">
                      <p className="text-pretty text-[15px] leading-relaxed text-czr-ice/80 sm:text-base">
                        {seo?.answer ?? d.detail}
                      </p>

                      {seo?.faq?.length ? (
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
                          Dönem sonunda öğrenci
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

                      {seo?.keywords?.length ? (
                        <div>
                          <h4 className="czr-mono text-[10px] uppercase tracking-[0.16em] text-czr-ice/45">
                            Bu eğitim şu aramalarda
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

      <Reveal>
        <p className="mt-10 max-w-3xl text-pretty text-[14px] leading-relaxed text-czr-ice/55">
          {serviceAreaSentence}
        </p>
      </Reveal>
    </div>
  );
}
