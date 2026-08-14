"use client";

import { useEffect, useRef, useState, type ElementType, type ReactNode } from "react";
import { observeScroll } from "./scroll-clock";

type RevealProps = {
  children: ReactNode;
  /** Gecikme (ms) — kardeş elemanlarda kademeli giriş için. */
  delay?: number;
  /** Sarmalayıcı etiket; semantik yapıyı bozmamak için değiştirilebilir. */
  as?: ElementType;
  className?: string;
};

/**
 * Scroll ile ortaya çıkış sarmalayıcısı.
 *
 * Neden GSAP değil: bu davranış sayfada onlarca kez tekrar eder ve tek
 * ihtiyacı "görünür oldu mu" bilgisidir; koca bir animasyon kütüphanesi
 * bunun için ilk yük bütçesine giremez.
 *
 * Neden IntersectionObserver DEĞİL — ölçülmüş bir hata:
 *
 * IO yalnızca kesişim eşiği AŞILDIĞINDA haber verir. Kaydırma çubuğu
 * sürüklendiğinde ya da menüden bir bölüme atlandığında aradaki bloklar
 * ekrana hiç girmeden geçilir; "görünmüyordu, hâlâ görünmüyor" bir olay
 * üretmez. O bloklar KALICI OLARAK GİZLİ kalıyordu.
 *
 * Ölçüm: 1440×900'de kaydırma çubuğu bir hamlede sona sürüklendiğinde
 * 77 bloktan 45'i gizli kalıyordu — eğitim kataloğunun kartları dâhil.
 * Kullanıcı sayfanın yarısını boş görüyordu.
 *
 * Bunun yerine konum rAF ile kısıtlanmış tek bir ölçümden okunur. Blok
 * görünür olunca kendi aboneliğini söker: sayfa okundukça ölçüm sayısı
 * 77'den sıfıra iner, hiçbir dinleyici birikmez.
 */
export function Reveal({ children, delay = 0, as: Tag = "div", className = "" }: RevealProps) {
  const ref = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const stop = observeScroll(() => {
      const rect = node.getBoundingClientRect();

      // Üst kenar ekranın alt onda birine girdiğinde açılır. Tek koşul
      // iki durumu birden kapsar: aşağıdan gelen blokta değer küçülerek
      // eşiğe iner, ATLANMIŞ blokta ise zaten negatiftir — hızlı
      // kaydırmada hiçbir blok geride kalmaz.
      if (rect.top < window.innerHeight * 0.9) {
        setVisible(true);
        stop();
      }
    });

    return stop;
  }, []);

  return (
    <Tag
      ref={ref as never}
      className={`czr-reveal ${className}`}
      data-visible={visible}
      style={{ ["--czr-delay" as string]: `${delay}ms` }}
    >
      {children}
    </Tag>
  );
}
