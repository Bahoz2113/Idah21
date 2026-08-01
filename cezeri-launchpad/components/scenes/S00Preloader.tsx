"use client";

import { useEffect, useRef, useState } from "react";
import { gsap, prefersReducedMotion } from "@/lib/gsap";

const BOOT_LINES = [
  "> CEZERI ROBOTECH // BATMAN",
  "> WEBGL CONTEXT ......... OK",
  "> SAHNE VERISI .......... OK",
  "> CLEARED FOR LAUNCH",
] as const;

/**
 * S00 — SİSTEM KONTROL
 *
 * Cezeri'nin su saati mekanizması SVG çizgi olarak çizilir, telemetri
 * satırları akar, ardından ekran ortadan hangar kapısı gibi açılır.
 *
 * Erişilebilirlik: `aria-hidden` + `prefers-reduced-motion` altında hiç
 * gösterilmez. İçerik zaten arkasında hazır — preloader yalnızca örtüdür.
 */
export function S00Preloader() {
  const root = useRef<HTMLDivElement>(null);
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (prefersReducedMotion()) {
      setDone(true);
      document.body.style.overflow = "";
      return;
    }

    document.body.style.overflow = "hidden";
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        onComplete: () => {
          document.body.style.overflow = "";
          setDone(true);
        },
      });

      tl.to("[data-boot-path]", {
        strokeDashoffset: 0,
        duration: 1.4,
        ease: "power2.inOut",
      })
        .from(
          "[data-boot-line]",
          { opacity: 0, x: -12, stagger: 0.14, duration: 0.3 },
          0.2,
        )
        .to("[data-boot-content]", { opacity: 0, duration: 0.35 }, "+=0.25")
        .to("[data-door='top']", { yPercent: -100, duration: 0.9, ease: "power4.inOut" }, "<")
        .to("[data-door='bottom']", { yPercent: 100, duration: 0.9, ease: "power4.inOut" }, "<");
    }, root);

    return () => {
      ctx.revert();
      document.body.style.overflow = "";
    };
  }, []);

  if (done) return null;

  return (
    <div
      ref={root}
      aria-hidden="true"
      className="fixed inset-0 z-50"
    >
      <div data-door="top" className="absolute inset-x-0 top-0 h-1/2 bg-void" />
      <div data-door="bottom" className="absolute inset-x-0 bottom-0 h-1/2 bg-void" />

      <div
        data-boot-content
        className="absolute inset-0 flex flex-col items-center justify-center gap-10"
      >
        {/* Cezeri su saati mekanizması — tek renk çizgi şema */}
        <svg
          width="150"
          height="150"
          viewBox="0 0 100 100"
          fill="none"
          className="text-cyber"
        >
          <g
            data-boot-path
            stroke="currentColor"
            strokeWidth="1"
            strokeLinecap="round"
            style={{ strokeDasharray: 620, strokeDashoffset: 620 }}
          >
            <circle cx="50" cy="50" r="30" />
            <circle cx="50" cy="50" r="20" />
            <circle cx="50" cy="50" r="5" />
            <path d="M50 20 V80 M20 50 H80" />
            <path d="M28.8 28.8 L71.2 71.2 M71.2 28.8 L28.8 71.2" />
            <path d="M50 8 L54 16 H46 Z" className="text-ignition" stroke="#ff6f00" />
          </g>
        </svg>

        <div className="w-[min(90vw,26rem)] space-y-1">
          {BOOT_LINES.map((line, i) => (
            <p
              key={line}
              data-boot-line
              className={`t-mono ${i === BOOT_LINES.length - 1 ? "text-ignition" : "text-ash"}`}
            >
              {line}
            </p>
          ))}
        </div>
      </div>
    </div>
  );
}
