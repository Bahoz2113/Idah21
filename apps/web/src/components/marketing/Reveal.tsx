"use client";

import { useEffect, useRef, useState, type ElementType, type ReactNode } from "react";

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
 * ihtiyacı "görünür oldu mu" bilgisidir. IntersectionObserver bunu tarayıcı
 * yerlisi olarak, ana iş parçacığını meşgul etmeden yapar; GSAP ScrollTrigger
 * yalnızca gerçek scroll-scrubbing gereken hangar bölümünde kullanılır.
 *
 * Gözlemci ilk tetiklemeden sonra kendini söker — sayfa boyunca aktif kalan
 * onlarca gözlemci birikmez.
 */
export function Reveal({ children, delay = 0, as: Tag = "div", className = "" }: RevealProps) {
  const ref = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    // IntersectionObserver desteklenmiyorsa içerik gizli kalmamalı.
    if (typeof IntersectionObserver === "undefined") {
      setVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -10% 0px" },
    );

    observer.observe(node);
    return () => observer.disconnect();
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
