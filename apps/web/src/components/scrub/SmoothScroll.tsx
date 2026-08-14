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

    /**
     * ÇAPALI ADRESLE AÇILIŞ.
     *
     * `cezerirobotech.com/#basin` doğrudan açıldığında tarayıcı bölüme
     * atlar, ama Lenis kurulurken kendi konumunu sıfırdan kurar ve o
     * atlamayı ezer. Ölçüldü: üç denemede de sayfa ~800–1000 px'te,
     * yani hero'nun içinde kalıyordu — bölüm 13,7 bin piksel aşağıdaydı.
     *
     * Menüdeki bağlantılar paylaşılabilir adres ürettiği için bu
     * yarım kalmış bir işti: adresi alan kişi bölümü değil hero'yu
     * görüyordu. Lenis ayağa kalktıktan sonra atlamayı biz yapıyoruz.
     *
     * `immediate` — animasyonsuz. Kullanıcı o bölümü istedi; 13 bin
     * pikseli süzülerek geçmek beklemekten başka bir şey değil.
     *
     * Gecikme, hero'nun 500vh yüksekliği ve video ölçüleri yerleşene
     * kadar bekler; erken atlarsak hedef yanlış yere düşer.
     */
    const hash = window.location.hash.slice(1);
    let jump: number | undefined;
    let settle: number | undefined;
    let stopGrow: (() => void) | undefined;
    let touched = false;
    const markTouched = () => {
      touched = true;
    };

    if (hash) {
      const goHash = () => {
        // Kullanıcı bu arada kendi kaydırdıysa yerini elinden almayız.
        if (touched) return;
        const el = document.getElementById(hash);
        if (el) lenis.scrollTo(el, { immediate: true });
      };

      // BİR KEZ YETMİYOR — iki ayrı sebepten:
      //
      // 1. Video ölçüleri gelince hero `ScrollTrigger.refresh()` çağırıyor,
      //    yükseklikler yeniden hesaplanıyor ve sayfa kayıyor. Ölçüldü:
      //    bölüm 104 px'te doğru duruyorken 2473 px yukarı kaçıyordu.
      //
      // 2. Görseller tembel yükleniyor. Derin bir bölüme atlayınca ÜSTTEKİ
      //    görseller henüz inmemiş oluyor, belge kısa, hedef yukarıda.
      //    Görseller indikçe üstteki içerik büyüyor ve hedefi aşağı itiyor.
      //    Ölçüldü: sayfa ne kadar aşağıdaysa sapma o kadar büyük —
      //    #egitimler 104 px (doğru), #atolye 418, #basin 566,
      //    #iletisim 1307 px eksik kalıyordu.
      //
      // Bu yüzden konum zamanlayıcıya değil SEBEPLERE bağlandı: hem
      // tetikleyici yeniden hesabında hem de belge yüksekliği her
      // değiştiğinde teyit edilir.
      for (const ev of ["wheel", "touchstart", "keydown", "pointerdown"]) {
        window.addEventListener(ev, markTouched, { passive: true, once: true });
      }

      jump = window.setTimeout(goHash, 350);
      ScrollTrigger.addEventListener("refresh", goHash);

      const grow = new ResizeObserver(goHash);
      grow.observe(document.documentElement);
      stopGrow = () => grow.disconnect();

      // Yerleşme bitince dinleyiciler kalkar: sonraki yeniden hesaplamalar
      // (pencere boyutu değişimi gibi) kullanıcıyı yerinden oynatmasın.
      settle = window.setTimeout(() => {
        ScrollTrigger.removeEventListener("refresh", goHash);
        grow.disconnect();
        touched = true;
      }, 6000);
    }

    return () => {
      if (jump !== undefined) window.clearTimeout(jump);
      if (settle !== undefined) window.clearTimeout(settle);
      stopGrow?.();
      for (const ev of ["wheel", "touchstart", "keydown", "pointerdown"]) {
        window.removeEventListener(ev, markTouched);
      }
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
 *
 * HİÇBİR DALDA OFSET YOK — kasıtlı. Sabit çubuğun payı tek bir yerde,
 * CSS'teki `scroll-margin-top` kuralında duruyor (bkz. `marketing.css`)
 * ve dört yolun dördü de ona uyuyor: Lenis, `scrollIntoView`, tarayıcının
 * kendi çapa atlaması ve yenilemeden sonraki konum geri yüklemesi. Son
 * ikisi bu fonksiyondan hiç geçmez; pay yalnızca burada verilseydi onlar
 * açıkta kalırdı.
 *
 * Buraya ayrıca ofset yazmak payı İKİ KEZ uygular. Denendi ve ölçüldü:
 * çubuk 89 px iken bölüm başlığı 193 px aşağıya düşüyordu (89 + 104).
 */
export function scrollToSection(id: string) {
  const el = document.getElementById(id);
  if (!el) return;

  const lenis = typeof window !== "undefined" ? window.__lenis : undefined;
  if (lenis) {
    lenis.scrollTo(el);
  } else {
    el.scrollIntoView({ behavior: "smooth", block: "start" });
  }
}
