"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { gsap, ScrollTrigger, prefersReducedMotion } from "@/lib/gsap";

/**
 * Dikey scroll'u yatay harekete çevirir.
 *
 * Mobilde ve `prefers-reduced-motion` altında hiç kurulmaz; ray doğal
 * `overflow-x` ile parmakla kaydırılır. Bu bir gerileme değil, o bağlamda
 * daha doğru olan etkileşim (AC4/AC6).
 */
export function HorizontalTrack({ children }: { children: ReactNode }) {
  const viewport = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const vp = viewport.current;
    const tr = track.current;
    if (!vp || !tr) return;

    const isMobile = window.matchMedia("(max-width: 767px)").matches;
    if (isMobile || prefersReducedMotion()) {
      vp.style.overflowX = "auto";
      return;
    }

    const scene = vp.closest("[data-scene]");
    if (!scene) return;

    const ctx = gsap.context(() => {
      const distance = () => Math.max(0, tr.scrollWidth - vp.clientWidth);
      gsap.to(tr, {
        x: () => -distance(),
        ease: "none",
        scrollTrigger: {
          trigger: scene,
          start: "top top",
          end: "bottom bottom",
          scrub: 1,
          invalidateOnRefresh: true,
        },
      });
    }, vp);

    ScrollTrigger.refresh();
    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={viewport}
      className="w-full overflow-x-hidden px-6 md:px-16"
      style={{ scrollbarWidth: "none" }}
    >
      <div ref={track} className="flex gap-5 will-change-transform">
        {children}
      </div>
    </div>
  );
}
