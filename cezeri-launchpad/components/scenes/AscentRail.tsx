"use client";

import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger, prefersReducedMotion } from "@/lib/gsap";

/**
 * Sol kenardaki tırmanış cetveli + yıldız katmanı.
 *
 * Yüzde göstergesi scroll'a kilitlidir ve BİRİM TAŞIMAZ — doğrulanmış bir
 * irtifa rakamı olmadığı için metre yazmıyoruz. Gerçek telemetri geldiğinde
 * `lib/facts.ts` doldurulur ve burası metreye çevrilir.
 */
export function AscentRail() {
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = root.current;
    if (!el || prefersReducedMotion()) return;

    const readout = el.querySelector<HTMLElement>("[data-readout]");
    const marker = el.querySelector<HTMLElement>("[data-marker]");
    const stars = el.querySelector<HTMLElement>("[data-stars]");
    const scene = el.closest("[data-scene]");
    if (!scene) return;

    const state = { p: 0 };
    const ctx = gsap.context(() => {
      gsap.to(state, {
        p: 1,
        ease: "none",
        scrollTrigger: {
          trigger: scene,
          start: "top top",
          end: "bottom bottom",
          scrub: true,
          onUpdate: () => {
            const pct = Math.round(state.p * 100);
            if (readout) readout.textContent = String(pct).padStart(3, "0");
            if (marker) marker.style.bottom = `${state.p * 100}%`;
            // 40%'ten sonra yıldızlar belirir
            if (stars)
              stars.style.opacity = String(Math.max(0, (state.p - 0.4) / 0.6));
          },
        },
      });
    }, el);

    ScrollTrigger.refresh();
    return () => ctx.revert();
  }, []);

  return (
    <div ref={root} aria-hidden="true">
      {/* Yıldız alanı */}
      <div
        data-stars
        className="pointer-events-none absolute inset-0 -z-10 opacity-0"
        style={{
          backgroundImage:
            "radial-gradient(1.5px 1.5px at 18% 22%, #fff, transparent), radial-gradient(1px 1px at 63% 12%, #fff, transparent), radial-gradient(1.5px 1.5px at 82% 35%, #fff, transparent), radial-gradient(1px 1px at 34% 48%, #fff, transparent), radial-gradient(1px 1px at 72% 62%, #fff, transparent), radial-gradient(1.5px 1.5px at 9% 68%, #fff, transparent)",
        }}
      />

      {/* Tırmanış cetveli */}
      <div className="pointer-events-none absolute bottom-[12%] left-6 top-[12%] hidden w-px bg-[var(--hairline)] md:block">
        <span
          data-marker
          className="absolute -left-1 block h-2 w-2 rounded-full bg-ignition transition-none"
          style={{ bottom: "0%" }}
        />
        <span
          data-readout
          className="t-mono absolute -left-1 bottom-0 translate-y-8 text-ignition tabular-nums"
          style={{ fontSize: "clamp(2rem,5vw,4rem)", letterSpacing: "0.02em" }}
        >
          000
        </span>
      </div>
    </div>
  );
}
