"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { ScrollTrigger } from "@/lib/gsap";
import { sceneState, setActiveScene, type SceneState } from "@/lib/sceneState";

type ProgressKey = Extract<keyof SceneState, "launchpad" | "exploded" | "ascent">;

export interface ScrollSceneProps {
  id: string;
  /** SCENES dizisindeki indeks — HUD etiketi için */
  index: number;
  /** Ek scroll mesafesi (viewport katı). 0 → doğal akış, pin yok. */
  length?: number;
  /** İlerlemenin yazılacağı paylaşılan durum anahtarı */
  progressKey?: ProgressKey;
  children: ReactNode;
  className?: string;
}

/**
 * Sahne sarmalayıcısı.
 *
 * KRİTİK: Bu bir istemci bileşenidir ama `children` sunucudan gelir ve
 * öyle kalır. Metin sunucuda render edilir, burada yalnızca ilerleme ölçülür
 * (GEO kuralı K1/K2 — animasyon var olan DOM'u hareket ettirir, üretmez).
 *
 * Pin işi GSAP `pin` yerine CSS `position: sticky` ile yapılır: pin-spacer
 * kurgusu Lenis ile birlikte titremeye açıktır, sticky ise tarayıcı
 * seviyesinde ve `prefers-reduced-motion` altında da doğru davranır.
 */
export function ScrollScene({
  id,
  index,
  length = 0,
  progressKey,
  children,
  className = "",
}: ScrollSceneProps) {
  const outer = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = outer.current;
    if (!el) return;

    const trigger = ScrollTrigger.create({
      trigger: el,
      start: "top top",
      end: "bottom bottom",
      onUpdate: (self) => {
        if (progressKey) sceneState[progressKey] = self.progress;
      },
      onToggle: (self) => {
        if (self.isActive) setActiveScene(index);
      },
    });

    return () => trigger.kill();
  }, [index, progressKey]);

  const pinned = length > 0;

  return (
    <section
      ref={outer}
      id={id}
      data-scene={id}
      className={`relative ${className}`}
      style={pinned ? { height: `${(length + 1) * 100}svh` } : undefined}
    >
      {pinned ? (
        <div className="sticky top-0 h-svh overflow-hidden">{children}</div>
      ) : (
        children
      )}
    </section>
  );
}
