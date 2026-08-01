"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { gsap, ScrollTrigger, prefersReducedMotion } from "@/lib/gsap";

/**
 * Satır maskesi girişi.
 *
 * GEO kuralı K2: metin SUNUCUDAN gelir. Bu bileşen `children`'ı üretmez,
 * yalnızca içindeki `.line-mask > span` düğümlerini hareket ettirir.
 * `prefers-reduced-motion` altında hiç dokunmaz — metin zaten yerindedir.
 */
export function Reveal({
  children,
  stagger = 0.06,
  className = "",
}: {
  children: ReactNode;
  stagger?: number;
  className?: string;
}) {
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (prefersReducedMotion()) return;
    const el = root.current;
    if (!el) return;

    const targets = el.querySelectorAll(".line-mask > span");
    if (targets.length === 0) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        targets,
        { yPercent: 110 },
        {
          yPercent: 0,
          duration: 1.1,
          ease: "power4.out",
          stagger,
          scrollTrigger: { trigger: el, start: "top 85%", once: true },
        },
      );
    }, el);

    ScrollTrigger.refresh();
    return () => ctx.revert();
  }, [stagger]);

  return (
    <div ref={root} className={className}>
      {children}
    </div>
  );
}
