"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import { useEffect, type ReactNode } from "react";

/**
 * YUMUŞAK KAYDIRMA SAĞLAYICISI.
 *
 * Tek bir kural bu dosyanın tamamını açıklar: **sayfada tek bir saat vardır.**
 *
 * Lenis kendi `requestAnimationFrame` döngüsünü kurmaz; GSAP'in ticker'ından
 * beslenir. İkinci bir döngü kurulsaydı iki saat birbirine göre kayardı:
 * ScrollTrigger bir karede, video araması başka bir karede güncellenir ve
 * kaydırma sırasında görüntü titrerdi. Hero'nun kare kare kazınması bu tek
 * saat disiplinine bağlıdır.
 *
 * `lagSmoothing(0)`: GSAP varsayılan olarak uzun karelerden sonra zamanı
 * "toparlar". Kaydırmaya bağlı bir sahnede bu toparlama sıçrama üretir —
 * kapatılır.
 *
 * Örnek `window.__lenis` üzerinden yayınlanır; menü ve CTA bağlantıları
 * bölümlere onunla gider. Yerel `scrollTo` kullanılsaydı Lenis'in kendi
 * konumu ile tarayıcının konumu ayrışırdı.
 */

declare global {
  interface Window {
    __lenis?: Lenis;
  }
}

export function SmoothScroll({ children }: { children: ReactNode }) {
  useEffect(() => {
    // Azaltılmış hareket isteyen kullanıcıda Lenis hiç kurulmaz; tarayıcının
    // kendi kaydırması kullanılır. Yumuşatma da bir harekettir.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    gsap.registerPlugin(ScrollTrigger);

    const lenis = new Lenis({ lerp: 0.075, smoothWheel: true });
    window.__lenis = lenis;

    lenis.on("scroll", ScrollTrigger.update);

    const tick = (time: number) => {
      // GSAP saniye verir, Lenis milisaniye bekler.
      lenis.raf(time * 1000);
    };

    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    return () => {
      // Strict Mode ikinci kez monte ettiğinde geride ne ticker ne dinleyici
      // ne de örnek kalmalı; aksi hâlde iki Lenis aynı sayfayı sürüklerdi.
      lenis.off("scroll", ScrollTrigger.update);
      gsap.ticker.remove(tick);
      lenis.destroy();
      if (window.__lenis === lenis) delete window.__lenis;
    };
  }, []);

  return <>{children}</>;
}

/**
 * Bölüme kaydırma — Lenis varsa onunla, yoksa yerel davranışla.
 *
 * Menü ve CTA'lar bunu çağırır. Azaltılmış harekette Lenis kurulmadığı için
 * ikinci dal her zaman gerekli.
 */
export function scrollToSection(id: string) {
  const el = document.getElementById(id);
  if (!el) return;

  const lenis = typeof window !== "undefined" ? window.__lenis : undefined;
  if (lenis) {
    lenis.scrollTo(el, { offset: -72 });
  } else {
    el.scrollIntoView({ behavior: "smooth", block: "start" });
  }
}
