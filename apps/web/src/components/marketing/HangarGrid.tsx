"use client";

import { useEffect, useRef } from "react";
import { disciplines } from "@/lib/seo/site";

/**
 * 03 — EĞİTİM VE FAALİYET HANGARLARI
 *
 * Aşamalı geliştirme (progressive enhancement) ilkesiyle kuruldu:
 *
 *   Temel katman → 10 disiplin, semantik `<article>` ızgarası olarak
 *     sunucudan gelir. JavaScript hiç çalışmasa, GSAP yüklenmese veya
 *     kullanıcı hareket azaltma istese bile içeriğin TAMAMI okunabilir ve
 *     taranabilir kalır. SEO taşıyıcısı bu katmandır.
 *
 *   Sinematik katman → geniş ekranda GSAP ScrollTrigger bölümü sabitler
 *     (pin) ve hangar kapılarını dikey scroll'u yatay akışa çevirerek açar.
 *
 * GSAP kasıtlı olarak `useEffect` içinde dinamik import edilir: kütüphane
 * kök bundle'a girmez, yalnızca bölüme gerçekten ulaşan geniş ekran
 * kullanıcıları indirir.
 */
export function HangarGrid() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const track = trackRef.current;
    if (!section || !track) return;

    // Yatay pin yalnızca geniş ekranda anlamlı: mobilde hem dokunmatik
    // scroll'u ele geçirmek kullanıcıyı hapseder hem de kartlar okunmaz olur.
    const mediaOk = window.matchMedia("(min-width: 1024px)").matches;
    const motionOk = !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!mediaOk || !motionOk) return;

    let cleanup: (() => void) | undefined;
    let cancelled = false;

    void (async () => {
      const [{ default: gsap }, { ScrollTrigger }] = await Promise.all([
        import("gsap"),
        import("gsap/ScrollTrigger"),
      ]);
      if (cancelled) return;

      gsap.registerPlugin(ScrollTrigger);

      const ctx = gsap.context(() => {
        // Kat edilecek yatay mesafe = içerik genişliği - görünür genişlik
        const distance = () => track.scrollWidth - window.innerWidth + 96;

        const tween = gsap.to(track, {
          x: () => -distance(),
          ease: "none",
          scrollTrigger: {
            trigger: section,
            start: "top top",
            // Pin süresi yatay mesafeyle orantılı: kullanıcı ne kadar
            // kaydırırsa o kadar hangar geçer, hız tutarlı hissedilir.
            end: () => `+=${distance()}`,
            pin: true,
            scrub: 0.8,
            invalidateOnRefresh: true,
            anticipatePin: 1,
          },
        });

        // Kapı panelleri: kart görünüre girdikçe ayrılır
        track.querySelectorAll<HTMLElement>("[data-hangar-door]").forEach((door) => {
          gsap.to(door, {
            scaleY: 0,
            transformOrigin: "top center",
            ease: "none",
            scrollTrigger: {
              trigger: door,
              containerAnimation: tween,
              start: "left 88%",
              end: "left 42%",
              scrub: true,
            },
          });
        });
      }, section);

      cleanup = () => ctx.revert();
    })();

    return () => {
      cancelled = true;
      cleanup?.();
    };
  }, []);

  return (
    <div ref={sectionRef} className="relative lg:overflow-hidden">
      <div
        ref={trackRef}
        className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:flex lg:w-max lg:flex-nowrap lg:gap-6 lg:pr-24"
      >
        {disciplines.map((d, i) => (
          <article
            key={d.id}
            className="czr-glass-panel group relative overflow-hidden rounded-3xl p-7 transition-colors duration-500 ease-czr-cine hover:border-czr-orange/35 lg:w-[380px] lg:shrink-0 lg:p-8"
          >
            {/* Hangar kapısı — GSAP olmadan da CSS hover ile açılır */}
            <span
              aria-hidden="true"
              data-hangar-door
              className="pointer-events-none absolute inset-0 z-10 origin-top scale-y-0 bg-czr-hangar backdrop-blur-sm transition-transform duration-700 ease-czr-cine lg:scale-y-100 lg:group-hover:scale-y-0"
            >
              <span className="absolute inset-x-0 top-1/2 h-px bg-czr-orange/40" />
            </span>

            <div className="relative z-20">
              <div className="flex items-center justify-between">
                <span className="czr-mono text-[11px] text-czr-orange">{d.code}</span>
                <span className="rounded-full border border-white/10 px-2.5 py-0.5 czr-mono text-[10px] text-czr-ice/55">
                  {d.ageRange}
                </span>
              </div>

              <h3 className="mt-5 text-xl font-bold leading-snug text-white lg:text-2xl">
                {d.title}
              </h3>

              <p className="mt-3 text-[15px] leading-relaxed text-czr-ice/70">{d.summary}</p>

              <p className="mt-4 text-[13px] leading-relaxed text-czr-ice/45">{d.detail}</p>

              <ul className="mt-6 space-y-2">
                {d.outcomes.map((outcome) => (
                  <li key={outcome} className="flex items-start gap-2.5 text-[13px] text-czr-ice/65">
                    <span
                      aria-hidden="true"
                      className="mt-[7px] h-1 w-1 shrink-0 rounded-full bg-czr-emerald"
                    />
                    {outcome}
                  </li>
                ))}
              </ul>
            </div>

            {/* Sıra numarası — dekoratif derinlik */}
            <span
              aria-hidden="true"
              className="absolute -bottom-6 -right-2 z-0 text-[7rem] font-extrabold leading-none text-white/[0.035]"
            >
              {String(i + 1).padStart(2, "0")}
            </span>
          </article>
        ))}
      </div>
    </div>
  );
}
