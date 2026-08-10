"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect, useRef, type ElementType, type ReactNode } from "react";

/**
 * BÖLÜM AÇIĞA ÇIKARMA.
 *
 * Ölçülü hareket: hafif dikey kayma ve opaklık. Ölçek değişimi yok —
 * büyüyerek giren metin bloğu editoryal bir sayfada ucuz durur.
 *
 * `gsap.context` ile kapsanır; `revert()` bileşene ait bütün tween ve
 * ScrollTrigger'ları tek hamlede söker. Strict Mode iki kez monte
 * ettiğinde geride yinelenen tetikleyici kalmaz.
 *
 * Neden IntersectionObserver değil: IO yalnızca kesişim eşiği aşıldığında
 * haber verir. Kaydırma çubuğu sürüklendiğinde aradaki bloklar ekrana hiç
 * girmeden geçilir ve hiçbir olay üretilmez — o bloklar kalıcı olarak
 * gizli kalır. (Bu hata sitenin `Reveal` bileşeninde ölçüldü: 1440×900'de
 * sona atlayınca 77 bloktan 45'i boş kalıyordu.) ScrollTrigger konumdan
 * hesap yaptığı için aynı sorunu yapısal olarak yaşamaz.
 *
 * Başlangıç gizliliği CSS'te (`.scrub-reveal`) tanımlıdır; JavaScript
 * yüklenmeden önce bir görünürlük flaşı oluşmaz. Azaltılmış harekette
 * CSS öğeyi zaten görünür bırakır ve burada hiçbir tetikleyici kurulmaz.
 */
export function ScrubReveal({
  children,
  as: Tag = "div",
  delay = 0,
  className = "",
}: {
  children: ReactNode;
  as?: ElementType;
  delay?: number;
  className?: string;
}) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      gsap.fromTo(
        node,
        { opacity: 0, y: 28 },
        {
          opacity: 1,
          y: 0,
          duration: 0.9,
          delay: delay / 1000,
          ease: "power3.out",
          scrollTrigger: {
            trigger: node,
            // Bloğun üstü ekranın alt onda birine girdiğinde başlar.
            start: "top 90%",
            once: true,
          },
        },
      );
    }, node);

    return () => ctx.revert();
  }, [delay]);

  return (
    <Tag ref={ref as never} className={`scrub-reveal ${className}`}>
      {children}
    </Tag>
  );
}
