"use client";

import { useEffect, useRef, useState } from "react";
import { observeWorld, STATIONS, worldClock } from "./progress";

/**
 * YÜRÜYÜŞ RAYI — ekranın sağ kenarında duran ilerleme göstergesi.
 *
 * Kinematik bir sayfada kullanıcı "sayfanın ne kadarını okudum" değil,
 * "bu mekânın neresindeyim" sorusunu sorar. Ray bu soruyu yanıtlar:
 * yürüyüşün yedi durağı, hangisinde olduğumuz ve oraya atlama imkânı.
 *
 * Sahneden bağımsız çalışır — WebGL yüklenmese de doğru değeri gösterir.
 * Sürekli değişen dolgu yüksekliği DOM stiline yazılır (React state'ine
 * değil); yalnızca aktif durak değiştiğinde bir kez render olur.
 */

export function StationRail() {
  const [active, setActive] = useState(0);
  const fill = useRef<HTMLSpanElement>(null);
  const activeRef = useRef(0);

  useEffect(() => {
    const stop = observeWorld(() => {
      const p = worldClock.progress;

      if (fill.current) fill.current.style.transform = `scaleY(${p})`;

      // Duraklar sayfaya eşit aralıkla dağılmaz; DOM'daki gerçek konumları
      // okunur ki gösterge içerikle örtüşsün.
      let next = 0;
      for (let i = 0; i < STATIONS.length; i += 1) {
        const el = document.getElementById(STATIONS[i].id);
        if (el && el.getBoundingClientRect().top <= window.innerHeight * 0.42) next = i;
      }

      if (next !== activeRef.current) {
        activeRef.current = next;
        setActive(next);
      }
    });

    return stop;
  }, []);

  return (
    <nav
      aria-label="Yürüyüş durakları"
      className="pointer-events-none fixed right-5 top-1/2 z-30 hidden -translate-y-1/2 lg:block"
    >
      <ol className="relative flex flex-col gap-5 pl-5">
        {/* Ray ve dolgusu */}
        <span aria-hidden="true" className="absolute left-0 top-1 h-[calc(100%-8px)] w-px bg-white/12" />
        <span
          ref={fill}
          aria-hidden="true"
          className="absolute left-0 top-1 h-[calc(100%-8px)] w-px origin-top bg-czr-orange"
          style={{ transform: "scaleY(0)" }}
        />

        {STATIONS.map((s, i) => {
          const current = i === active;
          return (
            <li key={s.id} className="pointer-events-auto -ml-5 flex items-center gap-3">
              <a
                href={`#${s.id}`}
                aria-current={current ? "true" : undefined}
                className="group flex items-center gap-3 pl-[13px]"
              >
                <span
                  aria-hidden="true"
                  className={`h-1.5 w-1.5 shrink-0 rounded-full transition duration-500 ease-czr-cine ${
                    current ? "scale-[1.9] bg-czr-orange" : "bg-white/25 group-hover:bg-white/60"
                  }`}
                />
                <span
                  className={`czr-mono text-[10px] uppercase tracking-[0.18em] transition duration-500 ease-czr-cine ${
                    current
                      ? "text-czr-orange opacity-100"
                      : "text-czr-ice/50 opacity-0 group-hover:opacity-100"
                  }`}
                >
                  <span className="tabular-nums">{s.chapter}</span> {s.label}
                </span>
              </a>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
