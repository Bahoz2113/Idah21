"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import { gsap, ScrollTrigger, prefersReducedMotion } from "@/lib/gsap";
import { sceneState } from "@/lib/sceneState";

/**
 * Lenis yumuşak scroll + GSAP ticker senkronu.
 *
 * Lenis kendi rAF döngüsünü çalıştırırsa ScrollTrigger ile iki ayrı döngü
 * oluşur ve pinned sahnelerde titreme görülür. Bu yüzden Lenis'i GSAP
 * ticker'ına bağlıyoruz — tek döngü.
 *
 * Erişilebilirlik: `prefers-reduced-motion` açıksa Lenis hiç başlatılmaz,
 * tarayıcının doğal scroll'u kullanılır (AC4).
 */
export function SmoothScroll() {
  useEffect(() => {
    if (prefersReducedMotion()) {
      sceneState.reducedMotion = true;
      ScrollTrigger.refresh();
      return;
    }

    const lenis = new Lenis({ lerp: 0.09, wheelMultiplier: 1 });

    lenis.on("scroll", ScrollTrigger.update);

    const raf = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(raf);
      lenis.destroy();
    };
  }, []);

  return null;
}
