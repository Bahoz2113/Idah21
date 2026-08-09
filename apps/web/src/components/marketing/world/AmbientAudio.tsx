"use client";

import { useEffect, useRef, useState } from "react";

/**
 * HANGAR AMBİYANSI — sessiz varsayılan, isteğe bağlı ses.
 *
 * Ses otomatik başlamaz. Tarayıcılar zaten engelliyor; engellemeseler de
 * ziyaretçinin izni olmadan ses çalmak saygısızlık olurdu. Düğme kapalı
 * durumda başlar ve tercih `localStorage`'da saklanır.
 *
 * Dosya (~160 kB opus) yalnızca kullanıcı sesi AÇTIĞINDA indirilir:
 * `preload="none"` ve kaynak elemanları ilk tıklamada bağlanır. Sesi hiç
 * açmayan ziyaretçi tek bayt indirmez.
 */

const STORAGE_KEY = "czr-ambient";
const TARGET_VOLUME = 0.34;

export function AmbientAudio() {
  const [on, setOn] = useState(false);
  const [ready, setReady] = useState(false);
  const audio = useRef<HTMLAudioElement>(null);
  const fade = useRef<number | null>(null);

  // Bileşen yalnızca istemcide anlamlı; SSR çıktısında düğme görünmesin ki
  // JS yüklenmeden basılıp hiçbir şey olmasın.
  useEffect(() => setReady(true), []);

  useEffect(() => {
    return () => {
      if (fade.current !== null) window.clearInterval(fade.current);
    };
  }, []);

  function rampTo(target: number, onDone?: () => void) {
    const el = audio.current;
    if (!el) return;
    if (fade.current !== null) window.clearInterval(fade.current);

    // Ani başlayan/kesilen ambiyans rahatsız eder; 600 ms'lik rampa
    // sesi mekâna girip çıkıyormuş gibi taşır.
    fade.current = window.setInterval(() => {
      const step = target > el.volume ? 0.02 : -0.02;
      const next = el.volume + step;

      if ((step > 0 && next >= target) || (step < 0 && next <= target)) {
        el.volume = Math.max(0, Math.min(1, target));
        if (fade.current !== null) window.clearInterval(fade.current);
        fade.current = null;
        onDone?.();
        return;
      }
      el.volume = Math.max(0, Math.min(1, next));
    }, 24);
  }

  async function toggle() {
    const el = audio.current;
    if (!el) return;

    if (on) {
      rampTo(0, () => el.pause());
      setOn(false);
      try {
        window.localStorage.setItem(STORAGE_KEY, "off");
      } catch {}
      return;
    }

    try {
      el.volume = 0;
      await el.play();
      rampTo(TARGET_VOLUME);
      setOn(true);
      window.localStorage.setItem(STORAGE_KEY, "on");
    } catch {
      // Oynatma reddedildiyse (nadiren) düğme kapalı kalır; sayfa etkilenmez.
      setOn(false);
    }
  }

  if (!ready) return null;

  return (
    // Sol alt köşe hero'nun hızlı iletişim şeridine ait; ambiyans sağ alta
    // çekildi. Yürüyüş rayı sağda ama dikeyde ortada, çakışma yok.
    // Telefonda tamamen gizli: orada ekranın alt şeridi içeriğin kendisi.
    <div className="fixed bottom-6 right-6 z-40 hidden sm:block">
      <audio ref={audio} loop preload="none">
        <source src="/assets/audio/hangar-ambiyans.opus" type="audio/ogg; codecs=opus" />
        <source src="/assets/audio/hangar-ambiyans.m4a" type="audio/mp4" />
      </audio>

      <button
        type="button"
        onClick={toggle}
        aria-pressed={on}
        className="czr-glass-panel group flex items-center gap-3 rounded-full py-2.5 pl-3 pr-4 transition duration-500 ease-czr-cine hover:border-czr-orange/40"
      >
        {/* Üç çubuklu seviye göstergesi: açıkken dalgalanır, kapalıyken düz. */}
        <span aria-hidden="true" className="flex h-4 w-4 items-end justify-between">
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className={`w-[3px] rounded-sm transition-all duration-500 ease-czr-cine ${
                on ? "bg-czr-orange" : "bg-czr-ice/40"
              }`}
              style={{
                height: on ? undefined : "4px",
                animation: on ? `czr-eq 900ms ${i * 160}ms ease-in-out infinite alternate` : undefined,
              }}
            />
          ))}
        </span>

        <span className="czr-mono text-[10px] uppercase tracking-[0.16em] text-czr-ice/70 transition group-hover:text-czr-ice">
          {on ? "Ambiyans açık" : "Ambiyans"}
        </span>
      </button>
    </div>
  );
}
