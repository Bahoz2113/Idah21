"use client";

import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger, prefersReducedMotion } from "@/lib/gsap";

/** Verilen diş sayısı için SVG dişli yolu üretir — prosedürel, asset yok. */
function gearPath(teeth: number, outer: number, root: number): string {
  const step = (Math.PI * 2) / teeth;
  const pts: string[] = [];
  for (let i = 0; i < teeth; i++) {
    const a = i * step;
    const angles: [number, number][] = [
      [a, root],
      [a + step * 0.22, outer],
      [a + step * 0.5, outer],
      [a + step * 0.72, root],
    ];
    for (const [ang, r] of angles) {
      pts.push(`${(Math.cos(ang) * r).toFixed(2)},${(Math.sin(ang) * r).toFixed(2)}`);
    }
  }
  return `M${pts.join("L")}Z`;
}

const GEARS = [
  { teeth: 24, outer: 100, root: 84, hub: 26, cx: 0, cy: 0, dir: 1 },
  { teeth: 16, outer: 66, root: 55, hub: 18, cx: 152, cy: -92, dir: -1 },
  { teeth: 12, outer: 50, root: 41, hub: 14, cx: -128, cy: 96, dir: 1 },
] as const;

/**
 * Scroll'a bağlı dişli kümesi. Sağ tarafta, metnin arkasında durur.
 * Dekoratiftir — `aria-hidden`; anlam metinde taşınır.
 */
export function MethodGears() {
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = root.current;
    if (!el || prefersReducedMotion()) return;

    const scene = el.closest("[data-scene]");
    if (!scene) return;

    const ctx = gsap.context(() => {
      el.querySelectorAll<SVGGElement>("[data-gear]").forEach((g) => {
        const dir = Number(g.dataset.dir ?? 1);
        gsap.to(g, {
          rotation: 360 * dir,
          transformOrigin: "center",
          svgOrigin: `${g.dataset.cx} ${g.dataset.cy}`,
          ease: "none",
          scrollTrigger: {
            trigger: scene,
            start: "top top",
            end: "bottom bottom",
            scrub: 1,
          },
        });
      });
    }, el);

    ScrollTrigger.refresh();
    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={root}
      aria-hidden="true"
      className="pointer-events-none absolute right-0 top-1/2 hidden -translate-y-1/2 opacity-60 lg:block"
    >
      <svg width="560" height="560" viewBox="-280 -280 560 560" fill="none">
        {GEARS.map((g, i) => (
          <g
            key={i}
            data-gear
            data-dir={g.dir}
            data-cx={g.cx}
            data-cy={g.cy}
            transform={`translate(${g.cx} ${g.cy})`}
          >
            <path
              d={gearPath(g.teeth, g.outer, g.root)}
              stroke={i === 0 ? "#ff6f00" : "rgba(255,255,255,.22)"}
              strokeWidth="1.5"
              fill="none"
            />
            <circle
              cx="0"
              cy="0"
              r={g.hub}
              stroke={i === 0 ? "#ff6f00" : "rgba(255,255,255,.22)"}
              strokeWidth="1.5"
              fill="none"
            />
          </g>
        ))}
      </svg>
    </div>
  );
}
