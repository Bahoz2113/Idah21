"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { gsap, ScrollTrigger, prefersReducedMotion } from "@/lib/gsap";

/**
 * Hangar kapısı geçişleri.
 *
 * Üç lab paneli üst üste durur; scroll ilerledikçe `clip-path` ile sırayla
 * açılır. Panellerin İÇERİĞİ sunucudan gelir (GEO kuralı K1) — burada
 * yalnızca görünürlük animasyonu vardır.
 *
 * `prefers-reduced-motion` altında animasyon kurulmaz ve üç panel de
 * dikey akışta okunur hale getirilir (AC4).
 */
export function HangarDoors({ children }: { children: ReactNode }) {
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = root.current;
    if (!el) return;

    const doors = el.querySelectorAll<HTMLElement>("[data-door]");
    if (doors.length === 0) return;

    if (prefersReducedMotion()) {
      doors.forEach((d) => {
        d.style.position = "relative";
        d.style.opacity = "1";
        d.style.clipPath = "none";
      });
      el.style.height = "auto";
      return;
    }

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: el.closest("[data-scene]"),
          start: "top top",
          end: "bottom bottom",
          scrub: 1,
        },
      });

      doors.forEach((door, i) => {
        if (i === 0) {
          gsap.set(door, { opacity: 1, clipPath: "inset(0% 0% 0% 0%)" });
          return;
        }
        gsap.set(door, { opacity: 0, clipPath: "inset(0% 0% 100% 0%)" });
        tl.to(
          door,
          {
            opacity: 1,
            clipPath: "inset(0% 0% 0% 0%)",
            duration: 1,
            ease: "power2.inOut",
          },
          i,
        ).to(doors[i - 1], { opacity: 0, duration: 0.6 }, i + 0.4);
      });
    }, el);

    ScrollTrigger.refresh();
    return () => ctx.revert();
  }, []);

  return (
    <div ref={root} className="h-full">
      {children}
    </div>
  );
}
